// Copyright 2018 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Directive for the audio translation bar.
 */
// Constant for audio recording time limit.
oppia.constant('RECORDING_TIME_LIMIT', 300);

oppia.directive('audioTranslationBar', [
  'UrlInterpolationService', function(UrlInterpolationService) {
    return {
      restrict: 'E',
      scope: {
        contentId: '='
      },
      link: function(scope, elm) {
        scope.getRecorderController();
      },
      templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
        '/pages/exploration_editor/translation_tab/' +
        'audio_translation_bar_directive.html'),
      controller: [
        '$scope', '$filter', '$timeout', '$uibModal', 'AlertsService',
        'StateContentIdsToAudioTranslationsService', 'IdGenerationService',
        'AudioPlayerService', 'TranslationLanguageService',
        'EditorStateService', 'ExplorationStatesService', 'EditabilityService',
        'AssetsBackendApiService', 'recorderService', 'ContextService',
        'RECORDING_TIME_LIMIT',
        function(
            $scope, $filter, $timeout, $uibModal, AlertsService,
            StateContentIdsToAudioTranslationsService, IdGenerationService,
            AudioPlayerService, TranslationLanguageService,
            EditorStateService, ExplorationStatesService, EditabilityService,
            AssetsBackendApiService, recorderService, ContextService,
            RECORDING_TIME_LIMIT) {
          $scope.RECORDER_ID = 'recorderId';
          $scope.recordingTimeLimit = RECORDING_TIME_LIMIT;
          $scope.audioBlob = null;
          $scope.recorder = null;
          $scope.unsupportedBrowser = false;
          $scope.selectedRecording = false;
          $scope.isAudioAvailable = false;
          $scope.audioIsUpdating = false;
          $scope.languageCode = null;
          $scope.cannotRecord = false;
          $scope.audioNeedsUpdate = false;
          $scope.AudioPlayerService = AudioPlayerService;
          $scope.canTranslate = false;

          var saveContentIdsToAudioTranslationChanges = function() {
            StateContentIdsToAudioTranslationsService.saveDisplayedValue();
            var stateName = EditorStateService.getActiveStateName();
            var value = StateContentIdsToAudioTranslationsService.displayed;
            ExplorationStatesService.saveContentIdsToAudioTranslations(
              stateName, value);
          };

          var getAvailableAudio = function(contentId, languageCode) {
            if ($scope.contentId) {
              return StateContentIdsToAudioTranslationsService
                .displayed.getAudioTranslation(contentId, languageCode);
            }
          };

          var generateNewFilename = function() {
            return $scope.contentId + '-' +
              $scope.languageCode + '-' +
              IdGenerationService.generateNewId() + '.mp3';
          };

          $scope.checkAndStartRecording = function() {
            recorderService.showPermission({
              onDenied: function() {
                $scope.recordingPermissionDenied = true;
              },
              onAllowed: function() {
                $scope.recordingPermissionDenied = false;
                $scope.cannotRecord = false;
              },
              onClosed: function() {
                $scope.recordingPermissionDenied = true;
              },
            });
            if (!$scope.recorder.isAvailable) {
              $scope.unsupportedBrowser = true;
              $scope.cannotRecord = true;
            } else if ($scope.recordingPermissionDenied){
              $scope.cannotRecord = true;
            } else if ($scope.recorder.isAvailable) {
              $scope.unsupportedBrowser = false;
              $scope.cannotRecord = false;
              $scope.recordingPermissionDenied = false;
              $scope.selectedRecording = true;
              $scope.recorder.startRecord();
            }
          };

          $scope.toggleAudioNeedsUpdate = function() {
            StateContentIdsToAudioTranslationsService.displayed
              .toggleNeedsUpdateAttribute(
                $scope.contentId, $scope.languageCode);
            saveContentIdsToAudioTranslationChanges();
            $scope.audioNeedsUpdate = !$scope.audioNeedsUpdate;
          };

          $scope.getRecorderController = function() {
            $scope.recorder = recorderService.controller($scope.RECORDER_ID);
          };

          $scope.reRecord = function() {
            $scope.initAudioBar();
            $scope.selectedRecording = true;
            $scope.recorder.startRecord();
          };

          $scope.cancelRecording = function() {
            $scope.initAudioBar();
            $scope.selectedRecording = false;
            $scope.audioIsUpdating = false;
            $scope.audioBlob = null;
          };

          $scope.updateAudio = function() {
            $scope.audioBlob = null;
            $scope.audioIsUpdating = true;
            $scope.recorder.startRecord();
          };

          $scope.saveRecordedAudio = function() {
            var filename = generateNewFilename();
            var fileType = 'audio/mp3';
            var recordedAudioFile = new File(
              [$scope.audioBlob], filename, {type: fileType});
            AssetsBackendApiService.saveAudio(
              ContextService.getExplorationId(), filename,
              recordedAudioFile).then(function() {
              if ($scope.audioIsUpdating) {
                StateContentIdsToAudioTranslationsService.displayed
                  .deleteAudioTranslation(
                    $scope.contentId, $scope.languageCode);
                $scope.audioIsUpdating = false;
              }
              StateContentIdsToAudioTranslationsService.displayed
                .addAudioTranslation($scope.contentId, $scope.languageCode,
                  filename, recordedAudioFile.size);
              saveContentIdsToAudioTranslationChanges();
              AlertsService.addSuccessMessage(
                'Succesfuly uploaded recorded audio.');
              $scope.initAudioBar();
            }, function(errorResponse) {
              AlertsService.addWarning(errorResponse.error);
              $scope.initAudioBar();
            });
          };

          $scope.$watch('contentId', function() {
            $scope.initAudioBar();
          });

          $scope.$on('refreshAudioTranslationBar', function() {
            $scope.initAudioBar();
          });

          $scope.initAudioBar = function() {
            $scope.languageCode = TranslationLanguageService
              .getActiveLanguageCode();
            $scope.canTranslate = EditabilityService.isTranslatable();
            var audioTranslationObject = getAvailableAudio(
              $scope.contentId, $scope.languageCode);
            if (audioTranslationObject) {
              $scope.isAudioAvailable = true;
              $scope.isLoadingAudio = true;
              $scope.selectedRecording = false;
              $scope.audioNeedsUpdate = audioTranslationObject.needsUpdate;
              AudioPlayerService.load(audioTranslationObject.filename)
                .then(function(audioObject) {
                  $scope.isLoadingAudio = false;
                });
            } else {
              $scope.isAudioAvailable = false;
              $scope.audioBlob = null;
              $scope.selectedRecording = false;
            }
          };

          $scope.track = {
            progress: function(progressPercentage) {
              if (angular.isDefined(progressPercentage)) {
                AudioPlayerService.setProgress(progressPercentage / 100);
              }
              return AudioPlayerService.getProgress() * 100;
            }
          };

          $scope.openDeleteAudioTranslationModal = function(languageCode) {
            $uibModal.open({
              templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
                '/pages/exploration_editor/translation_tab/' +
                'delete_audio_translation_modal_directive.html'),
              backdrop: true,
              controller: [
                '$scope', '$uibModalInstance',
                function( $scope, $uibModalInstance) {
                  $scope.reallyDelete = function() {
                    $uibModalInstance.close();
                  };

                  $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                  };
                }
              ]
            }).result.then(function(result) {
              StateContentIdsToAudioTranslationsService.displayed
                .deleteAudioTranslation($scope.contentId, $scope.languageCode);
              saveContentIdsToAudioTranslationChanges();
              $scope.initAudioBar();
            });
          };

          $scope.openAddAudioTranslationModal = function() {
            $uibModal.open({
              templateUrl: UrlInterpolationService.getDirectiveTemplateUrl(
                '/pages/exploration_editor/translation_tab/' +
                'add_audio_translation_modal_directive.html'),
              backdrop: 'static',
              resolve: {
                generatedFilename: function() {
                  return generateNewFilename();
                },
                languageCode: function() {
                  return $scope.languageCode;
                }
              },
              controller: [
                '$scope', '$uibModalInstance', 'AlertsService', 'languageCode',
                'ContextService', 'generatedFilename',
                function(
                    $scope, $uibModalInstance, AlertsService, languageCode,
                    ContextService, generatedFilename) {
                  var ERROR_MESSAGE_BAD_FILE_UPLOAD = (
                    'There was an error uploading the audio file.');
                  var BUTTON_TEXT_SAVE = 'Save';
                  var BUTTON_TEXT_SAVING = 'Saving...';

                  // Whether there was an error uploading the audio file.
                  $scope.errorMessage = null;
                  $scope.saveButtonText = BUTTON_TEXT_SAVE;
                  $scope.saveInProgress = false;
                  var uploadedFile = null;

                  $scope.isAudioTranslationValid = function() {
                    return (
                      uploadedFile !== null &&
                      uploadedFile.size !== null &&
                      uploadedFile.size > 0);
                  };

                  $scope.updateUploadedFile = function(file) {
                    $scope.errorMessage = null;
                    uploadedFile = file;
                  };

                  $scope.clearUploadedFile = function() {
                    $scope.errorMessage = null;
                    uploadedFile = null;
                  };

                  $scope.save = function() {
                    if ($scope.isAudioTranslationValid()) {
                      $scope.saveButtonText = BUTTON_TEXT_SAVING;
                      $scope.saveInProgress = true;
                      var explorationId = (
                        ContextService.getExplorationId());
                      AssetsBackendApiService.saveAudio(
                        explorationId, generatedFilename, uploadedFile
                      ).then(function() {
                        $uibModalInstance.close({
                          languageCode: languageCode,
                          filename: generatedFilename,
                          fileSizeBytes: uploadedFile.size
                        });
                      }, function(errorResponse) {
                        $scope.errorMessage = (
                          errorResponse.error || ERROR_MESSAGE_BAD_FILE_UPLOAD);
                        uploadedFile = null;
                        $scope.saveButtonText = BUTTON_TEXT_SAVE;
                        $scope.saveInProgress = false;
                      });
                    }
                  };

                  $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                    AlertsService.clearWarnings();
                  };
                }
              ]
            }).result.then(function(result) {
              StateContentIdsToAudioTranslationsService.displayed
                .addAudioTranslation(
                  $scope.contentId, $scope.languageCode, result.filename,
                  result.fileSizeBytes);
              saveContentIdsToAudioTranslationChanges();
              $scope.initAudioBar();
            });
          };

          $timeout(function(){
            $scope.initAudioBar();
          }, 100);
        }]
    };
  }]);
