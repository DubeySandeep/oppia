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
 * @fileoverview End-to-end tests to login, check various pages
 * and then logout.
 */

var LearnerDashboardPage = require(
  '../protractor_utils/LearnerDashboardPage.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var waitFor = require('../protractor_utils/waitFor.js');

describe('Profile menu flow', function() {
  var learnerDashboardPage = null;

  beforeAll(function() {
    learnerDashboardPage = new LearnerDashboardPage.LearnerDashboardPage();
    var VISITOR_USERNAME = 'desktopAndMobileVisitor';
    users.createAdmin(
      'desktopAndMobileAdm@profileMenuFlow.com', 'desktopAndMobileAdm');
    users.createAndLoginUser(
      'desktopAndMobileVisitor@profileMenuFlow.com', VISITOR_USERNAME);
  });

  it('should land on the learner dashboard after successful login',
    function() {
      expect(browser.getCurrentUrl()).toEqual(
        'http://localhost:9001/learner_dashboard');
    });

  describe('profile dropdown menu', function() {
    beforeEach(function() {
      users.login('desktopAndMobileVisitor@profileMenuFlow.com');
      learnerDashboardPage.get();
      var profileDropdown = element(by.css(
        '.protractor-test-profile-dropdown'));
      waitFor.elementToBeClickable(
        profileDropdown, 'Could not click profile dropdown');
      profileDropdown.click();
    });

    it('should visit the profile page from the profile dropdown menu',
      function() {
        var profileLink = element(by.css(
          '.protractor-test-profile-link'));
        waitFor.elementToBeClickable(
          profileLink, 'Could not click on the profile link');
        profileLink.click();
        waitFor.pageToFullyLoad();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:9001/profile/desktopAndMobileVisitor');
      });

    it('should visit the creator dashboard from the profile dropdown menu',
      function() {
        var creatorDashboardLink = element(by.css(
          '.protractor-test-creator-dashboard-link'));
        waitFor.elementToBeClickable(
          creatorDashboardLink,
          'Could not click on the creator dashboard link');
        creatorDashboardLink.click();
        waitFor.pageToFullyLoad();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:9001/creator_dashboard');
      });

    it('should visit the learner dashboard from the profile dropdown menu',
      function() {
        var learnerDashboardLink = element(by.css(
          '.protractor-test-learner-dashboard-link'));
        waitFor.elementToBeClickable(
          learnerDashboardLink,
          'Could not click on the learner dashboard link');
        learnerDashboardLink.click();
        waitFor.pageToFullyLoad();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:9001/learner_dashboard');
      });

    it('should not show the topics and skills dashboard link in the profile ' +
      'dropdown menu when user is not admin', function() {
      element.all(
        by.css(
          '.protractor-test-topics-and-skills-dashboard-link')
      ).then(function(links) {
        expect(links.length).toEqual(0);
      });
    });

    it('should visit the topics and skills dashboard from the profile ' +
      'dropdown menu when user is admin', function() {
      users.logout();

      users.login('desktopAndMobileAdm@profileMenuFlow.com');
      learnerDashboardPage.get();
      var profileDropdown = element(by.css(
        '.protractor-test-profile-dropdown'));
      waitFor.elementToBeClickable(
        profileDropdown, 'Could not click profile dropdown');
      profileDropdown.click();

      var topicsAndSkillsDashboardLink = element(by.css(
        '.protractor-test-topics-and-skills-dashboard-link'));
      waitFor.elementToBeClickable(
        topicsAndSkillsDashboardLink,
        'Could not click on the topics and skills dashboard link');
      topicsAndSkillsDashboardLink.click();
      waitFor.pageToFullyLoad();
      expect(browser.getCurrentUrl()).toEqual('http://localhost:9001/topics_and_skills_dashboard');
    });

    it('should visit the notifications page from the profile dropdown menu',
      function() {
        var notificationsDashboardLink = element(by.css(
          '.protractor-test-notifications-link'));
        waitFor.elementToBeClickable(
          notificationsDashboardLink,
          'Could not click on the notifications dashboard link');
        notificationsDashboardLink.click();
        waitFor.pageToFullyLoad();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:9001/notifications_dashboard');
      });

    it('should visit the preferences page from the profile dropdown menu',
      function() {
        var preferencesLink = element(by.css(
          '.protractor-test-preferences-link'));
        waitFor.elementToBeClickable(
          preferencesLink,
          'Could not click on the preferences link');
        preferencesLink.click();
        waitFor.pageToFullyLoad();
        expect(browser.getCurrentUrl()).toEqual('http://localhost:9001/preferences');
      });
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
    users.logout();
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
 * @fileoverview End-to-end tests for the skill editor page.
 */

var forms = require('../protractor_utils/forms.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var waitFor = require('../protractor_utils/waitFor.js');
var workflow = require('../protractor_utils/workflow.js');

var AdminPage = require('../protractor_utils/AdminPage.js');
var ExplorationEditorPage =
  require('../protractor_utils/ExplorationEditorPage.js');
var TopicsAndSkillsDashboardPage =
  require('../protractor_utils/TopicsAndSkillsDashboardPage.js');
var SkillEditorPage =
  require('../protractor_utils/SkillEditorPage.js');

describe('Skill Editor functionality', function() {
  var topicsAndSkillsDashboardPage = null;
  var skillEditorPage = null;
  var skillId = null;
  var explorationEditorPage = null;
  var explorationEditorMainTab = null;

  beforeAll(function() {
    topicsAndSkillsDashboardPage =
      new TopicsAndSkillsDashboardPage.TopicsAndSkillsDashboardPage();
    skillEditorPage =
      new SkillEditorPage.SkillEditorPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationEditorMainTab = explorationEditorPage.getMainTab();
    users.createAndLoginAdminUser(
      'creator@skillEditor.com', 'creatorSkillEditor');
    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.createSkillWithDescriptionAndExplanation(
      'Skill 1', 'Concept card explanation');
    browser.getCurrentUrl().then(function(url) {
      skillId = url.split('/')[4];
    }, function() {
      // Note to developers:
      // Promise is returned by getCurrentUrl which is handled here.
      // No further action is needed.
    });
  });

  beforeEach(function() {
    users.login('creator@skillEditor.com');
    skillEditorPage.get(skillId);
  });

  it('should edit description and concept card explanation', function() {
    skillEditorPage.changeSkillDescription('Skill 1 edited');
    skillEditorPage.editConceptCard('Test concept card explanation');
    skillEditorPage.saveOrPublishSkill(
      'Changed skill description and added review material.');

    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.expectSkillDescriptionToBe(
      'Skill 1 edited', 0);

    skillEditorPage.get(skillId);
    skillEditorPage.expectSkillDescriptionToBe('Skill 1 edited');
    skillEditorPage.expectConceptCardExplanationToMatch(
      'Test concept card explanation');
  });

  it('should create and delete worked examples', function() {
    skillEditorPage.addWorkedExample(
      'Example Question 1', 'Example Explanation 1');
    skillEditorPage.addWorkedExample(
      'Example Question 2', 'Example Explanation 2');
    skillEditorPage.saveOrPublishSkill('Added worked examples');

    skillEditorPage.get(skillId);
    skillEditorPage.expectWorkedExampleSummariesToMatch(
      ['Example Question 1', 'Example Question 2'],
      ['Example Explanation 1', 'Example Explanation 2']
    );

    skillEditorPage.deleteWorkedExampleWithIndex(0);
    skillEditorPage.saveOrPublishSkill('Deleted a worked example');

    skillEditorPage.get(skillId);
    skillEditorPage.expectWorkedExampleSummariesToMatch(
      ['Example Question 2'], ['Example Explanation 2']
    );
  });

  it('should edit rubrics for the skill', function() {
    skillEditorPage.expectRubricExplanationToMatch(0, 'Explanation 0');
    skillEditorPage.expectRubricExplanationToMatch(1, 'Explanation 1');
    skillEditorPage.expectRubricExplanationToMatch(2, 'Explanation 2');

    skillEditorPage.editRubricExplanationWithIndex(0, 'Explanation 0 edited');
    skillEditorPage.editRubricExplanationWithIndex(1, 'Explanation 1 edited');
    skillEditorPage.editRubricExplanationWithIndex(2, 'Explanation 2 edited');
    skillEditorPage.saveOrPublishSkill('Edited rubrics');

    skillEditorPage.get(skillId);
    skillEditorPage.expectRubricExplanationToMatch(0, 'Explanation 0 edited');
    skillEditorPage.expectRubricExplanationToMatch(1, 'Explanation 1 edited');
    skillEditorPage.expectRubricExplanationToMatch(2, 'Explanation 2 edited');
  });

  it('should create a question for the skill', function() {
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

    skillEditorPage.get(skillId);
    skillEditorPage.moveToQuestionsTab();
    skillEditorPage.expectNumberOfQuestionsToBe(1);
  });

  it('should create and delete misconceptions', function() {
    skillEditorPage.addMisconception(
      'Misconception 1', 'Notes 1', 'Feedback 1');
    skillEditorPage.addMisconception(
      'Misconception 2', 'Notes 2', 'Feedback 2');
    skillEditorPage.saveOrPublishSkill('Added misconceptions');

    skillEditorPage.get(skillId);
    skillEditorPage.expectNumberOfMisconceptionsToBe(2);

    skillEditorPage.deleteMisconception(1);
    skillEditorPage.saveOrPublishSkill('Deleted a misconception');

    skillEditorPage.get(skillId);
    skillEditorPage.expectNumberOfMisconceptionsToBe(1);
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
 * @fileoverview End-to-end tests for the subscriptions functionality on desktop
 * and mobile.
 */

var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var waitFor = require('../protractor_utils/waitFor.js');

var AdminPage = require('../protractor_utils/AdminPage.js');
var CreatorDashboardPage =
  require('../protractor_utils/CreatorDashboardPage.js');
var PreferencesPage = require('../protractor_utils/PreferencesPage.js');
var SubscriptionDashboardPage =
  require('../protractor_utils/SubscriptionDashboardPage.js');

describe('Subscriptions functionality', function() {
  var creatorDashboardPage = null;
  var preferencesPage = null;
  var subscriptionDashboardPage = null;

  beforeEach(function() {
    creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage();
    preferencesPage = new PreferencesPage.PreferencesPage();
    subscriptionDashboardPage = (
      new SubscriptionDashboardPage.SubscriptionDashboardPage());
  });

  it('handle subscriptions to creators correctly', function() {
    // Create two creators.
    users.createUser('creator1Id@subscriptions.com', 'creator1Idsubscriptions');
    users.createUser('creator2Id@subscriptions.com', 'creator2Idsubscriptions');

    // Create a learner who subscribes to both the creators.
    users.createUser('learner1@subscriptions.com', 'learner1subscriptions');
    users.login('learner1@subscriptions.com');
    subscriptionDashboardPage.navigateToUserSubscriptionPage(
      'creator1Idsubscriptions');
    subscriptionDashboardPage.navigateToSubscriptionButton();
    subscriptionDashboardPage.navigateToUserSubscriptionPage(
      'creator2Idsubscriptions');
    subscriptionDashboardPage.navigateToSubscriptionButton();
    preferencesPage.get();
    preferencesPage.expectDisplayedFirstSubscriptionToBe('creator...');
    preferencesPage.expectDisplayedLastSubscriptionToBe('creator...');
    users.logout();

    // Create a learner who subscribes to creator1Id and unsubscribes from the
    // creator2Id.
    users.createUser('learner2@subscriptions.com', 'learner2subscriptions');
    users.login('learner2@subscriptions.com');
    subscriptionDashboardPage.navigateToUserSubscriptionPage(
      'creator1Idsubscriptions');
    subscriptionDashboardPage.navigateToSubscriptionButton();
    subscriptionDashboardPage.navigateToUserSubscriptionPage(
      'creator2Idsubscriptions');

    // Subscribe and then unsubscribe from the same user.
    subscriptionDashboardPage.navigateToSubscriptionButton();
    subscriptionDashboardPage.navigateToSubscriptionButton();
    preferencesPage.get();
    preferencesPage.expectSubscriptionCountToEqual(1);
    preferencesPage.expectDisplayedFirstSubscriptionToBe('creator...');
    users.logout();

    // Verify there are 2 subscribers.
    users.login('creator1Id@subscriptions.com');
    // Go to the creator_dashboard.
    creatorDashboardPage.get();
    creatorDashboardPage.clickCreateNewExplorationButton();
    creatorDashboardPage.get();
    creatorDashboardPage.navigateToSubscriptionDashboard();
    subscriptionDashboardPage.expectSubscriptionFirstNameToMatch('learner...');
    subscriptionDashboardPage.expectSubscriptionLastNameToMatch('learner...');
    users.logout();

    // Verify there are 1 subscriber.
    users.login('creator2Id@subscriptions.com');
    // Go to the creator_dashboard.
    creatorDashboardPage.get();
    creatorDashboardPage.clickCreateNewExplorationButton();
    creatorDashboardPage.get();
    creatorDashboardPage.navigateToSubscriptionDashboard();
    subscriptionDashboardPage.expectSubscriptionCountToEqual(1);
    subscriptionDashboardPage.expectSubscriptionLastNameToMatch('learner...');
    users.logout();
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
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
 * @fileoverview End-to-end tests for the topic editor page.
 */

var forms = require('../protractor_utils/forms.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var waitFor = require('../protractor_utils/waitFor.js');
var workflow = require('../protractor_utils/workflow.js');

var AdminPage = require('../protractor_utils/AdminPage.js');
var TopicsAndSkillsDashboardPage =
  require('../protractor_utils/TopicsAndSkillsDashboardPage.js');
var TopicEditorPage = require('../protractor_utils/TopicEditorPage.js');
var StoryEditorPage = require('../protractor_utils/StoryEditorPage.js');
var SkillEditorPage = require('../protractor_utils/SkillEditorPage.js');
var ExplorationEditorPage =
  require('../protractor_utils/ExplorationEditorPage.js');
var ExplorationPlayerPage =
  require('../protractor_utils/ExplorationPlayerPage.js');

describe('Topic editor functionality', function() {
  var topicsAndSkillsDashboardPage = null;
  var topicEditorPage = null;
  var storyEditorPage = null;
  var topicId = null;
  var skillEditorPage = null;
  var explorationEditorPage = null;
  var explorationEditorMainTab = null;

  beforeAll(function() {
    topicsAndSkillsDashboardPage =
      new TopicsAndSkillsDashboardPage.TopicsAndSkillsDashboardPage();
    topicEditorPage = new TopicEditorPage.TopicEditorPage();
    storyEditorPage = new StoryEditorPage.StoryEditorPage();
    skillEditorPage = new SkillEditorPage.SkillEditorPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationEditorMainTab = explorationEditorPage.getMainTab();
    users.createAndLoginAdminUser(
      'creator@topicEditor.com', 'creatorTopicEditor');
    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.createTopic('Topic 1', 'abbrev');
    browser.getCurrentUrl().then(function(url) {
      topicId = url.split('/')[4];
    }, function() {
      // Note to developers:
      // Promise is returned by getCurrentUrl which is handled here.
      // No further action is needed.
    });
  });

  beforeEach(function() {
    users.login('creator@topicEditor.com');
    topicEditorPage.get(topicId);
  });

  it('should add and delete subtopics correctly', function() {
    topicEditorPage.moveToSubtopicsTab();
    topicEditorPage.addSubtopic('Subtopic 1');
    topicEditorPage.expectNumberOfSubtopicsToBe(1);
    topicEditorPage.saveTopic('Added subtopic.');

    topicEditorPage.get(topicId);
    topicEditorPage.moveToSubtopicsTab();
    topicEditorPage.expectNumberOfSubtopicsToBe(1);
    topicEditorPage.deleteSubtopicWithIndex(0);
    topicEditorPage.expectNumberOfSubtopicsToBe(0);
  });

  it('should edit subtopic page contents correctly', function() {
    topicEditorPage.moveToSubtopicsTab();
    topicEditorPage.editSubtopicWithIndex(0);
    topicEditorPage.changeSubtopicTitle('Modified Title');
    topicEditorPage.changeSubtopicPageContents(
      forms.toRichText('Subtopic Contents'));
    topicEditorPage.saveSubtopic();
    topicEditorPage.saveTopic('Edited subtopic.');

    topicEditorPage.get(topicId);
    topicEditorPage.moveToSubtopicsTab();
    topicEditorPage.expectTitleOfSubtopicWithIndexToMatch('Modified Title', 0);
    topicEditorPage.editSubtopicWithIndex(0);
    topicEditorPage.expectSubtopicPageContentsToMatch('Subtopic Contents');
  });

  it('should create a question for a skill in the topic', function() {
    var skillId = null;
    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.createSkillWithDescriptionAndExplanation(
      'Skill 1', 'Concept card explanation');
    browser.getCurrentUrl().then(function(url) {
      skillId = url.split('/')[4];
      topicsAndSkillsDashboardPage.get();
      topicsAndSkillsDashboardPage.navigateToUnusedSkillsTab();
      topicsAndSkillsDashboardPage.assignSkillWithIndexToTopic(0, 0);

      topicEditorPage.get(topicId);
      topicEditorPage.moveToQuestionsTab();
      topicEditorPage.createQuestionForSkillWithIndex(0);
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
      topicEditorPage.saveQuestion();

      topicEditorPage.get(topicId);
      topicEditorPage.moveToQuestionsTab();
      topicEditorPage.expectNumberOfQuestionsForSkillWithDescriptionToBe(
        1, 'Skill 1');

      skillEditorPage.get(skillId);
      skillEditorPage.moveToQuestionsTab();
      skillEditorPage.expectNumberOfQuestionsToBe(1);
    }, function() {
      // Note to developers:
      // Promise is returned by getCurrentUrl which is handled here.
      // No further action is needed.
    });
  });

  it('should add a canonical story to topic correctly', function() {
    topicEditorPage.expectNumberOfStoriesToBe(0);
    topicEditorPage.createStory('Story Title');
    storyEditorPage.returnToTopic();

    topicEditorPage.expectNumberOfStoriesToBe(1);
  });

  it('should edit story title, description and notes correctly', function() {
    topicEditorPage.navigateToStoryWithIndex(0);
    storyEditorPage.changeStoryNotes(forms.toRichText('Story notes'));
    storyEditorPage.changeStoryTitle('Story Title Edited');
    storyEditorPage.changeStoryDescription('Story Description');
    storyEditorPage.saveStory('Changed story title, description and notes');

    storyEditorPage.returnToTopic();
    topicEditorPage.expectStoryTitleToBe('Story Title Edited', 0);
    topicEditorPage.navigateToStoryWithIndex(0);

    storyEditorPage.expectTitleToBe('Story Title Edited');
    storyEditorPage.expectDescriptionToBe('Story Description');
    storyEditorPage.expectNotesToBe(forms.toRichText('Story notes'));
  });

  it('should add and remove nodes (chapters) from a story', function() {
    topicEditorPage.navigateToStoryWithIndex(0);
    storyEditorPage.expectNumberOfChaptersToBe(0);
    storyEditorPage.createInitialChapter('Chapter 1');
    storyEditorPage.expectNumberOfChaptersToBe(1);

    storyEditorPage.createNewDestinationChapter('Chapter 2');
    storyEditorPage.expectNumberOfChaptersToBe(2);
    storyEditorPage.deleteChapterWithIndex(1);
    storyEditorPage.expectNumberOfChaptersToBe(1);
  });

  it('should publish and unpublish a story correctly', function() {
    topicEditorPage.expectStoryPublicationStatusToBe('No', 0);
    topicEditorPage.navigateToStoryWithIndex(0);
    storyEditorPage.publishStory();
    storyEditorPage.returnToTopic();

    topicEditorPage.expectStoryPublicationStatusToBe('Yes', 0);
    topicEditorPage.navigateToStoryWithIndex(0);
    storyEditorPage.unpublishStory();
    storyEditorPage.returnToTopic();

    topicEditorPage.expectStoryPublicationStatusToBe('No', 0);
  });

  it('should assign a skill to, between, and from subtopics', function() {
    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.createSkillWithDescriptionAndExplanation(
      'Skill 2', 'Concept card explanation');

    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.navigateToUnusedSkillsTab();
    topicsAndSkillsDashboardPage.assignSkillWithIndexToTopic(0, 0);

    topicEditorPage.get(topicId);
    topicEditorPage.moveToSubtopicsTab();
    topicEditorPage.addSubtopic('Subtopic 1');
    topicEditorPage.addSubtopic('Subtopic 2');
    topicEditorPage.saveTopic('Added subtopics.');

    topicEditorPage.expectSubtopicToHaveSkills(0, []);
    topicEditorPage.expectSubtopicToHaveSkills(1, []);

    topicEditorPage.dragSkillToSubtopic(1, 0);
    topicEditorPage.expectSubtopicToHaveSkills(0, ['Skill 2']);
    topicEditorPage.expectSubtopicToHaveSkills(1, []);

    topicEditorPage.dragSkillBetweenSubtopics(0, 0, 1);
    topicEditorPage.expectSubtopicToHaveSkills(0, []);
    topicEditorPage.expectSubtopicToHaveSkills(1, ['Skill 2']);

    topicEditorPage.dragSkillFromSubtopicToUncategorized(1, 0);
    topicEditorPage.expectSubtopicToHaveSkills(0, []);
    topicEditorPage.expectSubtopicToHaveSkills(1, []);
  });

  afterEach(function() {
    general.checkForConsoleErrors([]);
    users.logout();
  });
});

describe('Chapter editor functionality', function() {
  var topicsAndSkillsDashboardPage = null;
  var topicEditorPage = null;
  var storyEditorPage = null;
  var storyId = null;
  var explorationEditorPage = null;
  var dummyExplorationIds = [];
  var dummyExplorationInfo = [
    'Dummy exploration', 'Algorithm', 'Learn more about oppia', 'English'];
  var dummySkills = [];
  var allowedErrors = [];
  var topicName = 'Topic 0';
  var userEmail = 'creator@chapterTest.com';

  var createDummyExplorations = function(numExplorations) {
    var ids = [];
    for (var i = 0; i < numExplorations; i++) {
      var info = dummyExplorationInfo.slice();
      info[0] += i.toString();
      workflow.createAndPublishExploration.apply(workflow, info);
      browser.getCurrentUrl().then(function(url) {
        var id = url.split('/')[4].replace('#', '');
        ids.push(id);
      });
    }
    return ids;
  };

  var createDummySkills = function(numSkills) {
    var skills = [];
    for (var i = 0; i < numSkills; i++) {
      var skillName = 'skillFromChapterEditor' + i.toString();
      var material = 'reviewMaterial' + i.toString();
      workflow.createSkillAndAssignTopic(skillName, material, topicName);
      skills.push(skillName);
    }
    return skills;
  };

  beforeAll(function() {
    topicsAndSkillsDashboardPage =
      new TopicsAndSkillsDashboardPage.TopicsAndSkillsDashboardPage();
    topicEditorPage = new TopicEditorPage.TopicEditorPage();
    storyEditorPage = new StoryEditorPage.StoryEditorPage();
    skillEditorPage = new SkillEditorPage.SkillEditorPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();
    explorationEditorMainTab = explorationEditorPage.getMainTab();
    users.createAndLoginAdminUser(
      userEmail, 'creatorChapterTest');
    dummyExplorationIds = createDummyExplorations(3);
    topicsAndSkillsDashboardPage.get();
    topicsAndSkillsDashboardPage.createTopic(topicName, 'abbrev');
    topicEditorPage.createStory('Story 0');
    browser.getCurrentUrl().then(function(url) {
      storyId = url.split('/')[4];
      dummySkills = createDummySkills(2);
    });
  });

  beforeEach(function() {
    users.login(userEmail);
    storyEditorPage.get(storyId);
  });

  it('should create a basic chapter.', function() {
    storyEditorPage.createInitialChapter('Chapter 1');
    storyEditorPage.setChapterExplorationId(dummyExplorationIds[0]);
    storyEditorPage.changeNodeOutline(forms.toRichText('First outline'));
    storyEditorPage.saveStory('First save');
  });

  it(
    'should check presence of skillreview RTE element in exploration ' +
    'linked to story', function() {
      browser.get('/create/' + dummyExplorationIds[0]);
      waitFor.pageToFullyLoad();
      explorationEditorMainTab.setContent(function(richTextEditor) {
        richTextEditor.addRteComponent(
          'Skillreview', 'Description', 'skillFromChapterEditor0');
      });
      explorationEditorPage.navigateToPreviewTab();
      explorationPlayerPage.expectContentToMatch(function(richTextChecker) {
        richTextChecker.readRteComponent(
          'Skillreview', 'Description', forms.toRichText('reviewMaterial0'));
      });
    });

  it('should add one more chapter to the story', function() {
    storyEditorPage.createNewDestinationChapter('Chapter 2');
    storyEditorPage.navigateToChapterByIndex(1);
    storyEditorPage.changeNodeOutline(forms.toRichText('Second outline'));
    storyEditorPage.setChapterExplorationId(dummyExplorationIds[1]);
    storyEditorPage.saveStory('Second save');
  });

  it('should fail to add one more chapter with existing exploration',
    function() {
      storyEditorPage.navigateToChapterByIndex(1);
      storyEditorPage.createNewDestinationChapter('Chapter 3');
      storyEditorPage.navigateToChapterByIndex(2);
      storyEditorPage.setChapterExplorationId(dummyExplorationIds[1]);
      storyEditorPage.expectExplorationIdAlreadyExistWarningAndCloseIt();
      allowedErrors.push('The given exploration already exists in the story.');
    }
  );

  it('should add one more chapter and change the chapters sequences',
    function() {
      storyEditorPage.navigateToChapterByIndex(1);
      storyEditorPage.createNewDestinationChapter('Chapter 3');
      storyEditorPage.navigateToChapterByIndex(2);
      storyEditorPage.setChapterExplorationId(dummyExplorationIds[2]);
      storyEditorPage.selectInitialChapterByName('Chapter 2');

      // Now Chapter 2 is the initial chapter and its destination is
      // Chapter 3. Make Chapter 2's destination to be Chapter 1
      storyEditorPage.navigateToChapterByIndex(0);
      storyEditorPage.removeDestination();
      storyEditorPage.selectDestinationChapterByName('Chapter 1');
      storyEditorPage.expectDestinationToBe('Chapter 1');

      // Make chapter 1's destination to be Chapter 3
      storyEditorPage.navigateToChapterByIndex(1);
      storyEditorPage.selectDestinationChapterByName('Chapter 3');
      storyEditorPage.expectDestinationToBe('Chapter 3');
    }
  );

  it('should add one prerequisite and acquired skill to chapter 1', function() {
    storyEditorPage.expectAcquiredSkillDescriptionCardCount(0);
    storyEditorPage.expectPrerequisiteSkillDescriptionCardCount(0);
    storyEditorPage.addAcquiredSkill(dummySkills[0]);
    storyEditorPage.expectAcquiredSkillDescriptionCardCount(1);
    storyEditorPage.addPrerequisiteSkill(dummySkills[1]);
    storyEditorPage.expectPrerequisiteSkillDescriptionCardCount(1);
    storyEditorPage.saveStory('Save');
  });

  it('should fail to add one prerequisite skill which is already added as' +
    ' acquired skill', function() {
    storyEditorPage.addAcquiredSkill(dummySkills[1]);
    storyEditorPage.expectSaveStoryDisabled();
    var warningRegex = new RegExp(
      'The skill with id [a-zA-Z0-9]+ is common to both the acquired and ' +
      'prerequisite skill id ' +
      'list in .*');
    storyEditorPage.expectWarningInIndicator(warningRegex);
  });

  it('should delete prerequisite skill and acquired skill', function() {
    storyEditorPage.deleteAcquiredSkillByIndex(0);
    storyEditorPage.expectAcquiredSkillDescriptionCardCount(0);
    storyEditorPage.deletePrerequisiteSkillByIndex(0);
    storyEditorPage.expectPrerequisiteSkillDescriptionCardCount(0);
  });

  it('should select the "Chapter 2" as initial chapter and get unreachable' +
    ' error', function() {
    storyEditorPage.selectInitialChapterByName('Chapter 2');
    storyEditorPage.expectDisplayUnreachableChapterWarning();
  });

  it('should delete one chapter and save', function() {
    storyEditorPage.expectNumberOfChaptersToBe(2);
    storyEditorPage.deleteChapterWithIndex(1);
    storyEditorPage.expectNumberOfChaptersToBe(1);
    storyEditorPage.saveStory('Last');
  });

  afterEach(function() {
    general.checkForConsoleErrors(allowedErrors);
    while (allowedErrors.length !== 0) {
      allowedErrors.pop();
    }
  });

  afterAll(function() {
    users.logout();
  });
});
