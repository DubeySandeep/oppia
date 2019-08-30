// Copyright 2019 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Directive for show and review contributions.
 */
require(
  'pages/community-dashboard-page/login-required-message/' +
  'login-required-message.directive.ts');

require(
  'pages/community-dashboard-page/services/' +
  'contribution-and-review.services.ts');
require('services/SuggestionModalService.ts');

require('filters/format-rte-preview.filter.ts');

angular.module('oppia').directive('contributionsAndReview', [
  'UrlInterpolationService', function(
      UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {
      },
      bindToController: {},
      templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
        '/pages/community-dashboard-page/contributions-and-review/' +
        'contributions-and-review.directive.html'),
      controllerAs: '$ctrl',
      controller: [
        '$filter', '$http', '$scope', '$uibModal',
        'ContributionAndReviewService', 'UserService',
        function(
            $filter, $http, $scope, $uibModal,
            ContributionAndReviewService, UserService) {
          var SUGGETION_LABELS = {
            review: {
              text: 'Awaiting review',
              color: '#eeeeee'
            }
            accepted: {
              text: 'Accepted',
              color: '#8ed274'
            },
            rejected: {
              text: 'Rejected',
              color: '#e76c8c'
            }
          }
          var ctrl = this;
          var username = null;
          ctrl.isAdmin = false;
          ctrl.userDeatilsLoading = true;
          ctrl.userIsLoggedIn = false;
          ctrl.contributions = {};
          ctrl.contributionSummaries = [];
          ctrl.contributionsDataLoading = true;
          ctrl.reviewTabActive = false;

          var getTranslationContributionsSummary = function() {
            var translationContributionsSummaryList = [];
            Object.keys(ctrl.contributions).forEach(function(key) {
              var suggestion = ctrl.contributions[key].suggestion;
              var details = ctrl.contributions[key].details;
              var requiredData = {};
              var change = suggestion.change;
              requiredData['heading'] = $filter('formatRtePreview')(
                change.translation_html);
              requiredData['subheading'] = details.topic_name + ' / ' +
                details.story_title + ' / ' + details.chapter_title;
              requiredData['id'] = suggestion.suggestion_id;
              console.log(suggestion.status)
              requiredData['labelText'] = (
                SUGGETION_LABELS[suggestion.status].text);
              requiredData['labelColor'] = (
                SUGGETION_LABELS[suggestion.status].color);
              requiredData['actionButtonTitle'] = (
                ctrl.reviewTabActive ? 'Review' : 'View';
              translationContributionsSummaryList.push(requiredData);
            });
            return translationContributionsSummaryList;
          };
          var removeContributionToReview = function(suggestion_id) {
            ctrl.contributionSummaries = (
              ctrl.contributionSummaries.filter(function(suggestion) {
                console.log(suggestion_id, suggestion)
                if (suggestion.id === suggestion_id) {
                  return false;
                }
                return true;
              }));
          }
          var _showTranslationSuggestionModal = function(
              target_id, suggestion_id, contentHtml, translationHtml,
              reviewable) {
            var _templateUrl = UrlInterpolationService.getDirectiveTemplateUrl(
              '/pages/community-dashboard-page/modal-templates/' +
              'translation-suggestion-review.directive.html')

            $uibModal.open({
              templateUrl: _templateUrl,
              backdrop: true,
              resolve: {
                translationHtml: function() {
                  return translationHtml;
                },
                contentHtml: function() {
                  return contentHtml;
                },
                reviewable: function() {
                  return reviewable;
                }
              },
              controller: [
                '$scope', '$uibModalInstance', 'SuggestionModalService',
                'reviewable', 'translationHtml', 'contentHtml',
                function($scope, $uibModalInstance, SuggestionModalService,
                    canReview, translationHtml, contentHtml) {
                  $scope.translationHtml = translationHtml;
                  $scope.contentHtml = contentHtml;
                  $scope.reviewable = reviewable;

                  $scope.accept = function() {
                    SuggestionModalService.acceptSuggestion(
                      $uibModalInstance,
                      {
                        action: SuggestionModalService.ACTION_ACCEPT_SUGGESTION,
                        commitMessage: $scope.commitMessage,
                        reviewMessage: $scope.reviewMessage,
                        // TODO(sll): If audio files exist for the content being
                        // replaced, implement functionality in the modal for the
                        // exploration creator to indicate whether this change
                        // requires the corresponding audio subtitles to be updated.
                        // For now, we default to assuming that the changes are
                        // sufficiently small as to warrant no updates.
                        audioUpdateRequired: false
                      });
                  };

                  $scope.reject = function() {
                    SuggestionModalService.rejectSuggestion(
                      $uibModalInstance,
                      {
                        action: SuggestionModalService.ACTION_REJECT_SUGGESTION,
                        reviewMessage: 'Rejected'
                      });
                  };
                  $scope.cancel = function() {
                    SuggestionModalService.cancelSuggestion($uibModalInstance);
                  };
                }
              ]
            }).result.then(function(result) {
              ContributionAndReviewService.resolveSuggestion(
                target_id, suggestion_id, result.action)
              removeContributionToReview(suggestion_id)
            });
          };

          ctrl.onClickViewSuggestion = function(suggestionId) {
            var suggestion = ctrl.contributions[suggestionId].suggestion;
            _showTranslationSuggestionModal(
              suggestion.target_id, suggestion.suggestion_id,
              suggestion.change.content_html,
              suggestion.change.translation_html, ctrl.reviewTabActive)
          };

          ctrl.switchToContributionsTab = function() {
            if(ctrl.reviewTabActive) {
              ctrl.reviewTabActive = false;
              ctrl.contributionsDataLoading = true;
              ctrl.contributionSummaries = [];
              ContributionAndReviewService.getUserTranslationContributions(
                username, function(suggestionIdToSuggestions) {
                  ctrl.contributions = suggestionIdToSuggestions;
                  ctrl.contributionSummaries = (
                    getTranslationContributionsSummary());
                  ctrl.contributionsDataLoading = false;
                })
            }
          };

          ctrl.switchToReviewTab = function() {
            if(!ctrl.reviewTabActive) {
              ctrl.reviewTabActive = true;
              ctrl.contributionsDataLoading = true;
              ctrl.contributionSummaries = [];
              setTimeout(function() {
              ContributionAndReviewService.getReviewableTranslationSuggestions(
                function(suggestionIdToSuggestions) {
                  ctrl.contributions = suggestionIdToSuggestions;
                  ctrl.contributionSummaries = (
                    getTranslationContributionsSummary());
                  ctrl.contributionsDataLoading = false;
                })

              }, 10);
            }
          }

          UserService.getUserInfoAsync().then(function(userInfo) {
            ctrl.isAdmin = userInfo.isAdmin();
            ctrl.userIsLoggedIn = userInfo.isLoggedIn();
            ctrl.userDeatilsLoading = false;
            username = userInfo.getUsername();
            if(ctrl.isAdmin) {
              ctrl.reviewTabActive = false;
              ctrl.switchToReviewTab();
            } else if(ctrl.userIsLoggedIn) {
              ctrl.reviewTabActive = true;
              ctrl.switchToContributionsTab();
            }
          });
        }
      ]
    };
  }]);
