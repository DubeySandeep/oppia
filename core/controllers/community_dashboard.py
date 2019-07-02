# Copyright 2014 The Oppia Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS-IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Controllers for the community dashboard page."""

from core.controllers import acl_decorators
from core.controllers import base
from core.domain import opportunity_services
import feconf


class CommunityDashboardPage(base.BaseHandler):
    """Page showing the community dashboard."""

    @acl_decorators.open_access
    def get(self):
        if not feconf.COMMUNITY_DASHBOARD_ENABLED:
            raise self.PageNotFoundException
        self.render_template('dist/community-dashboard-page.mainpage.html')


class ContributionOpportunitiesHandler(base.BaseHandler):
    """Provides data for opportunities available in different category."""

    GET_HANDLER_ERROR_RETURN_TYPE = feconf.HANDLER_TYPE_JSON

    @acl_decorators.open_access
    def get(self, opportunity_type):
        """Handles GET requests."""
        if not feconf.COMMUNITY_DASHBOARD_ENABLED:
            raise self.PageNotFoundException
        language_code = self.request.get('language_code')
        search_cursor = self.request.get('cursor', None)
        if opportunity_type == 'translation':
            results, cursor, more = (
                opportunity_services.get_translation_opportunities(
                    language_code, search_cursor))

        if opportunity_type == 'voiceover':
            results, cursor, more = (
                opportunity_services.get_voiceover_opportunities(
                    language_code, search_cursor))

        self.values = {
            'opportunities': results,
            'next_cursor': cursor,
            'more': more
        }

        self.render_json(self.values)
