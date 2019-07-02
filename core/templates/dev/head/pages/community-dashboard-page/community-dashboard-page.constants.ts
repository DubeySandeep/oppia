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
 * @fileoverview Constants for the creator dashboard.
 */

oppia.constant(
  'COMMUNITY_DASHBOARD_TABS_DETAILS', {
    myContributionTab: {
      ariaLabel: 'Check your contributions.',
      tabName: 'My contribution',
      description: '',
    },
    questionTab: {
      ariaLabel: 'See opportunities for adding new question.',
      tabName: 'Submit Question',
      description: 'Provide question in a topic of your choice for ' +
        'students to answer.',
      customizationOptions: ['sort']
    },
    translationTab: {
      ariaLabel: 'See opportunities for translation.',
      tabName: 'Translate Text',
      description: 'Translate the text in the lessons to break the ' +
        'language barrier for non-English speaker.',
      customizationOptions: ['language', 'sort']
    },
    voiceoverTab: {
      ariaLabel: 'See opportunities for voiceover.',
      tabName: 'Voiceover',
      description: 'Create voiceover in a language of your own choice ' +
        'to give user a full experience.',
      customizationOptions: ['language', 'sort']
    },
    artTab: {
      ariaLabel: 'See opportunities for art.',
      tabName: 'Submit art',
      description: 'Design digital art that makes the lessons even ' +
        'more engaging.',
      customizationOptions: ['sort']
    }
  }
);

oppia.constant('DEFAULT_OPPORTUNITY_LANGUAGE_CODE', 'hi');

oppia.constant(
  'TRANSLATION_OPPORTUNITIES_SUMMARY_URL',
  '/opportunitiessummaryhandler/translation?language_code=<language_code>&' +
  'cursor=<cursor>');
oppia.constant(
  'VOICEOVER_OPPORTUNITIES_SUMMARY_URL',
  '/opportunitiessummaryhandler/voiceover?language_code=<language_code>&' +
  'cursor=<cursor>');
