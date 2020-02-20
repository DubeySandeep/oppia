// Copyright 2017 The Oppia Authors. All Rights Reserved.
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
 * @fileoverview Utility service for checking web browser type.
 */

import { downgradeInjectable } from '@angular/upgrade/static';
import { Injectable } from '@angular/core';
import { WindowRef } from
  'services/contextual/window-ref.service';

const CONSTANTS = require('constants.ts');

@Injectable({
  providedIn: 'root'
})
export class BrowserCheckerService {
  constructor(private windowRef: WindowRef) {}

  private _supportsSpeechSynthesis(): boolean {
    if (this.windowRef.nativeWindow.hasOwnProperty('speechSynthesis')) {
      return speechSynthesis.getVoices().some((voice: SpeechSynthesisVoice) => {
        return CONSTANTS.AUTOGENERATED_AUDIO_LANGUAGES.some(
          (audioLanguage: any) => {
            if (voice.lang === audioLanguage.speech_synthesis_code ||
              (this._isMobileDevice() &&
              voice.lang === audioLanguage.speech_synthesis_code_mobile)) {
              return true;
            }
          });
      });
    }
    return false;
  }

  private _isMobileDevice(): boolean {
    var userAgent = navigator.userAgent || this.windowRef.nativeWindow.opera;
    return userAgent.match(/iPhone/i) || userAgent.match(/Android/i);
  }

  supportsSpeechSynthesis(): boolean {
    return this._supportsSpeechSynthesis();
  }
  isMobileDevice(): boolean {
    return this._isMobileDevice();
  }
}

angular.module('oppia').factory(
  'BrowserCheckerService', downgradeInjectable(BrowserCheckerService));
