import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'

import SchedulerComposerButton from '../lib/composer/scheduler-composer-button'

import {
  DRAFT_CLIENT_ID,
  prepareDraft,
  cleanupDraft,
} from './composer-scheduler-spec-helper'

describe("SchedulerComposerButton", () => {
  beforeEach(() => {
    this.session = null
    // Will eventually fill this.session
    prepareDraft.call(this)

    runs(() => {
      this.eventCardContainer = ReactTestUtils.renderIntoDocument(
        <SchedulerComposerButton draftClientId={DRAFT_CLIENT_ID} />
      );
    })

    waitsFor(() => this.eventCardContainer._session)
  });

  afterEach(() => {
    cleanupDraft()
  })

  it("loads the draft and renders the button", () => {
    const el = ReactTestUtils.findRenderedComponentWithType(this.eventCardContainer,
        SchedulerComposerButton);
    expect(el instanceof SchedulerComposerButton).toBe(true)
  });

  // More tests TODO
});
