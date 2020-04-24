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
 * @fileoverview End-to-end tests for the community dashboard page.
 */

var general = require('../protractor_utils/general.js');

var CommunityDashboardPage = require(
  '../protractor_utils/CommunityDashboardPage.js');

describe('Community dashboard page', function() {
  var communityDashboardPage = null;
  var communityDashboardTranslateTextTab = null;

  beforeAll(function() {
    communityDashboardPage = (
      new CommunityDashboardPage.CommunityDashboardPage());
    communityDashboardTranslateTextTab = (
      communityDashboardPage.getTranslateTextTab());
    browser.get('/community_dashboard');
  });

  it('should allow user to switch to translate text tab', function() {
    communityDashboardPage.navigateToTranslateTextTab();
    communityDashboardTranslateTextTab.changeLanguage('Hindi');
    communityDashboardTranslateTextTab.expectSelectedLanguageToBe('Hindi');
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
 * @fileoverview End-to-end tests for the creator dashboard page.
 */

var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var workflow = require('../protractor_utils/workflow.js');

var CreatorDashboardPage =
  require('../protractor_utils/CreatorDashboardPage.js');
var ExplorationPlayerPage =
  require('../protractor_utils/ExplorationPlayerPage.js');
var LibraryPage = require('../protractor_utils/LibraryPage.js');
var PreferencesPage = require('../protractor_utils/PreferencesPage.js');
var SubscriptionDashboardPage =
  require('../protractor_utils/SubscriptionDashboardPage.js');

describe('Creator dashboard functionality', function() {
  var EXPLORATION_TITLE_1 = 'Exploration 1';
  var EXPLORATION_TITLE_2 = 'Exploration 2';
  var EXPLORATION_TITLE_3 = 'Exploration 3';
  var EXPLORATION_TITLE_4 = 'Exploration 4';
  var EXPLORATION_TITLE_5 = 'Exploration 5';
  var EXPLORATION_TITLE_6 = 'Exploration 6';
  var EXPLORATION_OBJECTIVE = 'To explore something';
  var EXPLORATION_CATEGORY = 'Algorithms';
  var EXPLORATION_LANGUAGE = 'English';

  var creatorDashboardPage = null;
  var explorationPlayerPage = null;
  var libraryPage = null;
  var subscriptionDashboardPage = null;

  beforeAll(function() {
    libraryPage = new LibraryPage.LibraryPage();
    creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage();
    explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();
    subscriptionDashboardPage =
      new SubscriptionDashboardPage.SubscriptionDashboardPage();
  });

  it('should display correct stats on dashboard', function() {
    var feedback = 'A good exploration. Would love to see a few more questions';
    // Create required users.
    users.createUser(
      'user1@creatorDashboard.com',
      'creatorDashboardOwner');
    users.createUser(
      'user2@creatorDashboard.com',
      'learner2');
    users.createUser(
      'user3@creatorDashboard.com',
      'learner3');
    users.createUser(
      'user4@creatorDashboard.com',
      'learner4');

    users.login('user1@creatorDashboard.com');
    workflow.createAndPublishExploration(
      EXPLORATION_TITLE_1,
      EXPLORATION_CATEGORY,
      EXPLORATION_OBJECTIVE,
      EXPLORATION_LANGUAGE);
    creatorDashboardPage.get();

    workflow.createAndPublishExploration(
      EXPLORATION_TITLE_2,
      EXPLORATION_CATEGORY,
      EXPLORATION_OBJECTIVE,
      EXPLORATION_LANGUAGE);

    users.login('user2@creatorDashboard.com');
    subscriptionDashboardPage.navigateToUserSubscriptionPage(
      'creatorDashboardOwner');
    subscriptionDashboardPage.navigateToSubscriptionButton();
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE_1);
    libraryPage.playExploration(EXPLORATION_TITLE_1);
    explorationPlayerPage.rateExploration(3);
    users.logout();

    users.login('user3@creatorDashboard.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE_1);
    libraryPage.playExploration(EXPLORATION_TITLE_1);
    explorationPlayerPage.rateExploration(5);
    explorationPlayerPage.submitFeedback(feedback);
    users.logout();

    users.login('user1@creatorDashboard.com');
    creatorDashboardPage.get();
    expect(creatorDashboardPage.getAverageRating()).toEqual('4');
    expect(creatorDashboardPage.getTotalPlays()).toEqual('2');
    expect(creatorDashboardPage.getOpenFeedbacks()).toEqual('1');
    expect(creatorDashboardPage.getSubscribers()).toEqual('1');
    users.logout();

    users.login('user4@creatorDashboard.com');
    subscriptionDashboardPage.navigateToUserSubscriptionPage(
      'creatorDashboardOwner');
    subscriptionDashboardPage.navigateToSubscriptionButton();
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE_2);
    libraryPage.playExploration(EXPLORATION_TITLE_2);
    explorationPlayerPage.rateExploration(4);
    explorationPlayerPage.submitFeedback(feedback);
    users.logout();

    users.login('user1@creatorDashboard.com');
    creatorDashboardPage.get();
    expect(creatorDashboardPage.getAverageRating()).toEqual('4');
    expect(creatorDashboardPage.getTotalPlays()).toEqual('3');
    expect(creatorDashboardPage.getOpenFeedbacks()).toEqual('2');
    expect(creatorDashboardPage.getSubscribers()).toEqual('2');
    users.logout();
  });

  it('should work fine in grid view', function() {
    var feedback = 'A good exploration. Would love to see a few more questions';
    // Create required users.
    users.createUser(
      'user5@creatorDashboard.com',
      'creatorDashboard');
    users.createUser(
      'user6@creatorDashboard.com',
      'learner6');
    users.createUser(
      'user7@creatorDashboard.com',
      'learner7');

    users.login('user5@creatorDashboard.com');
    workflow.createAndPublishExploration(
      EXPLORATION_TITLE_3,
      EXPLORATION_CATEGORY,
      EXPLORATION_OBJECTIVE,
      EXPLORATION_LANGUAGE);
    creatorDashboardPage.get();

    workflow.createAndPublishExploration(
      EXPLORATION_TITLE_4,
      EXPLORATION_CATEGORY,
      EXPLORATION_OBJECTIVE,
      EXPLORATION_LANGUAGE);
    users.logout();
    users.login('user6@creatorDashboard.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE_3);
    libraryPage.playExploration(EXPLORATION_TITLE_3);
    explorationPlayerPage.rateExploration(3);
    users.logout();

    users.login('user7@creatorDashboard.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE_4);
    libraryPage.playExploration(EXPLORATION_TITLE_4);
    explorationPlayerPage.rateExploration(5);
    explorationPlayerPage.submitFeedback(feedback);
    users.logout();

    users.login('user5@creatorDashboard.com');
    creatorDashboardPage.get();
    creatorDashboardPage.getExpSummaryTileTitles().
      then(function(titles) {
        expect(titles.length).toEqual(2);
        expect(titles[0].getText()).toEqual(EXPLORATION_TITLE_4);
        expect(titles[1].getText()).toEqual(EXPLORATION_TITLE_3);
      });
    creatorDashboardPage.getExpSummaryTileRatings().
      then(function(ratings) {
        expect(ratings.length).toEqual(2);
        expect(ratings[0].getText()).toEqual('5.0');
        expect(ratings[1].getText()).toEqual('3.0');
      });
    creatorDashboardPage.getExpSummaryTileOpenFeedbackCount().
      then(function(feedbackCount) {
        expect(feedbackCount.length).toEqual(2);
        expect(feedbackCount[0].getText()).toEqual('1');
        expect(feedbackCount[1].getText()).toEqual('0');
      });
    creatorDashboardPage.getExpSummaryTileViewsCount().
      then(function(views) {
        expect(views.length).toEqual(2);
        expect(views[0].getText()).toEqual('1');
        expect(views[1].getText()).toEqual('1');
      });
    users.logout();
  });

  it('should work fine in list view', function() {
    var feedback = 'A good exploration. Would love to see a few more questions';
    // Create required users.
    users.createUser(
      'user8@creatorDashboard.com',
      'newCreatorDashboard');
    users.createUser(
      'user9@creatorDashboard.com',
      'learner9');
    users.createUser(
      'user10@creatorDashboard.com',
      'learner10');

    users.login('user8@creatorDashboard.com');
    workflow.createAndPublishExploration(
      EXPLORATION_TITLE_5,
      EXPLORATION_CATEGORY,
      EXPLORATION_OBJECTIVE,
      EXPLORATION_LANGUAGE);
    creatorDashboardPage.get();

    workflow.createAndPublishExploration(
      EXPLORATION_TITLE_6,
      EXPLORATION_CATEGORY,
      EXPLORATION_OBJECTIVE,
      EXPLORATION_LANGUAGE);
    users.logout();
    users.login('user9@creatorDashboard.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE_5);
    libraryPage.playExploration(EXPLORATION_TITLE_5);
    explorationPlayerPage.rateExploration(3);
    users.logout();

    users.login('user10@creatorDashboard.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_TITLE_6);
    libraryPage.playExploration(EXPLORATION_TITLE_6);
    explorationPlayerPage.rateExploration(5);
    explorationPlayerPage.submitFeedback(feedback);
    users.logout();

    users.login('user8@creatorDashboard.com');
    creatorDashboardPage.get();

    creatorDashboardPage.getListView();

    creatorDashboardPage.getExpSummaryRowTitles().
      then(function(titles) {
        expect(titles.length).toEqual(2);
        expect(titles[0].getText()).toEqual(EXPLORATION_TITLE_6);
        expect(titles[1].getText()).toEqual(EXPLORATION_TITLE_5);
      });
    creatorDashboardPage.getExpSummaryRowRatings().
      then(function(ratings) {
        expect(ratings.length).toEqual(2);
        expect(ratings[0].getText()).toEqual('5.0');
        expect(ratings[1].getText()).toEqual('3.0');
      });
    creatorDashboardPage.getExpSummaryRowOpenFeedbackCount().
      then(function(feedbackCount) {
        expect(feedbackCount.length).toEqual(2);
        expect(feedbackCount[0].getText()).toEqual('1');
        expect(feedbackCount[1].getText()).toEqual('0');
      });
    creatorDashboardPage.getExpSummaryRowViewsCount().
      then(function(views) {
        expect(views.length).toEqual(2);
        expect(views[0].getText()).toEqual('1');
        expect(views[1].getText()).toEqual('1');
      });
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
 * @fileoverview End-to-end tests for the topics and skills dashboard page.
 */

var forms = require('../protractor_utils/forms.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var waitFor = require('../protractor_utils/waitFor.js');
var workflow = require('../protractor_utils/workflow.js');

var AdminPage = require('../protractor_utils/AdminPage.js');
var ExplorationEditorPage = require(
  '../protractor_utils/ExplorationEditorPage.js');
var TopicsAndSkillsDashboardPage = require(
  '../protractor_utils/TopicsAndSkillsDashboardPage.js');
var SkillEditorPage = require('../protractor_utils/SkillEditorPage.js');
var TopicEditorPage = require('../protractor_utils/TopicEditorPage.js');

describe('Topics and skills dashboard functionality', function() {
  var topicsAndSkillsDashboardPage = null;
  var skillEditorPage = null;
  var topicEditorPage = null;
  var explorationEditorPage = null;
  var explorationEditorMainTab = null;

  beforeAll(function() {
    topicsAndSkillsDashboardPage =
      new TopicsAndSkillsDashboardPage.TopicsAndSkillsDashboardPage();
    skillEditorPage =
      new SkillEditorPage.SkillEditorPage();
    topicEditorPage =
      new TopicEditorPage.TopicEditorPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationEditorMainTab = explorationEditorPage.getMainTab();
    users.createAdmin('creator@topicsAndSkillsDashboard.com',
      'creatorTopicsAndSkillsDashboard');
  });

  beforeEach(function() {
    users.login('creator@topicsAndSkillsDashboard.com');
    topicsAndSkillsDashboardPage.get();
  });

  it('should add a new topic to list', function() {
    topicsAndSkillsDashboardPage.expectNumberOfTopicsToBe(0);
    topicsAndSkillsDashboardPage.createTopic('Topic 1', 'abbrev');

    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.expectNumberOfTopicsToBe(1);
  });

  it('should move published skill to unused skills section', function() {
    topicsAndSkillsDashboardPage.createSkillWithDescriptionAndExplanation(
      'Skill 2', 'Concept card explanation');
    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.navigateToUnusedSkillsTab();
    topicsAndSkillsDashboardPage.expectNumberOfSkillsToBe(1);
  });

  it('should move skill to a topic', function() {
    topicsAndSkillsDashboardPage.navigateToUnusedSkillsTab();
    topicsAndSkillsDashboardPage.assignSkillWithIndexToTopic(0, 0);
    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.navigateToTopicWithIndex(0);
    topicEditorPage.moveToSubtopicsTab();
    topicEditorPage.expectNumberOfUncategorizedSkillsToBe(1);
  });

  it('should merge an outside skill with one in a topic', function() {
    topicsAndSkillsDashboardPage.createSkillWithDescriptionAndExplanation(
      'Skill to be merged', 'Concept card explanation');
    skillEditorPage.moveToQuestionsTab();
    skillEditorPage.clickCreateQuestionButton();
    skillEditorPage.confirmSkillDifficulty();
    explorationEditorMainTab.setContent(forms.toRichText('Question 1'));
    explorationEditorMainTab.setInteraction('TextInput', 'Placeholder', 5);
    explorationEditorMainTab.addResponse(
      'TextInput', forms.toRichText('Correct Answer'), null, false,
      'FuzzyEquals', 'correct');
    explorationEditorMainTab.getResponseEditor(0).markAsCorrect();
    explorationEditorMainTab.addHint('Hint 1');
    explorationEditorMainTab.addSolution('TextInput', {
      correctAnswer: 'correct',
      explanation: 'It is correct'
    });
    skillEditorPage.saveQuestion();
    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.navigateToUnusedSkillsTab();
    topicsAndSkillsDashboardPage.mergeSkillWithIndexToSkillWithIndex(0, 0);
    topicsAndSkillsDashboardPage.navigateToTopicWithIndex(0);
    topicEditorPage.moveToQuestionsTab();
    topicEditorPage.expectNumberOfQuestionsForSkillWithDescriptionToBe(
      1, 'Skill 2');
  });

  it('should remove a skill from list once deleted', function() {
    topicsAndSkillsDashboardPage.createSkillWithDescriptionAndExplanation(
      'Skill to be deleted', 'Concept card explanation');
    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.navigateToUnusedSkillsTab();
    topicsAndSkillsDashboardPage.expectNumberOfSkillsToBe(1);
    topicsAndSkillsDashboardPage.deleteSkillWithIndex(0);

    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.navigateToUnusedSkillsTab();
    topicsAndSkillsDashboardPage.expectNumberOfSkillsToBe(0);
  });

  it('should remove a topic from list once deleted', function() {
    topicsAndSkillsDashboardPage.expectNumberOfTopicsToBe(1);
    topicsAndSkillsDashboardPage.deleteTopicWithIndex(0);

    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.expectNumberOfTopicsToBe(0);
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
    users.logout();
  });
});

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
 * @fileoverview End-to-end tests for the learner dashboard page.
 */

var forms = require('../protractor_utils/forms.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var waitFor = require('../protractor_utils/waitFor.js');
var workflow = require('../protractor_utils/workflow.js');

var AdminPage = require('../protractor_utils/AdminPage.js');
var CreatorDashboardPage =
  require('../protractor_utils/CreatorDashboardPage.js');
var CollectionEditorPage =
  require('../protractor_utils/CollectionEditorPage.js');
var ExplorationEditorPage =
  require('../protractor_utils/ExplorationEditorPage.js');
var ExplorationPlayerPage =
  require('../protractor_utils/ExplorationPlayerPage.js');
var LearnerDashboardPage =
  require('../protractor_utils/LearnerDashboardPage.js');
var LibraryPage = require('../protractor_utils/LibraryPage.js');
var PreferencesPage = require('../protractor_utils/PreferencesPage.js');
var SubscriptionDashboardPage =
  require('../protractor_utils/SubscriptionDashboardPage.js');

describe('Learner dashboard functionality', function() {
  var creatorDashboardPage = null;
  var collectionEditorPage = null;
  var explorationEditorPage = null;
  var explorationEditorMainTab = null;
  var explorationEditorSettingsTab = null;
  var explorationPlayerPage = null;
  var libraryPage = null;
  var learnerDashboardPage = null;
  var subscriptionDashboardPage = null;

  beforeAll(function() {
    libraryPage = new LibraryPage.LibraryPage();
    learnerDashboardPage = new LearnerDashboardPage.LearnerDashboardPage();
    collectionEditorPage = new CollectionEditorPage.CollectionEditorPage();
    creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationEditorMainTab = explorationEditorPage.getMainTab();
    explorationEditorSettingsTab = explorationEditorPage.getSettingsTab();
    explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();
    subscriptionDashboardPage =
      new SubscriptionDashboardPage.SubscriptionDashboardPage();
  });

  it('displays learners subscriptions', function() {
    users.createUser('learner1@learnerDashboard.com',
      'learner1learnerDashboard');
    var creator1Id = 'creatorName';
    users.createUser(creator1Id + '@learnerDashboard.com', creator1Id);
    var creator2Id = 'collectionAdm';
    users.createUser(creator2Id + '@learnerDashboard.com',
      creator2Id);
    users.login(creator1Id + '@learnerDashboard.com');
    workflow.createAndPublishExploration(
      'Activations',
      'Chemistry',
      'Learn about different types of chemistry activations.',
      'English'
    );
    users.logout();

    users.login('learner1@learnerDashboard.com');
    // Subscribe to both the creators.
    subscriptionDashboardPage.navigateToUserSubscriptionPage(creator1Id);
    subscriptionDashboardPage.navigateToSubscriptionButton();
    subscriptionDashboardPage.navigateToUserSubscriptionPage(creator2Id);
    subscriptionDashboardPage.navigateToSubscriptionButton();

    // Completing exploration 'Activations' to activate /learner_dashboard
    libraryPage.get();
    libraryPage.findExploration('Activations');
    libraryPage.playExploration('Activations');
    explorationPlayerPage.expectExplorationNameToBe('Activations');
    explorationPlayerPage.rateExploration(4);

    // Both creators should be present in the subscriptions section of the
    // dashboard.
    learnerDashboardPage.get();
    learnerDashboardPage.navigateToSubscriptionsSection();
    // The last user (collectionAdm) that learner subsribes to is placed first
    // in the list.
    learnerDashboardPage.expectSubscriptionFirstNameToMatch('collect...');
    // The first user (creatorName) that learner subscribes to is placed
    // last in the list.
    learnerDashboardPage.expectSubscriptionLastNameToMatch('creator...');
    users.logout();
  });

  it('displays learner feedback threads', function() {
    users.createUser('learner2@learnerDashboard.com',
      'learner2learnerDashboard');
    users.createUser(
      'feedbackAdm@learnerDashboard.com', 'feedbackAdmlearnerDashboard');
    users.login('feedbackAdm@learnerDashboard.com');
    workflow.createAndPublishExploration(
      'BUS101',
      'Business',
      'Learn about different business regulations around the world.',
      'English'
    );
    users.logout();

    users.login('learner2@learnerDashboard.com');
    var feedback = 'A good exploration. Would love to see a few more questions';
    libraryPage.get();
    libraryPage.findExploration('BUS101');
    libraryPage.playExploration('BUS101');
    explorationPlayerPage.submitFeedback(feedback);

    // Verify feedback thread is created.
    learnerDashboardPage.get();
    learnerDashboardPage.navigateToFeedbackSection();
    learnerDashboardPage.expectFeedbackExplorationTitleToMatch('BUS101');
    learnerDashboardPage.navigateToFeedbackThread();
    learnerDashboardPage.expectFeedbackMessageToMatch(feedback);
    users.logout();
  });

  it('should add exploration to play later list', function() {
    var EXPLORATION_FRACTION = 'fraction';
    var EXPLORATION_SINGING = 'singing';
    var CATEGORY_MATHEMATICS = 'Mathematics';
    var CATEGORY_MUSIC = 'Music';
    var LANGUAGE_ENGLISH = 'English';
    var EXPLORATION_OBJECTIVE = 'hold the light of two trees';
    var EXPLORATION_OBJECTIVE2 = 'show us the darkness';

    users.createUser(
      'creator@learnerDashboard.com', 'creatorLearnerDashboard');
    users.login('creator@learnerDashboard.com');
    workflow.createAndPublishExploration(
      EXPLORATION_FRACTION, CATEGORY_MATHEMATICS,
      EXPLORATION_OBJECTIVE, LANGUAGE_ENGLISH);
    workflow.createAndPublishExploration(
      EXPLORATION_SINGING, CATEGORY_MUSIC,
      EXPLORATION_OBJECTIVE2, LANGUAGE_ENGLISH);
    users.logout();

    users.createUser(
      'learner@learnerDashboard.com', 'learnerLearnerDashboard');
    users.login('learner@learnerDashboard.com');
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_FRACTION);
    libraryPage.addSelectedExplorationToPlaylist();
    learnerDashboardPage.get();
    learnerDashboardPage.navigateToPlayLaterExplorationSection();
    learnerDashboardPage.expectTitleOfExplorationSummaryTileToMatch(
      EXPLORATION_FRACTION);
    libraryPage.get();
    libraryPage.findExploration(EXPLORATION_SINGING);
    libraryPage.addSelectedExplorationToPlaylist();
    learnerDashboardPage.get();
    learnerDashboardPage.navigateToPlayLaterExplorationSection();
    learnerDashboardPage.expectTitleOfExplorationSummaryTileToMatch(
      EXPLORATION_SINGING);
    users.logout();
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
  });
});
