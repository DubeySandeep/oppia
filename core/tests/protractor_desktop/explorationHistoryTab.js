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
 * @fileoverview End-to-end tests for the functionality the history tab of the
 * exploration editor.
 */

var forms = require('../protractor_utils/forms.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var workflow = require('../protractor_utils/workflow.js');


var ExplorationEditorPage =
  require('../protractor_utils/ExplorationEditorPage.js');
var ExplorationPlayerPage =
  require('../protractor_utils/ExplorationPlayerPage.js');

describe('Exploration history', function() {
  var explorationEditorPage = null;
  var explorationPlayerPage = null;
  var explorationEditorHistoryTab = null;
  var explorationEditorMainTab = null;

  // Constants for colors of nodes in history graph.
  var COLOR_ADDED = 'rgb(78, 162, 78)';
  var COLOR_DELETED = 'rgb(220, 20, 60)';
  var COLOR_CHANGED = 'rgb(30, 144, 255)';
  var COLOR_UNCHANGED = 'rgb(245, 245, 220)';
  var COLOR_RENAMED_UNCHANGED = 'rgb(255, 215, 0)';

  beforeEach(function() {
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationEditorHistoryTab = explorationEditorPage.getHistoryTab();
    explorationEditorMainTab = explorationEditorPage.getMainTab();
    explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();
  });

  it('should display the history', function() {
    users.createUser('user@historyTab.com', 'userHistoryTab');
    users.login('user@historyTab.com');
    workflow.createExploration();

    // Check renaming state, editing text, editing interactions and adding
    // state.
    explorationEditorMainTab.setStateName('first');
    explorationEditorMainTab.setContent(forms.toRichText(
      'enter 6 to continue'));
    explorationEditorMainTab.setInteraction('NumericInput');
    explorationEditorMainTab.addResponse(
      'NumericInput', null, 'second', true, 'Equals', 6);
    explorationEditorMainTab.moveToState('second');
    explorationEditorMainTab.setContent(forms.toRichText('this is card 2'));
    explorationEditorMainTab.setInteraction('Continue');
    var responseEditor = explorationEditorMainTab.getResponseEditor('default');
    responseEditor.setDestination('final card', true, null);
    // Setup a terminating state.
    explorationEditorMainTab.moveToState('final card');
    explorationEditorMainTab.setInteraction('EndExploration');
    explorationEditorMainTab.moveToState('first');
    explorationEditorPage.saveChanges();

    var VERSION_1_STATE_1_CONTENTS = {
      1: {
        text: 'classifier_model_id: null',
        highlighted: false
      },
      2: {
        text: 'content:',
        highlighted: false
      },
      3: {
        text: '  content_id: content',
        highlighted: false
      },
      4: {
        text: '  html: <p>enter 6 to continue</p>',
        highlighted: true
      },
      5: {
        text: 'interaction:',
        highlighted: false
      },
      6: {
        text: '  answer_groups:',
        highlighted: true
      },
      7: {
        text: '  - outcome:',
        highlighted: true
      },
      8: {
        text: '      dest: second',
        highlighted: true
      },
      9: {
        text: '      feedback:',
        highlighted: true
      },
      10: {
        text: '        content_id: feedback_1',
        highlighted: true
      },
      11: {
        text: '        html: \'\'',
        highlighted: true
      },
      12: {
        text: '      labelled_as_correct: false',
        highlighted: true
      },
      13: {
        text: '      missing_prerequisite_skill_id: null',
        highlighted: true
      },
      14: {
        text: '      param_changes: []',
        highlighted: true
      },
      15: {
        text: '      refresher_exploration_id: null',
        highlighted: true
      },
      16: {
        text: '    rule_specs:',
        highlighted: true
      },
      17: {
        text: '    - inputs:',
        highlighted: true
      },
      18: {
        text: '        x: 6',
        highlighted: true
      },
      19: {
        text: '      rule_type: Equals',
        highlighted: true
      },
      20: {
        text: '    tagged_skill_misconception_id: null',
        highlighted: true
      },
      21: {
        text: '    training_data: []',
        highlighted: true
      },
      22: {
        text: '  confirmed_unclassified_answers: []',
        highlighted: false
      },
      23: {
        text: '  customization_args: {}',
        highlighted: false
      },
      24: {
        text: '  default_outcome:',
        highlighted: false
      },
      25: {
        text: '    dest: first',
        highlighted: true
      },
      26: {
        text: '    feedback:',
        highlighted: false
      },
      27: {
        text: '      content_id: default_outcome',
        highlighted: false
      },
      28: {
        text: '      html: \'\'',
        highlighted: false
      },
      29: {
        text: '    labelled_as_correct: false',
        highlighted: false
      },
      30: {
        text: '    missing_prerequisite_skill_id: null',
        highlighted: false
      },
      31: {
        text: '    param_changes: []',
        highlighted: false
      },
      32: {
        text: '    refresher_exploration_id: null',
        highlighted: false
      },
      33: {
        text: '  hints: []',
        highlighted: false
      },
      34: {
        text: '  id: NumericInput',
        highlighted: true
      },
      35: {
        text: '  solution: null',
        highlighted: false
      },
      36: {
        text: 'param_changes: []',
        highlighted: false
      },
      37: {
        text: 'recorded_voiceovers:',
        highlighted: false
      },
      38: {
        text: '  voiceovers_mapping:',
        highlighted: false
      },
      39: {
        text: '    content: {}',
        highlighted: false
      },
      40: {
        text: '    default_outcome: {}',
        highlighted: false
      },
      41: {
        text: '    feedback_1: {}',
        highlighted: true
      },
      42: {
        text: 'solicit_answer_details: false',
        highlighted: false
      },
      43: {
        text: 'written_translations:',
        highlighted: false
      },
      44: {
        text: '  translations_mapping:',
        highlighted: false
      },
      45: {
        text: '    content: {}',
        highlighted: false
      },
      46: {
        text: '    default_outcome: {}',
        highlighted: true
      },
      47: {
        text: '    feedback_1: {}',
        highlighted: true
      },
      48: {
        text: '',
        highlighted: false
      }
    };

    var VERSION_2_STATE_1_CONTENTS = {
      1: {
        text: 'classifier_model_id: null',
        highlighted: false
      },
      2: {
        text: 'content:',
        highlighted: false
      },
      3: {
        text: '  content_id: content',
        highlighted: false
      },
      4: {
        text: '  html: \'\'',
        highlighted: true
      },
      5: {
        text: 'interaction:',
        highlighted: false
      },
      6: {
        text: '  answer_groups: []',
        highlighted: true
      },
      7: {
        text: '  confirmed_unclassified_answers: []',
        highlighted: false
      },
      8: {
        text: '  customization_args: {}',
        highlighted: false
      },
      9: {
        text: '  default_outcome:',
        highlighted: false
      },
      // Note that highlighting *underneath* a line is still considered a
      // highlight.
      10: {
        text: '    dest: ' + general.FIRST_STATE_DEFAULT_NAME,
        highlighted: true
      },
      11: {
        text: '    feedback:',
        highlighted: false
      },
      12: {
        text: '      content_id: default_outcome',
        highlighted: false
      },
      13: {
        text: '      html: \'\'',
        highlighted: false
      },
      14: {
        text: '    labelled_as_correct: false',
        highlighted: false
      },
      15: {
        text: '    missing_prerequisite_skill_id: null',
        highlighted: false
      },
      16: {
        text: '    param_changes: []',
        highlighted: false
      },
      17: {
        text: '    refresher_exploration_id: null',
        highlighted: false
      },
      18: {
        text: '  hints: []',
        highlighted: false
      },
      19: {
        text: '  id: null',
        highlighted: true
      },
      20: {
        text: '  solution: null',
        highlighted: false
      },
      21: {
        text: 'param_changes: []',
        highlighted: false
      },
      22: {
        text: 'recorded_voiceovers:',
        highlighted: false
      },
      23: {
        text: '  voiceovers_mapping:',
        highlighted: false
      },
      24: {
        text: '    content: {}',
        highlighted: false
      },
      25: {
        text: '    default_outcome: {}',
        highlighted: true
      },
      26: {
        text: 'solicit_answer_details: false',
        highlighted: false
      },
      27: {
        text: 'written_translations:',
        highlighted: false
      },
      28: {
        text: '  translations_mapping:',
        highlighted: false
      },
      29: {
        text: '    content: {}',
        highlighted: false
      },
      30: {
        text: '    default_outcome: {}',
        highlighted: true
      },
      31: {
        text: '',
        highlighted: false
      }
    };

    var STATE_2_STRING =
      'classifier_model_id: null\n' +
      'content:\n' +
      '  content_id: content\n' +
      '  html: <p>this is card 2</p>\n' +
      'interaction:\n' +
      '  answer_groups: []\n' +
      '  confirmed_unclassified_answers: []\n' +
      '  customization_args:\n' +
      '    buttonText:\n' +
      '      value: Continue\n' +
      '  default_outcome:\n' +
      '    dest: final card\n' +
      '    feedback:\n' +
      '      content_id: default_outcome\n' +
      '      html: \'\'\n' +
      '    labelled_as_correct: false\n' +
      '    missing_prerequisite_skill_id: null\n' +
      '    param_changes: []\n' +
      '    refresher_exploration_id: null\n' +
      '  hints: []\n' +
      '  id: Continue\n' +
      '  solution: null\n' +
      'param_changes: []\n' +
      'recorded_voiceovers:\n' +
      '  voiceovers_mapping:\n' +
      '    content: {}\n' +
      '    default_outcome: {}\n' +
      'solicit_answer_details: false\n' +
      'written_translations:\n' +
      '  translations_mapping:\n' +
      '    content: {}\n' +
      '    default_outcome: {}\n' +
      '';

    var expectedHistoryStates = [{
      label: 'first (was: Introd...',
      color: COLOR_CHANGED
    }, {
      label: 'second',
      color: COLOR_ADDED
    }, {
      label: 'final card',
      color: COLOR_ADDED
    }];
    explorationEditorPage.navigateToHistoryTab();
    var historyGraph = explorationEditorHistoryTab.getHistoryGraph();
    historyGraph.selectTwoVersions(1, 2);
    historyGraph.expectHistoryStatesToMatch(expectedHistoryStates);
    historyGraph.expectNumberOfLinksToMatch(2, 2, 0);
    historyGraph.openStateHistory('first (was: Introd...');
    historyGraph.expectTextWithHighlightingToMatch(
      VERSION_1_STATE_1_CONTENTS, VERSION_2_STATE_1_CONTENTS);
    historyGraph.closeStateHistory();

    historyGraph.openStateHistory('second');
    historyGraph.expectTextToMatch(STATE_2_STRING, '');
    historyGraph.closeStateHistory();

    // Reset all checkboxes.
    // Switching the 2 compared versions should give the same result.
    historyGraph.deselectTwoVersions(1, 2);
    historyGraph.selectTwoVersions(2, 1);
    historyGraph.expectHistoryStatesToMatch(expectedHistoryStates);
    historyGraph.expectNumberOfLinksToMatch(2, 2, 0);

    // Check deleting a state.
    explorationEditorPage.navigateToMainTab();
    explorationEditorMainTab.deleteState('second');
    explorationEditorMainTab.moveToState('first');
    explorationEditorMainTab.getResponseEditor(0).
      setDestination('final card', false, null);
    explorationEditorPage.saveChanges();

    expectedHistoryStates = [{
      label: 'first',
      color: COLOR_CHANGED
    }, {
      label: 'second',
      color: COLOR_DELETED
    }, {
      label: 'final card',
      color: COLOR_UNCHANGED
    }];
    explorationEditorPage.navigateToHistoryTab();
    historyGraph = explorationEditorHistoryTab.getHistoryGraph();
    historyGraph.selectTwoVersions(2, 3);
    historyGraph.expectHistoryStatesToMatch(expectedHistoryStates);
    historyGraph.expectNumberOfLinksToMatch(3, 1, 2);

    historyGraph.openStateHistory('second');
    historyGraph.expectTextToMatch('', STATE_2_STRING);
    historyGraph.closeStateHistory();

    // Check renaming a state.
    explorationEditorPage.navigateToMainTab();
    explorationEditorMainTab.moveToState('first');
    explorationEditorMainTab.setStateName('third');
    explorationEditorPage.saveChanges();
    expectedHistoryStates = [{
      label: 'third (was: first)',
      color: COLOR_RENAMED_UNCHANGED
    }, {
      label: 'final card',
      color: COLOR_UNCHANGED
    }];
    explorationEditorPage.navigateToHistoryTab();
    historyGraph = explorationEditorHistoryTab.getHistoryGraph();
    historyGraph.selectTwoVersions(3, 4);
    historyGraph.expectHistoryStatesToMatch(expectedHistoryStates);
    historyGraph.expectNumberOfLinksToMatch(1, 0, 0);

    // Check re-inserting a deleted state.
    explorationEditorPage.navigateToMainTab();
    explorationEditorMainTab.moveToState('third');
    explorationEditorMainTab.getResponseEditor(0).
      setDestination('second', true, null);
    explorationEditorMainTab.moveToState('second');
    explorationEditorMainTab.setContent(forms.toRichText('this is card 2'));
    explorationEditorMainTab.setInteraction('Continue');

    var responseEditor = explorationEditorMainTab.getResponseEditor('default');
    responseEditor.setDestination('final card', false, null);
    explorationEditorPage.saveChanges();

    expectedHistoryStates = [{
      label: 'third (was: first)',
      color: COLOR_CHANGED
    }, {
      label: 'second',
      color: COLOR_UNCHANGED
    }, {
      label: 'final card',
      color: COLOR_UNCHANGED
    }];
    explorationEditorPage.navigateToHistoryTab();
    historyGraph = explorationEditorHistoryTab.getHistoryGraph();
    historyGraph.selectTwoVersions(2, 5);
    historyGraph.expectHistoryStatesToMatch(expectedHistoryStates);
    historyGraph.expectNumberOfLinksToMatch(2, 0, 0);

    users.logout();
  });

  it('should revert to old exploration commit', function() {
    users.createUser('user2@historyTab.com', 'user2HistoryTab');
    users.login('user2@historyTab.com');
    workflow.createExploration();

    // Make changes for second commit.
    // First card.
    explorationEditorMainTab.setStateName('first');
    explorationEditorMainTab.setContent(forms.toRichText(
      'enter 6 to continue'));
    explorationEditorMainTab.setInteraction('NumericInput');
    explorationEditorMainTab.addResponse(
      'NumericInput', null, 'second', true, 'Equals', 6);
    // Second card.
    explorationEditorMainTab.moveToState('second');
    explorationEditorMainTab.setContent(
      forms.toRichText('card 2 second commit text'));
    explorationEditorMainTab.setInteraction('Continue');
    var responseEditor = explorationEditorMainTab.getResponseEditor('default');
    responseEditor.setDestination('final card', true, null);
    // Final card.
    explorationEditorMainTab.moveToState('final card');
    explorationEditorMainTab.setInteraction('EndExploration');
    explorationEditorMainTab.moveToState('first');
    explorationEditorPage.saveChanges();

    // Create third commit.
    explorationEditorPage.navigateToMainTab();
    explorationEditorMainTab.moveToState('first');
    explorationEditorMainTab.setStateName('third');
    explorationEditorMainTab.moveToState('second');
    explorationEditorMainTab.setContent(
      forms.toRichText('card 2 third commit text'));
    explorationEditorPage.saveChanges();
    expectedHistoryStates = [{
      label: 'third (was: first)',
      color: COLOR_RENAMED_UNCHANGED
    }, {
      label: 'second',
      color: COLOR_CHANGED
    }, {
      label: 'final card',
      color: COLOR_UNCHANGED
    }];
    explorationEditorPage.navigateToHistoryTab();
    historyGraph = explorationEditorHistoryTab.getHistoryGraph();
    historyGraph.selectTwoVersions(2, 3);
    historyGraph.expectHistoryStatesToMatch(expectedHistoryStates);
    historyGraph.expectNumberOfLinksToMatch(2, 0, 0);

    // Revert to version 2.
    explorationEditorPage.navigateToHistoryTab();
    explorationEditorHistoryTab.revertToVersion(2);

    // Verify exploration is version 2.
    general.moveToPlayer();
    explorationPlayerPage.expectContentToMatch(
      forms.toRichText('enter 6 to continue'));
    explorationPlayerPage.submitAnswer('NumericInput', 6);
    explorationPlayerPage.expectExplorationToNotBeOver();
    explorationPlayerPage.expectContentToMatch(
      forms.toRichText('card 2 second commit text'));
    explorationPlayerPage.expectInteractionToMatch('Continue', 'CONTINUE');
    explorationPlayerPage.submitAnswer('Continue', null);
    explorationPlayerPage.expectExplorationToBeOver();

    // Verify history states between original and reversion.
    general.moveToEditor();
    var expectedHistoryStates = [{
      label: 'first',
      color: COLOR_UNCHANGED
    }, {
      label: 'second',
      color: COLOR_UNCHANGED
    }, {
      label: 'final card',
      color: COLOR_UNCHANGED
    }];
    explorationEditorPage.navigateToHistoryTab();
    historyGraph = explorationEditorHistoryTab.getHistoryGraph();
    historyGraph.selectTwoVersions(2, 4);
    historyGraph.expectHistoryStatesToMatch(expectedHistoryStates);
    historyGraph.expectNumberOfLinksToMatch(2, 0, 0);

    users.logout();
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
  });
});


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
 * @fileoverview End-to-end tests for the functionality of the translation tab
 * in the exploration editor.
 */

var forms = require('../protractor_utils/forms.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var workflow = require('../protractor_utils/workflow.js');

var AdminPage = require('../protractor_utils/AdminPage.js');
var CreatorDashboardPage = require(
  '../protractor_utils/CreatorDashboardPage.js');
var ExplorationEditorPage = require(
  '../protractor_utils/ExplorationEditorPage.js');

describe('Exploration translation and voiceover tab', function() {
  var adminPage = null;
  var creatorDashboardPage = null;
  var explorationEditorMainTab = null;
  var explorationEditorPage = null;
  var explorationEditorSettingsTab = null;
  var explorationEditorTranslationTab = null;
  var YELLOW_STATE_PROGRESS_COLOR = 'rgb(233, 179, 48)';
  var GREEN_STATE_PROGRESS_COLOR = 'rgb(22, 167, 101)';
  var RED_STATE_PROGRESS_COLOR = 'rgb(209, 72, 54)';

  beforeAll(function() {
    adminPage = new AdminPage.AdminPage();
    creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationEditorMainTab = explorationEditorPage.getMainTab();
    explorationEditorSettingsTab = explorationEditorPage.getSettingsTab();
    explorationEditorTranslationTab = explorationEditorPage.getTranslationTab();
    explorationPreviewTab = explorationEditorPage.getPreviewTab();

    users.createUser('voiceArtist@translationTab.com', 'userVoiceArtist');
    users.createUser('user@editorTab.com', 'userEditor');
    users.createAndLoginAdminUser('superUser@translationTab.com', 'superUser');
    // TODO(#7569): Change this test to work with the improvements tab.
    adminPage.editConfigProperty(
      'Exposes the Improvements Tab for creators in the exploration editor',
      'Boolean', (elem) => elem.setValue(false));
    users.login('user@editorTab.com');
    workflow.createExploration();

    explorationEditorMainTab.setStateName('first');
    explorationEditorMainTab.setContent(forms.toRichText(
      'This is first card.'));
    explorationEditorMainTab.setInteraction('NumericInput');
    explorationEditorMainTab.addResponse(
      'NumericInput', forms.toRichText('This is feedback1.'),
      'second', true, 'Equals', 6);
    var responseEditor = explorationEditorMainTab.getResponseEditor('default');
    responseEditor.setFeedback(forms.toRichText('This is default_outcome.'));
    explorationEditorMainTab.addHint('This is hint1.');
    explorationEditorMainTab.addHint('This is hint2.');
    explorationEditorMainTab.addSolution('NumericInput', {
      correctAnswer: 6,
      explanation: 'This is solution.'
    });
    explorationEditorMainTab.moveToState('second');
    explorationEditorMainTab.setContent(
      forms.toRichText('This is second card.'));
    explorationEditorMainTab.setInteraction('Continue');
    var responseEditor = explorationEditorMainTab.getResponseEditor('default');
    responseEditor.setDestination('final card', true, null);
    // Setup a terminating state.
    explorationEditorMainTab.moveToState('final card');
    explorationEditorMainTab.setContent(
      forms.toRichText('This is final card.'));
    explorationEditorMainTab.setInteraction('EndExploration');
    explorationEditorPage.navigateToSettingsTab();
    explorationEditorSettingsTab.setTitle('Test Exploration');
    explorationEditorSettingsTab.setCategory('Algorithms');
    explorationEditorSettingsTab.setLanguage('English');
    explorationEditorSettingsTab.setObjective(
      'Run tests using same exploration.');
    explorationEditorPage.saveChanges('Done!');
    workflow.addExplorationVoiceArtist('userVoiceArtist');
  });

  it('should walkthrough translation tutorial when user clicks next',
    function() {
      users.login('user@editorTab.com');
      creatorDashboardPage.get();
      creatorDashboardPage.editExploration('Test Exploration');
      explorationEditorPage.navigateToTranslationTab();
      explorationEditorTranslationTab.startTutorial();
      explorationEditorTranslationTab.playTutorial();
      explorationEditorTranslationTab.finishTutorial();
      users.logout();

      users.login('voiceArtist@translationTab.com');
      creatorDashboardPage.get();
      creatorDashboardPage.editExploration('Test Exploration');
      explorationEditorMainTab.exitTutorial();
      explorationEditorPage.navigateToTranslationTab();
      explorationEditorTranslationTab.startTutorial();
      explorationEditorTranslationTab.playTutorial();
      explorationEditorTranslationTab.finishTutorial();
      users.logout();
    });

  it('should cache the selected language for translation and voiceover',
    function() {
      users.login('voiceArtist@translationTab.com');
      creatorDashboardPage.get();
      creatorDashboardPage.editExploration('Test Exploration');
      explorationEditorMainTab.exitTutorial();
      explorationEditorPage.navigateToTranslationTab();
      explorationEditorTranslationTab.expectSelectedLanguageToBe('English');
      explorationEditorTranslationTab.changeLanguage('Hindi');
      browser.refresh();
      explorationEditorTranslationTab.expectSelectedLanguageToBe('Hindi');
    });

  it('should have voiceover as a default mode', function() {
    users.login('voiceArtist@translationTab.com');
    creatorDashboardPage.get();
    creatorDashboardPage.editExploration('Test Exploration');
    explorationEditorPage.navigateToTranslationTab();
    explorationEditorTranslationTab.changeLanguage('Hindi');
    explorationEditorTranslationTab.exitTutorial();
    explorationEditorTranslationTab.expectToBeInVoiceoverMode();
    users.logout();
  });

  it('should have all the state contents for voiceover in exploration language',
    function() {
      users.login('voiceArtist@translationTab.com');
      creatorDashboardPage.get();
      creatorDashboardPage.editExploration('Test Exploration');
      explorationEditorPage.navigateToTranslationTab();
      explorationEditorTranslationTab.changeLanguage('English');
      explorationEditorTranslationTab.expectContentTabContentToMatch(
        'This is first card.');
      explorationEditorTranslationTab.expectFeedbackTabContentsToMatch(
        ['This is feedback1.', 'This is default_outcome.']);
      explorationEditorTranslationTab.expectSolutionTabContentToMatch(
        'This is solution.');
      explorationEditorTranslationTab.expectHintsTabContentsToMatch(
        ['This is hint1.', 'This is hint2.']);
      users.logout();
    });

  it('should contain accessibility elements', function() {
    users.login('voiceArtist@translationTab.com');
    creatorDashboardPage.get();
    creatorDashboardPage.editExploration('Test Exploration');
    explorationEditorPage.navigateToTranslationTab();

    explorationEditorTranslationTab.expectNumericalStatusAccessibilityToMatch(
      '0 items translated out of 8 items');
    explorationEditorTranslationTab.expectContentAccessibilityToMatch(
      'Content of the card');
    explorationEditorTranslationTab.expectFeedbackAccessibilityToMatch(
      'Feedback responses for answer groups');
    explorationEditorTranslationTab.expectHintAccessibilityToMatch(
      'Hints for the state');
    explorationEditorTranslationTab.expectSolutionAccessibilityToMatch(
      'Solutions for the state');
    explorationEditorTranslationTab.expectStartRecordingAccessibilityToMatch(
      'Start recording');
    explorationEditorTranslationTab.expectUploadRecordingAccessibilityToMatch(
      'Upload voiceovered file');
    explorationEditorTranslationTab.expectPlayRecordingAccessibilityToMatch(
      'Play recorded audio');
    users.logout();
  });

  it(
    'should maintain its active sub-tab on saving draft and publishing changes',
    function() {
      users.login('user@editorTab.com');
      creatorDashboardPage.get();
      creatorDashboardPage.editExploration('Test Exploration');
      explorationEditorPage.navigateToTranslationTab();
      explorationEditorTranslationTab.exitTutorial();
      explorationEditorTranslationTab.changeLanguage('Hindi');
      explorationEditorTranslationTab.switchToTranslationMode();
      explorationEditorTranslationTab.navigateToFeedbackTab();
      explorationEditorTranslationTab.setTranslation(forms.toRichText(
        'Sample Translation.'));
      explorationEditorPage.saveChanges('Adds one translation.');
      explorationEditorTranslationTab.expectFeedbackTabToBeActive();
      workflow.publishExploration();
      explorationEditorTranslationTab.expectFeedbackTabToBeActive();
      users.logout();
    });


  it('should change translation language correctly', function() {
    users.login('voiceArtist@translationTab.com');
    creatorDashboardPage.get();
    creatorDashboardPage.editExploration('Test Exploration');
    explorationEditorPage.navigateToTranslationTab();
    explorationEditorTranslationTab.changeLanguage('Hindi');
    explorationEditorTranslationTab.expectSelectedLanguageToBe('Hindi');
    users.logout();
  });

  it('should correctly switch to different modes', function() {
    users.login('voiceArtist@translationTab.com');
    creatorDashboardPage.get();
    creatorDashboardPage.editExploration('Test Exploration');
    explorationEditorPage.navigateToTranslationTab();
    explorationEditorTranslationTab.expectToBeInVoiceoverMode();
    explorationEditorTranslationTab.changeLanguage('Hindi');

    explorationEditorTranslationTab.switchToTranslationMode();
    explorationEditorTranslationTab.expectToBeInTranslationMode();

    explorationEditorTranslationTab.switchToVoiceoverMode();
    explorationEditorTranslationTab.expectToBeInVoiceoverMode();
    users.logout();
  });

  it('should allow adding translation and reflect the progress', function() {
    users.login('user@editorTab.com');
    creatorDashboardPage.get();
    creatorDashboardPage.editExploration('Test Exploration');
    explorationEditorPage.navigateToTranslationTab();
    explorationEditorTranslationTab.exitTutorial();
    explorationEditorTranslationTab.changeLanguage('Hindi');
    explorationEditorTranslationTab.switchToTranslationMode();

    explorationEditorTranslationTab.expectCorrectStatusColor(
      'first', YELLOW_STATE_PROGRESS_COLOR);
    explorationEditorTranslationTab.expectCorrectStatusColor(
      'second', RED_STATE_PROGRESS_COLOR);
    explorationEditorTranslationTab.expectCorrectStatusColor(
      'final card', RED_STATE_PROGRESS_COLOR);
    explorationEditorTranslationTab.expectNumericalStatusAccessibilityToMatch(
      '1 item translated out of 8 items');

    explorationEditorTranslationTab.moveToState('first');
    explorationEditorTranslationTab.expectContentTabContentToMatch(
      'This is first card.');
    explorationEditorTranslationTab.setTranslation(forms.toRichText(
      'Yeh pehla panna hain.'));
    explorationEditorTranslationTab.navigateToFeedbackTab();
    explorationEditorTranslationTab.setTranslation(forms.toRichText(
      'Yeh hindi main vishleshad hain.'));
    explorationEditorTranslationTab.moveToState('final card');
    explorationEditorTranslationTab.expectContentTabContentToMatch(
      'This is final card.');
    explorationEditorTranslationTab.setTranslation(forms.toRichText(
      'Yeh aakhri panna hain.'));

    explorationEditorTranslationTab.moveToState('first');
    explorationEditorTranslationTab.expectTranslationToMatch(forms.toRichText(
      'Yeh pehla panna hain.'));
    explorationEditorTranslationTab.navigateToFeedbackTab();
    explorationEditorTranslationTab.expectTranslationToMatch(forms.toRichText(
      'Yeh hindi main vishleshad hain.'));
    explorationEditorTranslationTab.moveToState('final card');
    explorationEditorTranslationTab.expectTranslationToMatch(forms.toRichText(
      'Yeh aakhri panna hain.'));

    explorationEditorTranslationTab.switchToVoiceoverMode();
    explorationEditorTranslationTab.switchToTranslationMode();
    explorationEditorTranslationTab.moveToState('first');
    explorationEditorTranslationTab.expectTranslationToMatch(forms.toRichText(
      'Yeh pehla panna hain.'));
    explorationEditorTranslationTab.navigateToFeedbackTab();
    explorationEditorTranslationTab.expectTranslationToMatch(forms.toRichText(
      'Yeh hindi main vishleshad hain.'));
    explorationEditorTranslationTab.moveToState('final card');
    explorationEditorTranslationTab.expectTranslationToMatch(forms.toRichText(
      'Yeh aakhri panna hain.'));
    explorationEditorTranslationTab.expectCorrectStatusColor(
      'first', YELLOW_STATE_PROGRESS_COLOR);
    explorationEditorTranslationTab.expectCorrectStatusColor(
      'second', RED_STATE_PROGRESS_COLOR);
    explorationEditorTranslationTab.expectCorrectStatusColor(
      'final card', GREEN_STATE_PROGRESS_COLOR);
    explorationEditorTranslationTab.expectNumericalStatusAccessibilityToMatch(
      '3 items translated out of 8 items');
    users.logout();
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
  });
});

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
 * @fileoverview End-to-end tests for the functionality of the feedback tab of
 * the exploration editor.
 */

var forms = require('../protractor_utils/forms.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var workflow = require('../protractor_utils/workflow.js');


var AdminPage = require('../protractor_utils/AdminPage.js');
var CreatorDashboardPage =
  require('../protractor_utils/CreatorDashboardPage.js');
var ExplorationEditorPage =
  require('../protractor_utils/ExplorationEditorPage.js');
var ExplorationPlayerPage =
  require('../protractor_utils/ExplorationPlayerPage.js');
var LibraryPage = require('../protractor_utils/LibraryPage.js');

describe('ExplorationFeedback', function() {
  var EXPLORATION_TITLE_1 = 'Exploration with Feedback';
  var EXPLORATION_TITLE_2 = 'Exploration for testing feedback status';
  var EXPLORATION_TITLE_3 = 'Exploration for testing feedback message';
  var EXPLORATION_OBJECTIVE = 'To explore something';
  var EXPLORATION_CATEGORY = 'Algorithms';
  var EXPLORATION_LANGUAGE = 'English';
  var adminPage = null;
  var explorationEditorPage = null;
  var explorationEditorFeedbackTab = null;
  var creatorDashboardPage = null;
  var libraryPage = null;
  var explorationPlayerPage = null;

  beforeAll(function() {
    adminPage = new AdminPage.AdminPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationEditorFeedbackTab = explorationEditorPage.getFeedbackTab();
    creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage();
    libraryPage = new LibraryPage.LibraryPage();
    explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();

    users.createUser(
      'user1@ExplorationFeedback.com',
      'creatorExplorationFeedback');
    users.createUser(
      'user2@ExplorationFeedback.com',
      'learnerExplorationFeedback');
    users.createUser(
      'user3@ExplorationFeedback.com',
      'creatorExplorationFeedbackStatusChange');
    users.createUser(
      'user4@ExplorationFeedback.com',
      'learnerExplorationFeedbackStatusChange');
    users.createUser(
      'user5@ExplorationFeedback.com',
      'creatorFeedback');
    users.createUser(
      'user6@ExplorationFeedback.com',
      'learnerFeedback');
    users.createAndLoginAdminUser(
      'user7@ExplorationFeedback.com',
      'superUserExplorationFeedback');
    adminPage.editConfigProperty(
      'Exposes the Improvements Tab for creators in the exploration editor.',
      'Boolean', function(elem) {
        elem.setValue(false);
      });
  });

  it('should add feedback to an exploration', function() {
    var feedback = 'A good exploration. Would love to see a few more questions';
    var feedbackResponse = 'Thanks for the feedback';

    // Creator creates and publishes an exploration.
    users.login('user1@ExplorationFeedback.com');
    workflow.createAndPublishExploration(
      EXPLORATION_TITLE_1,
      EXPLORATION_CATEGORY,
      EXPLORATION_OBJECTIVE,
      EXPLORATION_LANGUAGE);
    creatorDashboardPage.get();
    expect(
      creatorDashboardPage.getNumberOfFeedbackMessages()
    ).toEqual(0);
    users.logout();

    // Learner plays the exploration and submits a feedback.
    users.login('user2@ExplorationFeedback.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE_1);
    libraryPage.playExploration(EXPLORATION_TITLE_1);
    explorationPlayerPage.submitFeedback(feedback);
    users.logout();

    // Creator reads the feedback and responds.
    users.login('user1@ExplorationFeedback.com');
    creatorDashboardPage.get();
    expect(
      creatorDashboardPage.getNumberOfFeedbackMessages()
    ).toEqual(1);
    creatorDashboardPage.navigateToExplorationEditor();

    explorationEditorPage.navigateToFeedbackTab();
    explorationEditorFeedbackTab.expectToHaveFeedbackThread();
    explorationEditorFeedbackTab.readFeedbackMessages()
      .then(function(messages) {
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual(feedback);
      });
    explorationEditorPage.navigateToFeedbackTab();
    explorationEditorFeedbackTab.sendResponseToLatestFeedback(feedbackResponse);
    users.logout();
  });

  it('should change status of feedback thread', function() {
    var feedback = 'Hey! This exploration looks awesome';
    var feedbackResponse = 'Thanks for the feedback!';

    // Creator creates and publishes an exploration.
    users.login('user3@ExplorationFeedback.com');
    workflow.createAndPublishExploration(
      EXPLORATION_TITLE_2,
      EXPLORATION_CATEGORY,
      EXPLORATION_OBJECTIVE,
      EXPLORATION_LANGUAGE);
    creatorDashboardPage.get();
    expect(
      creatorDashboardPage.getNumberOfFeedbackMessages()
    ).toEqual(0);
    users.logout();

    // Learner plays the exploration and submits a feedback.
    users.login('user4@ExplorationFeedback.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE_2);
    libraryPage.playExploration(EXPLORATION_TITLE_2);
    explorationPlayerPage.submitFeedback(feedback);
    users.logout();

    // Creator reads the feedback and responds.
    users.login('user3@ExplorationFeedback.com');
    creatorDashboardPage.get();
    expect(
      creatorDashboardPage.getNumberOfFeedbackMessages()
    ).toEqual(1);
    creatorDashboardPage.navigateToExplorationEditor();

    explorationEditorPage.navigateToFeedbackTab();
    explorationEditorFeedbackTab.expectToHaveFeedbackThread();
    explorationEditorFeedbackTab.readFeedbackMessages()
      .then(function(messages) {
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual(feedback);
      });
    explorationEditorFeedbackTab.selectLatestFeedbackThread();
    explorationEditorFeedbackTab.expectFeedbackStatusNameToBe('Open');
    explorationEditorFeedbackTab.changeFeedbackStatus(
      'Fixed', feedbackResponse);
    explorationEditorFeedbackTab.expectFeedbackStatusNameToBe('Fixed');
    browser.refresh();
    explorationEditorFeedbackTab.selectLatestFeedbackThread();
    explorationEditorFeedbackTab.expectFeedbackStatusNameToBe('Fixed');
    explorationEditorFeedbackTab.changeFeedbackStatus(
      'Open', feedbackResponse);
    explorationEditorFeedbackTab.expectFeedbackStatusNameToBe('Open');

    users.logout();
  });

  it('should send message to feedback thread', function() {
    var feedback = 'A good exploration. Would love to see a few more questions';
    var feedbackResponse = 'Thanks for the feedback';

    // Creator creates and publishes an exploration.
    users.login('user5@ExplorationFeedback.com');
    workflow.createAndPublishExploration(
      EXPLORATION_TITLE_3,
      EXPLORATION_CATEGORY,
      EXPLORATION_OBJECTIVE,
      EXPLORATION_LANGUAGE);
    creatorDashboardPage.get();
    expect(
      creatorDashboardPage.getNumberOfFeedbackMessages()
    ).toEqual(0);
    users.logout();

    // Learner plays the exploration and submits a feedback.
    users.login('user6@ExplorationFeedback.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE_3);
    libraryPage.playExploration(EXPLORATION_TITLE_3);
    explorationPlayerPage.submitFeedback(feedback);
    users.logout();

    // Creator reads the feedback and responds.
    users.login('user5@ExplorationFeedback.com');
    creatorDashboardPage.get();
    expect(
      creatorDashboardPage.getNumberOfFeedbackMessages()
    ).toEqual(1);
    creatorDashboardPage.navigateToExplorationEditor();

    explorationEditorPage.navigateToFeedbackTab();
    explorationEditorFeedbackTab.expectToHaveFeedbackThread();
    explorationEditorFeedbackTab.readFeedbackMessages()
      .then(function(messages) {
        expect(messages.length).toEqual(1);
        expect(messages[0]).toEqual(feedback);
      });
    explorationEditorPage.navigateToFeedbackTab();
    explorationEditorFeedbackTab.sendResponseToLatestFeedback(
      feedbackResponse);
    explorationEditorFeedbackTab.readFeedbackMessagesFromThread()
      .then(function(messages) {
        expect(messages.length).toEqual(2);
        expect(messages[0].getText()).toEqual(feedback);
        expect(messages[1].getText()).toEqual(feedbackResponse);
      });
    browser.refresh();
    explorationEditorFeedbackTab.selectLatestFeedbackThread();
    explorationEditorFeedbackTab.readFeedbackMessagesFromThread()
      .then(function(messages) {
        expect(messages.length).toEqual(2);
        expect(messages[0].getText()).toEqual(feedback);
        expect(messages[1].getText()).toEqual(feedbackResponse);
      });
    users.logout();
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
  });
});

describe('Suggestions on Explorations', function() {
  var EXPLORATION_TITLE = 'Exploration with Suggestion';
  var EXPLORATION_CATEGORY = 'Algorithms';
  var EXPLORATION_OBJECTIVE = 'To explore something new';
  var EXPLORATION_LANGUAGE = 'English';
  var adminPage = null;
  var creatorDashboardPage = null;
  var libraryPage = null;
  var explorationEditorPage = null;
  var explorationEditorFeedbackTab = null;
  var explorationPlayerPage = null;

  beforeAll(function() {
    adminPage = new AdminPage.AdminPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationEditorFeedbackTab = explorationEditorPage.getFeedbackTab();
    explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();
    creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage();
    libraryPage = new LibraryPage.LibraryPage();

    users.createUser(
      'user1@ExplorationSuggestions.com',
      'authorExplorationSuggestions');
    users.createUser(
      'user2@ExplorationSuggestions.com',
      'suggesterExplorationSuggestions');
    users.createUser(
      'user3@ExplorationSuggestions.com',
      'studentExplorationSuggestions');
    users.createAndLoginAdminUser(
      'user4@ExplorationSuggestions.com',
      'configExplorationSuggestions');
    adminPage.editConfigProperty(
      'Exposes the Improvements Tab for creators in the exploration editor.',
      'Boolean', function(elem) {
        elem.setValue(false);
      });
  });

  it('accepts & rejects a suggestion on a published exploration', function() {
    users.login('user1@ExplorationSuggestions.com');
    workflow.createAndPublishExploration(
      EXPLORATION_TITLE,
      EXPLORATION_CATEGORY,
      EXPLORATION_OBJECTIVE,
      EXPLORATION_LANGUAGE);
    users.logout();

    // Suggester plays the exploration and suggests a change.
    users.login('user2@ExplorationSuggestions.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE);
    libraryPage.playExploration(EXPLORATION_TITLE);

    var suggestion1 = 'New Exploration';
    var suggestionDescription1 = 'Uppercased the first letter';
    var suggestion2 = 'New exploration';
    var suggestionDescription2 = 'Changed';

    explorationPlayerPage.submitSuggestion(
      suggestion1, suggestionDescription1);
    explorationPlayerPage.clickOnCloseSuggestionModalButton();
    explorationPlayerPage.submitSuggestion(
      suggestion2, suggestionDescription2);
    users.logout();

    // Exploration author reviews the suggestion and accepts it.
    users.login('user1@ExplorationSuggestions.com');
    creatorDashboardPage.get();
    creatorDashboardPage.navigateToExplorationEditor();

    explorationEditorPage.navigateToFeedbackTab();
    explorationEditorFeedbackTab.getSuggestionThreads().then(
      function(threads) {
        expect(threads.length).toEqual(2);
        expect(threads[0]).toMatch(suggestionDescription2);
      });
    explorationEditorFeedbackTab.acceptSuggestion(suggestionDescription1);
    explorationEditorFeedbackTab.goBackToAllFeedbacks();
    explorationEditorFeedbackTab.rejectSuggestion(suggestionDescription2);

    explorationEditorPage.navigateToPreviewTab();
    explorationPlayerPage.expectContentToMatch(forms.toRichText(suggestion1));
    users.logout();

    // Student logs in and plays the exploration, finds the updated content.
    users.login('user3@ExplorationSuggestions.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE);
    libraryPage.playExploration(EXPLORATION_TITLE);
    explorationPlayerPage.expectContentToMatch(forms.toRichText(suggestion1));
    users.logout();
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
  });
});

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
 * @fileoverview End-to-end tests of the publication and featuring process, and
 * the resultant display of explorations in the library.
 */

var forms = require('../protractor_utils/forms.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var workflow = require('../protractor_utils/workflow.js');

var AdminPage = require('../protractor_utils/AdminPage.js');
var ExplorationEditorPage =
  require('../protractor_utils/ExplorationEditorPage.js');
var ExplorationPlayerPage =
  require('../protractor_utils/ExplorationPlayerPage.js');
var LibraryPage = require('../protractor_utils/LibraryPage.js');

describe('Library index page', function() {
  var adminPage = null;
  var libraryPage = null;
  var explorationEditorPage = null;
  var explorationEditorMainTab = null;
  var explorationEditorSettingsTab = null;
  var explorationPlayerPage = null;

  beforeAll(function() {
    adminPage = new AdminPage.AdminPage();
    libraryPage = new LibraryPage.LibraryPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationEditorMainTab = explorationEditorPage.getMainTab();
    explorationEditorSettingsTab = explorationEditorPage.getSettingsTab();
    explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();

    users.createAndLoginAdminUser(
      'superUser@publicationAndLibrary.com', 'superUser');
    // TODO(#7569): Change this test to work with the improvements tab.
    adminPage.editConfigProperty(
      'Exposes the Improvements Tab for creators in the exploration editor',
      'Boolean',
      function(elem) {
        elem.setValue(false);
      });
    users.logout();
  });

  it('should display private and published explorations', function() {
    var EXPLORATION_SILMARILS = 'silmarils';
    var EXPLORATION_VINGILOT = 'Vingilot';
    var CATEGORY_ARCHITECTURE = 'Architecture';
    var CATEGORY_BUSINESS = 'Business';
    var LANGUAGE_ENGLISH = 'English';
    var LANGUAGE_FRANCAIS = 'français';
    var LANGUAGE_DEUTSCH = 'Deutsch';

    users.createModerator(
      'varda@publicationAndLibrary.com', 'vardaPublicationAndLibrary');
    users.createUser(
      'feanor@publicationAndLibrary.com', 'feanorPublicationAndLibrary');
    users.createUser(
      'celebrimor@publicationAndLibrary.com', 'celebriorPublicationAndLibrary');
    users.createUser(
      'earendil@publicationAndLibrary.com', 'earendilPublicationAndLibrary');

    users.login('feanor@publicationAndLibrary.com');
    workflow.createAndPublishExploration(
      EXPLORATION_SILMARILS, CATEGORY_ARCHITECTURE,
      'hold the light of the two trees', LANGUAGE_DEUTSCH);
    users.logout();

    users.login('earendil@publicationAndLibrary.com');
    workflow.createAndPublishExploration(
      EXPLORATION_VINGILOT, CATEGORY_BUSINESS, 'seek the aid of the Valar');
    users.logout();

    users.login('varda@publicationAndLibrary.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_VINGILOT);
    libraryPage.playExploration(EXPLORATION_VINGILOT);
    general.moveToEditor();
    // Moderators can edit explorations.
    explorationEditorPage.navigateToSettingsTab();
    explorationEditorSettingsTab.setLanguage(LANGUAGE_FRANCAIS);
    explorationEditorPage.saveChanges('change language');
    users.logout();

    users.login('celebrimor@publicationAndLibrary.com');
    workflow.createExploration();
    explorationEditorMainTab.setContent(
      forms.toRichText('Celebrimbor wrote this'));
    explorationEditorMainTab.setInteraction('EndExploration');
    explorationEditorPage.navigateToSettingsTab();
    explorationEditorSettingsTab.setObjective(
      'preserve the works of the elves');
    explorationEditorPage.saveChanges();

    // There are now two non-private explorations whose titles, categories
    // and languages are, respectively:
    // - silmarils, gems, Deutsch
    // - Vingilot, ships, français

    var ALL_PUBLIC_EXPLORATION_TITLES = [
      EXPLORATION_SILMARILS, EXPLORATION_VINGILOT];

    var testCases = [{
      categories: [],
      languages: [],
      expectVisible: [EXPLORATION_SILMARILS, EXPLORATION_VINGILOT]
    }, {
      categories: [],
      languages: [LANGUAGE_ENGLISH, LANGUAGE_FRANCAIS],
      expectVisible: [EXPLORATION_VINGILOT]
    }, {
      categories: [],
      languages: [LANGUAGE_ENGLISH, LANGUAGE_DEUTSCH, LANGUAGE_FRANCAIS],
      expectVisible: [EXPLORATION_SILMARILS, EXPLORATION_VINGILOT]
    }, {
      categories: [CATEGORY_ARCHITECTURE],
      languages: [],
      expectVisible: [EXPLORATION_SILMARILS]
    }, {
      categories: [CATEGORY_ARCHITECTURE, CATEGORY_BUSINESS],
      languages: [],
      expectVisible: [EXPLORATION_SILMARILS, EXPLORATION_VINGILOT]
    }, {
      categories: [CATEGORY_ARCHITECTURE],
      languages: [LANGUAGE_DEUTSCH],
      expectVisible: [EXPLORATION_SILMARILS]
    }, {
      categories: [CATEGORY_ARCHITECTURE],
      languages: [LANGUAGE_FRANCAIS],
      expectVisible: []
    }];

    // We now check explorations are visible under the right conditions.
    browser.get('/search/find?q=&language_code=("en")');
    // The initial language selection should be just English.
    libraryPage.expectCurrentLanguageSelectionToBe([LANGUAGE_ENGLISH]);
    // At the start, no categories are selected.
    libraryPage.expectCurrentCategorySelectionToBe([]);

    // Reset the language selector.
    libraryPage.deselectLanguages([LANGUAGE_ENGLISH]);

    testCases.forEach(function(testCase) {
      libraryPage.selectLanguages(testCase.languages);
      libraryPage.selectCategories(testCase.categories);

      for (var explorationTitle in ALL_PUBLIC_EXPLORATION_TITLES) {
        if (testCase.expectVisible.indexOf(explorationTitle) !== -1) {
          libraryPage.expectExplorationToBeVisible(explorationTitle);
        } else {
          libraryPage.expectExplorationToBeHidden(explorationTitle);
        }
      }

      libraryPage.deselectLanguages(testCase.languages);
      libraryPage.deselectCategories(testCase.categories);
    });

    // Private explorations are not shown in the library.
    libraryPage.expectExplorationToBeHidden('Vilya');

    libraryPage.findExploration(EXPLORATION_VINGILOT);
    // The first letter of the objective is automatically capitalized.
    expect(libraryPage.getExplorationObjective(EXPLORATION_VINGILOT)).toBe(
      'Seek the aid of the Valar');
    libraryPage.findExploration(EXPLORATION_SILMARILS);
    libraryPage.playExploration(EXPLORATION_SILMARILS);
    explorationPlayerPage.expectExplorationNameToBe('silmarils');

    users.logout();
  });

  it('should not have any non translated strings', function() {
    var EXPLORATION_SILMARILS = 'silmarils';
    var EXPLORATION_VINGILOT = 'Vingilot';
    var CATEGORY_ENVIRONMENT = 'Environment';
    var CATEGORY_BUSINESS = 'Business';
    var LANGUAGE_FRANCAIS = 'français';
    users.createUser('aule@example.com', 'Aule');

    users.login('aule@example.com');
    workflow.createAndPublishExploration(
      EXPLORATION_SILMARILS, CATEGORY_BUSINESS,
      'hold the light of the two trees', LANGUAGE_FRANCAIS);
    workflow.createAndPublishExploration(
      EXPLORATION_VINGILOT, CATEGORY_ENVIRONMENT, 'seek the aid of the Valar');
    users.logout();

    libraryPage.get();
    libraryPage.expectMainHeaderTextToBe(
      'Imagine what you could learn today...');
    general.ensurePageHasNoTranslationIds();

    // Filter library explorations
    libraryPage.selectLanguages([LANGUAGE_FRANCAIS]);
    general.ensurePageHasNoTranslationIds();
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
  });
});


describe('Permissions for private explorations', function() {
  var explorationEditorPage = null;
  var explorationEditorMainTab = null;
  var explorationEditorSettingsTab = null;
  var explorationPlayerPage = null;
  var libraryPage = null;

  beforeEach(function() {
    libraryPage = new LibraryPage.LibraryPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationEditorMainTab = explorationEditorPage.getMainTab();
    explorationEditorSettingsTab = explorationEditorPage.getSettingsTab();
    explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();
  });
  it('should not be changeable if title is not given to exploration',
    function() {
      users.createUser('checkFor@title.com', 'Thanos');
      users.login('checkFor@title.com');
      workflow.createExploration();
      explorationEditorPage.navigateToSettingsTab();

      workflow.openEditRolesForm();
      expect(workflow.canAddRolesToUsers()).toBe(false);
      expect(workflow.checkForAddTitleWarning()).toBe(true);
      explorationEditorSettingsTab.setTitle('Pass');
      workflow.triggerTitleOnBlurEvent();
      expect(workflow.canAddRolesToUsers()).toBe(true);
      expect(workflow.checkForAddTitleWarning()).toBe(false);
    }
  );

  it('should be correct for collaborators', function() {
    users.createUser('alice@privileges.com', 'alicePrivileges');
    users.createUser('bob@privileges.com', 'bobPrivileges');
    users.createUser('eve@privileges.com', 'evePrivileges');

    users.login('alice@privileges.com');
    workflow.createExploration();
    explorationEditorPage.navigateToSettingsTab();
    explorationEditorSettingsTab.setTitle('CollaboratorPermissions');
    workflow.addExplorationCollaborator('bobPrivileges');
    expect(workflow.getExplorationManagers()).toEqual(['alicePrivileges']);
    expect(workflow.getExplorationCollaborators()).toEqual(['bobPrivileges']);
    expect(workflow.getExplorationPlaytesters()).toEqual([]);
    general.getExplorationIdFromEditor().then(function(explorationId) {
      users.logout();

      users.login('bob@privileges.com');
      general.openEditor(explorationId);
      explorationEditorMainTab.setContent(forms.toRichText('I love you'));
      explorationEditorMainTab.setInteraction('TextInput');
      explorationEditorPage.saveChanges();
      users.logout();

      users.login('eve@privileges.com');
      general.openEditor(explorationId);
      general.expect404Error();
      users.logout();
    });
  });

  it('should be correct for voice artists', function() {
    users.createUser('expOwner@oppia.tests', 'expOwner');
    users.createUser('voiceArtist@oppia.tests', 'voiceArtist');
    users.createUser('guestUser@oppia.tests', 'guestUser');

    users.login('expOwner@oppia.tests');
    workflow.createExploration();
    explorationEditorMainTab.setContent(forms.toRichText('this is card 1'));
    explorationEditorPage.saveChanges('Added content to first card.');
    explorationEditorPage.navigateToSettingsTab();
    explorationEditorSettingsTab.setTitle('voice artists');
    workflow.addExplorationVoiceArtist('voiceArtist');
    expect(workflow.getExplorationManagers()).toEqual(['expOwner']);
    expect(workflow.getExplorationCollaborators()).toEqual([]);
    expect(workflow.getExplorationVoiceArtists()).toEqual(['voiceArtist']);
    expect(workflow.getExplorationPlaytesters()).toEqual([]);
    general.getExplorationIdFromEditor().then(function(explorationId) {
      users.logout();

      users.login('voiceArtist@oppia.tests');
      general.openEditor(explorationId);
      explorationEditorMainTab.expectContentToMatch(
        forms.toRichText('this is card 1'));
      expect(element(by.css(
        '.protractor-test-save-changes')).isPresent()).toBeTruthy();
      users.logout();

      users.login('guestUser@oppia.tests');
      general.openEditor(explorationId);
      general.expect404Error();
      users.logout();
    });
  });

  afterEach(function() {
    general.checkForConsoleErrors([
      'Failed to load resource: the server responded with a status of 404'
    ]);
  });
});
