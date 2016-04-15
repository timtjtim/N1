import NewEventCardContainer from '../lib/composer/new-event-card-container'
import NewEventCard from '../lib/composer/new-event-card'
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils';
import {PLUGIN_ID} from '../lib/scheduler-constants'

import {
  DatabaseStore,
  DraftStore,
  Message,
  Contact,
  Event,
} from 'nylas-exports'

import {activate, deactivate} from '../lib/main'

const DRAFT_CLIENT_ID = "draft-client-id"

fdescribe("NewEventCard", () => {
  beforeEach(() => {
    spyOn(NylasEnv, "isMainWindow").andReturn(true);
    spyOn(NylasEnv, "getWindowType").andReturn("root");
    activate()

    this.draft = new Message({
      clientId: DRAFT_CLIENT_ID,
      draft: true,
      body: "",
      accountId: window.TEST_ACCOUNT_ID,
      from: [new Contact({email: window.TEST_ACCOUNT_EMAIL})],
    })

    spyOn(DatabaseStore, 'run').andReturn(Promise.resolve(this.draft));

    this.session = null;
    runs(() => {
      DraftStore.sessionForClientId(DRAFT_CLIENT_ID).then((session) => {
        this.session = session
      });
      this.eventCardContainer = ReactTestUtils.renderIntoDocument(
        <NewEventCardContainer draftClientId={DRAFT_CLIENT_ID} />
      );
    })
    waitsFor(() => this.eventCardContainer._session && this.session);
  });

  afterEach(() => {
    DraftStore._cleanupAllSessions()
    deactivate()
  })

  const stubCalendars = (calendars = []) => {
    spyOn(NewEventCard.prototype, "_loadCalendarsForEmail").andCallFake(function onCalendars() {
      // `this` needs to be component itself.
      this.setState({calendars})
    })
  }

  const setNewTestEvent = (callback) => {
    runs(() => {
      if (!this.session) {
        throw new Error("Setup test session first")
      }
      const metadata = {}
      metadata.uid = DRAFT_CLIENT_ID;
      metadata.pendingEvent = new Event({
        calendarId: "TEST_CALENDAR_ID",
        start: window.testNowMoment().unix(),
        end: window.testNowMoment().add(1, 'hour').unix(),
      }).toJSON();
      this.session.changes.addPluginMetadata(PLUGIN_ID, metadata);
    })

    waitsFor(() => this.eventCardContainer.state.event);

    runs(callback)
  }

  it("Creates a new event card", () => {
    const el = ReactTestUtils.findRenderedComponentWithType(this.eventCardContainer,
        NewEventCardContainer);
    expect(el instanceof NewEventCardContainer).toBe(true)
  });

  it("Doesn't render if there's no event on metadata", () => {
    expect(this.eventCardContainer.refs.newEventCard).not.toBeDefined();
  });

  it("Renders the event card when an event is created", () => {
    stubCalendars()
    setNewTestEvent(() => {
      expect(this.eventCardContainer.refs.newEventCard).toBeDefined();
      expect(this.eventCardContainer.refs.newEventCard instanceof NewEventCard).toBe(true);
    })
  });

  it("Loads the calendars for email", () => {
  });

  it("removes the event and clears metadata", () => {
  });

  it("properly updates the event", () => {
  });

  it("updates the day", () => {
  });

  it("updates the time properly", () => {
  });

  it("adjusts the times to prevent invalid times", () => {
  });
});
