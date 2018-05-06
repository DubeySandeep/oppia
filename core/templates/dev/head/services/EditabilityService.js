// Copyright 2014 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Service for checking the ability to edit an exploration.
 */

// TODO(sll): Should this depend on a versioning service that keeps track of
// the current active version? Previous versions should not be editable.
oppia.factory('EditabilityService', [function() {
  var isEditable = false;
  var isTranslatable = false;
  var inTutorialMode = false;

  return {
    isEditable: function() {
      return isEditable && !inTutorialMode;
    },
    isEditableOutsideTutorialMode: function() {
      return isEditable || isTranslatable;
    },
    isTranslatable: function() {
      return isTranslatable && !inTutorialMode;
    },
    markEditable: function() {
      isEditable = true;
    },
    markNotEditable: function() {
      isEditable = false;
    },
    markTranslatable: function() {
      isTranslatable = true;
    },
    onEndTutorial: function() {
      inTutorialMode = false;
    },
    onStartTutorial: function() {
      inTutorialMode = true;
    }
  };
}]);
