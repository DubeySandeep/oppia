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
 * @fileoverview Directive for the item view of an opportunity.
 */
require(
  'components/common-layout-directives/common-elements/' +
  'lazy-loading.directive.ts');

var oppia = require('AppInit.ts').module;

oppia.directive('opportunitiesListItem', ['UrlInterpolationService', function(
    UrlInterpolationService) {
  return {
    restrict: 'E',
    scope: {
      lazyLoading: '=',
      opportunity: '=',
    },
    bindToController: {},
    templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
      '/pages/community-dashboard-page/opportunities-list-item/' +
      'opportunities-list-item.directive.html'),
    controllerAs: '$ctrl',
    controller: [
      '$scope', function($scope) {
        var ctrl = this;
        if ($scope.opportunity && $scope.opportunity.progressPercentage) {
          ctrl.progressPercentage = $scope.opportunity.progressPercentage + '%';
          ctrl.progresBarStyle = {width: ctrl.progressPercentage};
        }
      }
    ]
  };
}]);