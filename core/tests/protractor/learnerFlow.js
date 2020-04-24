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
 * @fileoverview End-to-end tests for the learner flow.
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

describe('Learner dashboard functionality', function() {
  var adminPage = null;
  var creatorDashboardPage = null;
  var collectionEditorPage = null;
  var explorationEditorPage = null;
  var explorationEditorMainTab = null;
  var explorationEditorSettingsTab = null;
  var explorationPlayerPage = null;
  var libraryPage = null;
  var learnerDashboardPage = null;
  var oppiaLogo = element(by.css('.protractor-test-oppia-main-logo'));
  var continueButton = element(by.css('.protractor-test-continue-button'));
  var clickContinueButton = function() {
    waitFor.elementToBeClickable(
      continueButton, 'Could not click continue button');
    continueButton.click();
    waitFor.pageToFullyLoad();
  };

  var createDummyExplorationOnDesktop = function() {
    creatorDashboardPage.get();
    creatorDashboardPage.clickCreateActivityButton();
    waitFor.pageToFullyLoad();
    explorationEditorMainTab.exitTutorial();
    explorationEditorMainTab.setStateName('First');
    explorationEditorMainTab.setContent(forms.toRichText(
      'Hi there, I’m Oppia! I’m an online personal tutor for everybody!'));
    explorationEditorMainTab.setInteraction('Continue');
    var responseEditor = explorationEditorMainTab.getResponseEditor('default');
    responseEditor.setDestination('Second', true, null);
    explorationEditorMainTab.moveToState('Second');
    explorationEditorMainTab.setContent(forms.toRichText(
      'So what can I tell you?'));
    explorationEditorMainTab.setInteraction('MultipleChoiceInput', [
      forms.toRichText('How do your explorations work?'),
      forms.toRichText('What can you tell me about this website?'),
      forms.toRichText('How can I contribute to Oppia?'),
      forms.toRichText('Those were all the questions I had!')
    ]);
    explorationEditorMainTab.addResponse(
      'MultipleChoiceInput', null, 'End Card', true, 'Equals',
      'Those were all the questions I had!');
    responseEditor = explorationEditorMainTab.getResponseEditor('default');
    responseEditor.setFeedback(forms.toRichText('I do not know!'));
    explorationEditorMainTab.moveToState('End Card');
    explorationEditorMainTab.setContent(
      forms.toRichText('Congratulations, you have finished!'));
    explorationEditorMainTab.setInteraction('EndExploration');
    explorationEditorPage.navigateToSettingsTab();
    explorationEditorSettingsTab.setTitle('Dummy Exploration');
    explorationEditorSettingsTab.setCategory('Algorithm');
    explorationEditorSettingsTab.setObjective('Learn more about Oppia');
    explorationEditorSettingsTab.setLanguage('English');
    explorationEditorPage.saveChanges();
    workflow.publishExploration();
  };

  beforeAll(function() {
    adminPage = new AdminPage.AdminPage();
    libraryPage = new LibraryPage.LibraryPage();
    learnerDashboardPage = new LearnerDashboardPage.LearnerDashboardPage();
    // The editor and player page objects are only required for desktop testing.
    if (!browser.isMobile) {
      collectionEditorPage = new CollectionEditorPage.CollectionEditorPage();
      creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage();
      explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
      explorationEditorMainTab = explorationEditorPage.getMainTab();
      explorationEditorSettingsTab = explorationEditorPage.getSettingsTab();
      explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();
    }
  });

  it('visits the exploration player and plays the correct exploration',
    function() {
      users.createUser('expCreator@learnerDashboard.com',
        'expCreator');
      users.login('expCreator@learnerDashboard.com', true);
      // Create or load an exploration named 'Exploration Player Test'.
      if (browser.isMobile) {
        adminPage.reloadExploration('exploration_player_test.yaml');
      } else {
        workflow.createAndPublishExploration(
          'Exploration Player Test',
          'Astronomy',
          'To test the exploration player',
          'English'
        );
      }
      users.logout();
      var PLAYER_USERNAME = 'expPlayerDesktopAndMobile';
      users.createAndLoginUser(
        'expPlayerDesktopAndMobile@learnerFlow.com', PLAYER_USERNAME);
      libraryPage.get();
      libraryPage.findExploration('Exploration Player Test');
      libraryPage.playExploration('Exploration Player Test');
    });

  it('visits the collection player and plays the correct collection',
    function() {
      users.createUser('expOfCollectionCreator@learnerDashboard.com',
        'expOfCollectionCreator');
      users.login('expOfCollectionCreator@learnerDashboard.com', true);
      // Create or load a collection named
      // 'Introduction to Collections in Oppia'.
      if (browser.isMobile) {
        adminPage.reloadCollection(0);
      } else {
        workflow.createAndPublishExploration(
          'Demo Exploration',
          'Algebra',
          'To test collection player',
          'English'
        );
        // Update the role of the user to admin since only admin users
        // can create a collection.
        adminPage.get();
        adminPage.updateRole('expOfCollectionCreator', 'admin');
        workflow.createCollectionAsAdmin();
        collectionEditorPage.searchForAndAddExistingExploration(
          'Demo Exploration');
        collectionEditorPage.saveDraft();
        collectionEditorPage.closeSaveModal();
        collectionEditorPage.publishCollection();
        collectionEditorPage.setTitle('Introduction to Collections in Oppia');
        collectionEditorPage.setObjective(
          'This is a collection to test player.');
        collectionEditorPage.setCategory('Algebra');
        collectionEditorPage.saveChanges();
      }
      users.logout();
      var PLAYER_USERNAME = 'collectionPlayerDesktopAndMobile';
      users.createAndLoginUser(
        'collectionPlayerDesktopAndMobile@learnerFlow.com', PLAYER_USERNAME);
      libraryPage.get();
      libraryPage.findCollection('Introduction to Collections in Oppia');
      libraryPage.playCollection('Introduction to Collections in Oppia');
    });

  it('displays incomplete and completed explorations', function() {
    users.createUser('originalCreator@learnerDashboard.com',
      'originalCreator');
    users.login('originalCreator@learnerDashboard.com', true);
    // Create or load explorations.
    if (browser.isMobile) {
      adminPage.reloadExploration('learner_flow_test.yaml');
      adminPage.reloadExploration('protractor_mobile_test_exploration.yaml');
    } else {
      // Create exploration 'Dummy Exploration'
      createDummyExplorationOnDesktop();
      // Create a second exploration named 'Test Exploration'.
      workflow.createAndPublishExploration(
        'Test Exploration',
        'Astronomy',
        'To expand the horizon of the minds!',
        'English'
      );
    }
    users.logout();
    users.createAndLoginUser('learner@learnerDashboard.com',
      'learnerlearnerDashboard');
    // Go to 'Dummy Exploration'.
    libraryPage.get();
    libraryPage.findExploration('Dummy Exploration');
    libraryPage.playExploration('Dummy Exploration');
    waitFor.pageToFullyLoad();
    // Leave this exploration incomplete.
    if (browser.isMobile) {
      clickContinueButton();
    } else {
      // The exploration header is only visible in desktop browsers.
      explorationPlayerPage.expectExplorationNameToBe('Dummy Exploration');
      explorationPlayerPage.submitAnswer('Continue', null);
      explorationPlayerPage.expectExplorationToNotBeOver();
    }
    // User clicks on Oppia logo to leave exploration.
    oppiaLogo.click();
    general.acceptAlert();

    // Go to 'Test Exploration'.
    libraryPage.get();
    libraryPage.findExploration('Test Exploration');
    libraryPage.playExploration('Test Exploration');
    waitFor.pageToFullyLoad();
    oppiaLogo.click();
    waitFor.pageToFullyLoad();
    // Learner Dashboard should display 'Dummy Exploration'
    // as incomplete.
    learnerDashboardPage.checkIncompleteExplorationSection('Dummy Exploration');
    // Learner Dashboard should display 'Test Exploration'
    // exploration as complete.
    learnerDashboardPage.checkCompleteExplorationSection('Test Exploration');

    libraryPage.get();
    libraryPage.findExploration('Dummy Exploration');
    libraryPage.playExploration('Dummy Exploration');
    waitFor.pageToFullyLoad();
    // Now complete the 'Dummmy Exploration'.
    if (browser.isMobile) {
      clickContinueButton();
      // Navigate to the second page.
      clickContinueButton();
    } else {
      explorationPlayerPage.expectExplorationNameToBe('Dummy Exploration');
      explorationPlayerPage.submitAnswer('Continue', null);
      explorationPlayerPage.submitAnswer(
        'MultipleChoiceInput', 'Those were all the questions I had!');
    }
    // Both should be added to the completed section.
    learnerDashboardPage.get();
    learnerDashboardPage.checkCompleteExplorationSection('Dummy Exploration');
    learnerDashboardPage.checkCompleteExplorationSection('Test Exploration');
    users.logout();

    // For desktop, go to the exploration editor page and
    // delete 'Dummy Exploration'.
    if (!browser.isMobile) {
      // Login as Admin and delete exploration 'Dummy Exploration'.
      users.createAndLoginAdminUser('inspector@learnerDashboard.com',
        'inspector');
      libraryPage.get();
      libraryPage.findExploration('Dummy Exploration');
      libraryPage.playExploration('Dummy Exploration');
      // Wait for player page to completely load
      waitFor.pageToFullyLoad();
      general.getExplorationIdFromPlayer().then(function(explorationId) {
        general.openEditor(explorationId);
      });
      explorationEditorPage.navigateToSettingsTab();
      explorationEditorSettingsTab.deleteExploration();
      users.logout();

      // Verify exploration 'Dummy Exploration' is deleted
      // from learner dashboard.
      users.login('learner@learnerDashboard.com');
      learnerDashboardPage.get();
      learnerDashboardPage.navigateToCompletedSection();
      learnerDashboardPage.expectTitleOfExplorationSummaryTileToMatch(
        'Test Exploration');
      learnerDashboardPage.expectTitleOfExplorationSummaryTileToBeHidden(
        'Dummy Exploration');
    }
  });

  it('displays incomplete and completed collections', function() {
    users.createUser('explorationCreator@learnerDashboard.com',
      'explorationCreator');
    users.login('explorationCreator@learnerDashboard.com', true);
    // Create or load a collection.
    if (browser.isMobile) {
      adminPage.reloadCollection(1);
    } else {
      // Create first exploration named 'Dummy Exploration'.
      createDummyExplorationOnDesktop();
      // Create a second exploration named 'Collection Exploration'.
      workflow.createAndPublishExploration(
        'Collection Exploration',
        'Architect',
        'To be a part of a collection!',
        'English'
      );
      // Update the role of the user to admin since only admin users
      // can create a collection.
      adminPage.get();
      adminPage.updateRole('explorationCreator', 'admin');
      // Create new 'Test Collection' containing
      // exploration 'Dummy Exploration'.
      workflow.createCollectionAsAdmin();
      collectionEditorPage.searchForAndAddExistingExploration(
        'Dummy Exploration');
      collectionEditorPage.saveDraft();
      collectionEditorPage.closeSaveModal();
      collectionEditorPage.publishCollection();
      collectionEditorPage.setTitle('Test Collection');
      collectionEditorPage.setObjective('This is a test collection.');
      collectionEditorPage.setCategory('Algebra');
      collectionEditorPage.saveChanges();
    }
    users.logout();
    users.createAndLoginUser(
      'learner4@learnerDashboard.com', 'learner4learnerDashboard');

    // Go to 'Test Collection' and play it.
    libraryPage.get();
    libraryPage.findCollection('Test Collection');
    libraryPage.playCollection('Test Collection');
    waitFor.pageToFullyLoad();
    // The collection player has two sets of SVGs -- one which is
    // rendered for desktop and the other which is rendered for mobile.
    var firstExploration = browser.isMobile ? element.all(
      by.css('.protractor-mobile-test-collection-exploration')).first() :
      element.all(
        by.css('.protractor-test-collection-exploration')).first();
    // Click first exploration in collection.
    waitFor.elementToBeClickable(
      firstExploration, 'Could not click first exploration in collection');
    firstExploration.click();
    waitFor.pageToFullyLoad();
    // Leave this collection incomplete.
    if (browser.isMobile) {
      // In mobile, 'Play Exploration' button also needs to be clicked
      // to begin an exploration which is a part of a collection.
      var playExploration = element(
        by.css('.protractor-test-play-exploration-button'));
      waitFor.elementToBeClickable(
        playExploration, 'Could not click play exploration button');
      playExploration.click();
      waitFor.pageToFullyLoad();
      clickContinueButton();
    } else {
      explorationPlayerPage.submitAnswer('Continue', null);
      explorationPlayerPage.expectExplorationToNotBeOver();
    }
    // User clicks on Oppia logo to leave collection.
    oppiaLogo.click();
    general.acceptAlert();

    // Learner Dashboard should display
    // 'Test Collection' as incomplete.
    learnerDashboardPage.checkIncompleteCollectionSection('Test Collection');
    // Now find and play 'Test Collection' completely.
    libraryPage.get();
    libraryPage.findCollection('Test Collection');
    libraryPage.playCollection('Test Collection');
    waitFor.pageToFullyLoad();
    // The collection player has two sets of SVGs -- one which is
    // rendered for desktop and the other which is rendered for mobile.
    var firstExploration = browser.isMobile ? element.all(
      by.css('.protractor-mobile-test-collection-exploration')).first() :
      element.all(
        by.css('.protractor-test-collection-exploration')).first();
    // Click first exploration in collection.
    waitFor.elementToBeClickable(
      firstExploration, 'Could not click first exploration in collection');
    firstExploration.click();
    waitFor.pageToFullyLoad();
    if (browser.isMobile) {
      var playExploration = element(
        by.css('.protractor-test-play-exploration-button'));
      waitFor.elementToBeClickable(
        playExploration, 'Could not click play exploration button');
      playExploration.click();
      waitFor.pageToFullyLoad();
      clickContinueButton();
      waitFor.pageToFullyLoad();
      clickContinueButton();
      waitFor.pageToFullyLoad();
    } else {
      explorationPlayerPage.expectExplorationNameToBe('Dummy Exploration');
      explorationPlayerPage.submitAnswer('Continue', null);
      explorationPlayerPage.submitAnswer(
        'MultipleChoiceInput', 'Those were all the questions I had!');
    }
    // Learner Dashboard should display
    // 'Test Collection' as complete.
    learnerDashboardPage.get();
    learnerDashboardPage.checkCompleteCollectionSection('Test Collection');
    users.logout();

    // This part of the test is desktop-only for the following reasons:
    // 1. A user can only add an existing exploration to a collection it has
    //    created. For desktop tests, a user creates a collection and later on,
    //    it adds an existing exploration to the same collection. In case of
    //    mobile tests, a predefined collection is loaded and is not created by
    //    the user. Therefore, it cannot add an existing exploration to the
    //    predefined collection.
    // 2. This part involves the collection editor page, which has certain
    //    components that are not mobile-friendly.
    // 3. Creating and later on, editing a collection involves an admin user and
    //    not a super admin. For mobile tests, we sign-in as a super admin.
    // 4. The feature of adding an existing exploration to a collection using
    //    the collection editor page is in beta presently.
    if (!browser.isMobile) {
      // Add exploration 'Collection Exploration' to 'Test Collection'
      // and publish it.
      users.login('explorationCreator@learnerDashboard.com');
      creatorDashboardPage.get();
      waitFor.pageToFullyLoad();
      // Click on 'Collections' tab.
      var collectionsTab = element(by.css('.protractor-test-collections-tab'));
      collectionsTab.click();
      creatorDashboardPage.navigateToCollectionEditor();
      collectionEditorPage.searchForAndAddExistingExploration(
        'Collection Exploration');
      collectionEditorPage.saveDraft();
      collectionEditorPage.setCommitMessage('Add Collection Exploration');
      collectionEditorPage.closeSaveModal();
      users.logout();

      // Verify 'Test Collection' is now in the incomplete section.
      users.login('learner4@learnerDashboard.com');
      learnerDashboardPage.get();
      learnerDashboardPage.checkIncompleteCollectionSection('Test Collection');
    }
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
 * @fileoverview End-to-end tests for user preferences.
 */
var PreferencesPage = require('../protractor_utils/PreferencesPage.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');

describe('Preferences', function() {
  var preferencesPage = null;

  beforeEach(function() {
    preferencesPage = new PreferencesPage.PreferencesPage();
  });

  it('should let a user upload a profile photo', function() {
    users.createUser('eve@preferences.com', 'evePreferences');
    users.login('eve@preferences.com');
    preferencesPage.get();
    expect(preferencesPage.getProfilePhotoSource())
      .not
      .toEqual(
        preferencesPage.submitProfilePhoto('../data/img.png')
          .then(function() {
            return preferencesPage.getProfilePhotoSource();
          })
      );
  });

  it('should show an error if uploaded photo is too large', function() {
    users.createUser('lou@preferences.com', 'louPreferences');
    users.login('lou@preferences.com');
    preferencesPage.get();
    preferencesPage.uploadProfilePhoto(
      '../data/dummyLargeImage.jpg')
      .then(function() {
        preferencesPage.expectUploadError();
      });
  });

  it('should change editor role email checkbox value', function() {
    users.createUser('alice@preferences.com', 'alicePreferences');
    users.login('alice@preferences.com');
    preferencesPage.get();
    expect(preferencesPage.isEditorRoleEmailsCheckboxSelected()).toBe(true);
    preferencesPage.toggleEditorRoleEmailsCheckbox();
    expect(preferencesPage.isEditorRoleEmailsCheckboxSelected()).toBe(false);
    browser.refresh();
    expect(preferencesPage.isEditorRoleEmailsCheckboxSelected()).toBe(false);
  });

  it('should change feedback message email checkbox value', function() {
    users.createUser('bob@preferences.com', 'bobPreferences');
    users.login('bob@preferences.com');
    preferencesPage.get();
    expect(preferencesPage.isFeedbackEmailsCheckboxSelected()).toBe(true);
    preferencesPage.toggleFeedbackEmailsCheckbox();
    expect(preferencesPage.isFeedbackEmailsCheckboxSelected()).toBe(false);
    browser.refresh();
    expect(preferencesPage.isFeedbackEmailsCheckboxSelected()).toBe(false);
  });

  it('should set and edit bio in user profile', function() {
    users.createUser('lisa@preferences.com', 'lisaPreferences');
    users.login('lisa@preferences.com');
    preferencesPage.get();
    preferencesPage.setUserBio('I am Lisa');
    browser.refresh();
    preferencesPage.expectUserBioToBe('I am Lisa');
    preferencesPage.setUserBio('Junior student');
    browser.refresh();
    preferencesPage.expectUserBioToBe('Junior student');
    preferencesPage.editUserBio(' from USA');
    preferencesPage.editUserBio(' studying CS!');
    browser.refresh();
    preferencesPage.expectUserBioToBe('Junior student from USA studying CS!');
  });

  it('should change prefered audio language of the learner', function() {
    users.createUser('paul@preferences.com', 'paulPreferences');
    users.login('paul@preferences.com');
    preferencesPage.get();
    expect(preferencesPage.preferredAudioLanguageSelector).toBeUndefined();
    preferencesPage.selectPreferredAudioLanguage('Hindi');
    preferencesPage.expectPreferredAudioLanguageToBe('Hindi');
    browser.refresh();
    preferencesPage.expectPreferredAudioLanguageToBe('Hindi');
    preferencesPage.selectPreferredAudioLanguage('Arabic');
    preferencesPage.expectPreferredAudioLanguageToBe('Arabic');
    browser.refresh();
    preferencesPage.expectPreferredAudioLanguageToBe('Arabic');
  });

  it('should change prefered site language of the learner', function() {
    users.createUser('john@preferences.com', 'johnPreferences');
    users.login('john@preferences.com');
    preferencesPage.get();
    expect(preferencesPage.systemLanguageSelector).toBeUndefined();
    preferencesPage.selectSystemLanguage('Español');
    preferencesPage.expectPreferredSiteLanguageToBe('Español');
    browser.refresh();
    preferencesPage.expectPreferredSiteLanguageToBe('Español');
    preferencesPage.selectSystemLanguage('English');
    preferencesPage.expectPreferredSiteLanguageToBe('English');
    browser.refresh();
    preferencesPage.expectPreferredSiteLanguageToBe('English');
  });

  it('should load the correct dashboard according to selection', function() {
    users.createUser('lorem@preferences.com', 'loremPreferences');
    users.login('lorem@preferences.com');
    preferencesPage.get();
    preferencesPage.selectCreatorDashboard();
    general.goToHomePage();
    expect(browser.getCurrentUrl()).toEqual(
      'http://localhost:9001/creator_dashboard');
    preferencesPage.get();
    preferencesPage.selectLearnerDashboard();
    general.goToHomePage();
    expect(browser.getCurrentUrl()).toEqual(
      'http://localhost:9001/learner_dashboard');
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
 * @fileoverview End-to-end tests for user profile features.
 */

var DEFAULT_BIO = 'This user has not supplied a bio yet.';
var PLACEHOLDER_INTEREST_TEXT = 'none specified';

var forms = require('../protractor_utils/forms.js');
var users = require('../protractor_utils/users.js');
var general = require('../protractor_utils/general.js');
var waitFor = require('../protractor_utils/waitFor.js');
var workflow = require('../protractor_utils/workflow.js');

var CreatorDashboardPage =
  require('../protractor_utils/CreatorDashboardPage.js');
var ExplorationPlayerPage =
  require('../protractor_utils/ExplorationPlayerPage.js');
var LibraryPage = require('../protractor_utils/LibraryPage.js');
var PreferencesPage = require('../protractor_utils/PreferencesPage.js');
var ProfilePage = require('../protractor_utils/ProfilePage.js');

describe('Un-customized profile page', function() {
  var TEST_USERNAME = 'defaultProfileFeatures';
  var TEST_EMAIL = TEST_USERNAME + '@example.com';

  var profilePage = null;

  beforeAll(function() {
    profilePage = new ProfilePage.ProfilePage();
    users.createUser(TEST_EMAIL, TEST_USERNAME);
  });

  it('displays photo, default bio, and interest placeholder when logged in',
    function() {
      users.login(TEST_EMAIL);
      profilePage.get(TEST_USERNAME);
      profilePage.expectCurrUserToHaveProfilePhoto();
      profilePage.expectUserToHaveBio(DEFAULT_BIO);
      profilePage.expectUserToHaveNoInterests();
      profilePage.expectUserToHaveInterestPlaceholder(
        PLACEHOLDER_INTEREST_TEXT);
      users.logout();
    }
  );

  it('displays default photo, default bio, and no interests when logged out',
    function() {
      profilePage.get(TEST_USERNAME);
      profilePage.expectOtherUserToHaveProfilePhoto();
      profilePage.expectUserToHaveBio(DEFAULT_BIO);
      profilePage.expectUserToHaveNoInterests();
      profilePage.expectUserToHaveInterestPlaceholder(
        PLACEHOLDER_INTEREST_TEXT);
    }
  );

  afterEach(function() {
    general.checkForConsoleErrors([]);
  });
});

describe('Customized profile page for current user', function() {
  var TEST_USERNAME = 'customizedProfileFeatures';
  var TEST_EMAIL = TEST_USERNAME + '@example.com';
  var TEST_BIO = 'My test bio!';
  var TEST_INTERESTS = ['math', 'social studies'];

  var profilePage = null;

  beforeAll(function() {
    profilePage = new ProfilePage.ProfilePage();
    var preferencesPage = new PreferencesPage.PreferencesPage();
    users.createUser(TEST_EMAIL, TEST_USERNAME);
    users.login(TEST_EMAIL);
    preferencesPage.get();
    preferencesPage.setUserBio(TEST_BIO);
    preferencesPage.get();
    preferencesPage.setUserInterests(TEST_INTERESTS);
    users.logout();
  });

  it('displays photo, custom bio, and interests when logged in', function() {
    users.login(TEST_EMAIL);
    profilePage.get(TEST_USERNAME);
    profilePage.expectCurrUserToHaveProfilePhoto();
    profilePage.expectUserToHaveBio(TEST_BIO);
    profilePage.expectUserToHaveInterests(TEST_INTERESTS);
    profilePage.expectUserToNotHaveInterestPlaceholder();
    users.logout();
  });

  it('displays default photo, custom bio, and interests when logged out',
    function() {
      profilePage.get(TEST_USERNAME);
      profilePage.expectOtherUserToHaveProfilePhoto();
      profilePage.expectUserToHaveBio(TEST_BIO);
      profilePage.expectUserToHaveInterests(TEST_INTERESTS);
      profilePage.expectUserToNotHaveInterestPlaceholder();
    }
  );

  afterEach(function() {
    general.checkForConsoleErrors([]);
  });
});

describe('Visiting user profile page', function() {
  var TEST_USERNAME = 'myUser';
  var TEST_EMAIL = TEST_USERNAME + '@example.com';

  var ANOTHER_USERNAME = 'anotherUser';
  var ANOTHER_EMAIL = ANOTHER_USERNAME + '@example.com';

  var profilePage = null;
  var creatorDashboardPage = null;

  var EXPLORATION = {
    title: 'A new exploration',
    category: 'Learning',
    objective: 'The goal is to create a new exploration',
    language: 'English'
  };

  beforeAll(function() {
    profilePage = new ProfilePage.ProfilePage();
    creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage();

    users.createUser(ANOTHER_EMAIL, ANOTHER_USERNAME);
    users.login(ANOTHER_EMAIL);

    workflow.createAndPublishTwoCardExploration(
      EXPLORATION.title,
      EXPLORATION.category,
      EXPLORATION.objective,
      EXPLORATION.language
    );

    creatorDashboardPage.get();
    creatorDashboardPage.expectToHaveExplorationCard(EXPLORATION.title);
    users.logout();
  });

  it('should show the explorations created by the user', function() {
    users.createUser(TEST_EMAIL, TEST_USERNAME);
    users.login(TEST_EMAIL);

    profilePage.get(ANOTHER_USERNAME);
    profilePage.expectToHaveExplorationCards();
    profilePage.expectToHaveExplorationCardByName(EXPLORATION.title);
  });

  it('should show created exploration stats for user', function() {
    users.login(TEST_EMAIL);

    profilePage.get(ANOTHER_USERNAME);
    profilePage.expectToHaveCreatedExplorationStat('1');
  });

  afterEach(function() {
    users.logout();
    general.checkForConsoleErrors([]);
  });
});

describe('Playing the exploration', function() {
  var TEST_USERNAME = 'testUser';
  var TEST_EMAIL = TEST_USERNAME + '@example.com';

  var continueButton = element(by.css('.protractor-test-continue-button'));
  var backButton = element(by.css('.protractor-test-back-button'));
  var nextButton = element(by.css('.protractor-test-next-button'));

  var explorationPlayerPage = null;
  var libraryPage = null;

  var EXPLORATION = {
    title: 'A new exploration',
    category: 'Learning',
    objective: 'The goal is to create a new exploration',
    language: 'English'
  };

  beforeAll(function() {
    users.createUser(TEST_EMAIL, TEST_USERNAME);
    users.login(TEST_EMAIL);
  });

  it('should change the cards on clicking next and back buttons', function() {
    libraryPage = new LibraryPage.LibraryPage();
    explorationPlayerPage = new ExplorationPlayerPage.ExplorationPlayerPage();

    libraryPage.get();
    libraryPage.findExploration(EXPLORATION.title);
    libraryPage.playExploration(EXPLORATION.title);

    explorationPlayerPage.expectExplorationNameToBe(EXPLORATION.title);
    explorationPlayerPage.expectContentToMatch(forms.toRichText('card 1'));

    // Test continue button
    waitFor.elementToBeClickable(
      continueButton, 'Continue button taking too long to be clickable');
    continueButton.click();
    waitFor.pageToFullyLoad();
    explorationPlayerPage.expectContentToMatch(forms.toRichText('card 2'));

    // Test back button
    waitFor.elementToBeClickable(
      backButton, 'Back button taking too long to be clickable');
    backButton.click();
    waitFor.pageToFullyLoad();
    explorationPlayerPage.expectContentToMatch(forms.toRichText('card 1'));

    // Test next button
    waitFor.elementToBeClickable(
      nextButton, 'Next button taking too long to be clickable');
    nextButton.click();
    waitFor.pageToFullyLoad();
    explorationPlayerPage.expectContentToMatch(forms.toRichText('card 2'));
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
 * @fileoverview End-to-end tests for user management.
 */
var AdminPage = require('../protractor_utils/AdminPage.js');
var CollectionEditorPage =
  require('../protractor_utils/CollectionEditorPage.js');
var CreatorDashboardPage =
  require('../protractor_utils/CreatorDashboardPage.js');
var ExplorationEditorPage = require(
  '../protractor_utils/ExplorationEditorPage.js');
var ExplorationPlayerPage = require(
  '../protractor_utils/ExplorationPlayerPage.js');
var LibraryPage = require('../protractor_utils/LibraryPage.js');
var PreferencesPage = require('../protractor_utils/PreferencesPage.js');
var forms = require('../protractor_utils/forms.js');
var general = require('../protractor_utils/general.js');
var users = require('../protractor_utils/users.js');
var waitFor = require('../protractor_utils/waitFor.js');
var workflow = require('../protractor_utils/workflow.js');

var _selectLanguage = function(language) {
  element(by.css('.protractor-test-i18n-language-selector')).
    element(by.cssContainingText('option', language)).click();
  // Wait for the language-change request to reach the backend.
  waitFor.pageToFullyLoad();
};


describe('Basic user journeys', function() {
  describe('Account creation', function() {
    var libraryPage = null;

    beforeEach(function() {
      libraryPage = new LibraryPage.LibraryPage();
    });

    it('should create users', function() {
      users.createUser(
        'ordinaryuser@userManagement.com', 'ordinaryUserManagement');

      users.login('ordinaryuser@userManagement.com');
      libraryPage.get();
      general.checkForConsoleErrors([]);

      browser.get(general.MODERATOR_URL_SUFFIX);
      general.checkForConsoleErrors([
        'Failed to load resource: the server responded with a status of 401']);
      users.logout();
    });

    it('should create moderators', function() {
      users.createModerator(
        'mod@userManagement.com', 'moderatorUserManagement');

      users.login('mod@userManagement.com');
      browser.get(general.MODERATOR_URL_SUFFIX);
      var profileDropdown = element(
        by.css('.protractor-test-profile-dropdown'));
      waitFor.elementToBeClickable(
        profileDropdown, 'Could not click profile dropdown');
      profileDropdown.click();
      users.logout();
      general.checkForConsoleErrors([]);
    });

    // Usernames containing "admin" are not permitted.
    it('should create admins', function() {
      users.createAdmin('admin@userManagement.com', 'adm1nUserManagement');
      general.checkForConsoleErrors([]);
    });
  });
});

describe('Site language', function() {
  var adminPage = null;
  var collectionId = null;
  var creatorDashboardPage = null;
  var collectionEditorPage = null;
  var explorationEditorPage = null;
  var explorationEditorMainTab = null;
  var explorationEditorSettingsTab = null;
  var firstExplorationId = null;
  var libraryPage = null;
  var preferencesPage = null;

  beforeAll(function() {
    adminPage = new AdminPage.AdminPage();
    creatorDashboardPage = new CreatorDashboardPage.CreatorDashboardPage();
    collectionEditorPage = new CollectionEditorPage.CollectionEditorPage();
    explorationEditorPage = new ExplorationEditorPage.ExplorationEditorPage();
    explorationEditorMainTab = explorationEditorPage.getMainTab();
    explorationEditorSettingsTab = explorationEditorPage.getSettingsTab();
    libraryPage = new LibraryPage.LibraryPage();
    preferencesPage = new PreferencesPage.PreferencesPage();

    var CREATOR_USERNAME = 'langCreatorExplorations';
    var EDITOR_USERNAME = 'langCollections';

    users.createUser('lang@collections.com', EDITOR_USERNAME);
    users.createUser('langCreator@explorations.com', CREATOR_USERNAME);
    users.createAndLoginAdminUser('testlangadm@collections.com', 'testlangadm');
    adminPage.get();
    adminPage.updateRole(EDITOR_USERNAME, 'collection editor');
    users.logout();

    users.login('langCreator@explorations.com');
    workflow.createExploration();
    general.getExplorationIdFromEditor().then(function(expId) {
      firstExplorationId = expId;
      explorationEditorMainTab.setContent(forms.toRichText('Language Test'));
      explorationEditorMainTab.setInteraction('NumericInput');
      explorationEditorMainTab.addResponse(
        'NumericInput', forms.toRichText('Nice!!'),
        'END', true, 'IsLessThanOrEqualTo', 0);
      explorationEditorMainTab.getResponseEditor('default').setFeedback(
        forms.toRichText('Ok!!'));
      explorationEditorMainTab.moveToState('END');
      explorationEditorMainTab.setContent(forms.toRichText('END'));
      explorationEditorMainTab.setInteraction('EndExploration');

      // Save changes.
      var title = 'Language Test';
      var category = 'Languages';
      var objective = 'To test site language.';
      explorationEditorPage.navigateToSettingsTab();
      explorationEditorSettingsTab.setTitle(title);
      explorationEditorSettingsTab.setCategory(category);
      explorationEditorSettingsTab.setObjective(objective);
      explorationEditorPage.saveChanges('Done!');

      // Publish changes.
      workflow.publishExploration();
      users.logout();

      users.login('lang@collections.com');
      creatorDashboardPage.get();
      creatorDashboardPage.clickCreateActivityButton();
      creatorDashboardPage.clickCreateCollectionButton();
      browser.getCurrentUrl().then(function(url) {
        var pathname = url.split('/');
        // in the url a # is added at the end that is not part of collection ID
        collectionId = pathname[5].slice(0, -1);
      }, function() {
        // Note to developers:
        // Promise is returned by getCurrentUrl which is handled here.
        // No further action is needed.
      });
      // Add existing explorations.
      collectionEditorPage.addExistingExploration(firstExplorationId);
      collectionEditorPage.saveDraft();
      collectionEditorPage.closeSaveModal();
      collectionEditorPage.publishCollection();
      collectionEditorPage.setTitle('Test Collection');
      collectionEditorPage.setObjective('This is the test collection.');
      collectionEditorPage.setCategory('Algebra');
      collectionEditorPage.saveChanges();
      users.logout();
    });
  });

  beforeEach(function() {
    // Starting language is English
    browser.get('/about');
    waitFor.pageToFullyLoad();
    _selectLanguage('English');
    libraryPage.get();
    libraryPage.expectMainHeaderTextToBe(
      'Imagine what you could learn today...');
  });

  it('should change after selecting a different language', function() {
    browser.get('/about');
    waitFor.pageToFullyLoad();
    _selectLanguage('Español');

    libraryPage.get();
    libraryPage.expectMainHeaderTextToBe(
      'Imagina lo que podrías aprender hoy...');
    general.ensurePageHasNoTranslationIds();
  });

  it('should use language selected in the Preferences page.', function() {
    users.createUser('varda@example.com', 'Varda');
    users.login('varda@example.com');
    preferencesPage.get();
    preferencesPage.selectSystemLanguage('Español');
    preferencesPage.expectPageHeaderToBe('Preferencias');
    general.ensurePageHasNoTranslationIds();
    users.logout();
  });

  it('should set preferred audio language selected in the Preferences page.',
    function() {
      users.createUser('audioPlayer@example.com', 'audioPlayer');
      users.login('audioPlayer@example.com');
      preferencesPage.get();
      preferencesPage.expectPreferredAudioLanguageNotToBe('Chinese');
      preferencesPage.selectPreferredAudioLanguage('Chinese');
      // TODO(DubeySandeep): Add the test to check preferred audio language
      // choice gets reflected to the exploration player. This can be done once
      // we will finalize a way to upload an audio file in e2e test.
      preferencesPage.expectPreferredAudioLanguageToBe('Chinese');
      general.ensurePageHasNoTranslationIds();
      users.logout();
    });

  it('should save the language selected in the footer into the preferences.',
    function() {
      users.createUser('feanor@example.com', 'Feanor');
      users.login('feanor@example.com');
      browser.get('/about');
      waitFor.pageToFullyLoad();
      _selectLanguage('Español');
      libraryPage.get();
      libraryPage.expectMainHeaderTextToBe(
        'Imagina lo que podrías aprender hoy...');

      // The preference page shows the last selected language
      preferencesPage.get();
      preferencesPage.expectPreferredSiteLanguageToBe('Español');
      general.ensurePageHasNoTranslationIds();
      users.logout();
    }
  );

  it('should not change in an exploration', function() {
    users.login('langCreator@explorations.com', true);
    browser.get('/about');
    waitFor.pageToFullyLoad();
    _selectLanguage('Español');

    general.openEditor(firstExplorationId);

    // Spanish is still selected.
    var placeholder = element(by.css('.protractor-test-float-form-input'))
      .getAttribute('placeholder');
    expect(placeholder).toEqual('Ingresa un número');
    general.ensurePageHasNoTranslationIds();
    users.logout();
  });

  it('should not change in exploration and collection player for guest users',
    function() {
      browser.get('/about');
      waitFor.pageToFullyLoad();
      _selectLanguage('Español');

      // Checking collection player page.
      browser.get('/collection/' + collectionId);
      waitFor.pageToFullyLoad();
      expect(element(by.css('.oppia-share-collection-footer')).getText())
        .toEqual('COMPARTIR ESTA COLECCIÓN');
      general.ensurePageHasNoTranslationIds();

      // Checking exploration player page.
      browser.get('/explore/' + firstExplorationId);
      waitFor.pageToFullyLoad();
      expect(element(by.css('.author-profile-text')).getText())
        .toEqual('PERFILES DE AUTORES');
      general.ensurePageHasNoTranslationIds();
    }
  );

  afterEach(function() {
    // Reset language back to English
    browser.get('/about');
    waitFor.pageToFullyLoad();
    _selectLanguage('English');
    general.checkForConsoleErrors([]);
  });
});
