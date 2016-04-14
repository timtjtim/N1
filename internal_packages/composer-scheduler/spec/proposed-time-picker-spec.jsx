import _ from 'underscore'
import React from 'react'
import ReactDOM from 'react-dom'
import ReactTestUtils from 'react-addons-test-utils'
import ProposedTimePicker from '../lib/calendar/proposed-time-picker'
import TestProposalDataSource from './test-proposal-data-source'
import WeekView from '../../../src/components/nylas-calendar/week-view'
import ProposedTimeCalendarStore from '../lib/proposed-time-calendar-store'

import {NylasCalendar} from 'nylas-component-kit'

import {activate, deactivate} from '../lib/main'

import {
  now,
} from '../../../spec/components/nylas-calendar/test-utils'

/**
 * This tests the ProposedTimePicker as an integration test of the picker,
 * associated calendar object, the ProposedTimeCalendarStore, and stubbed
 * ProposedTimeCalendarDataSource
 *
 */
fdescribe("ProposedTimePicker", () => {
  beforeEach(() => {
    spyOn(NylasEnv, "getWindowType").andReturn("calendar");
    spyOn(WeekView.prototype, "_now").andReturn(now());
    spyOn(NylasCalendar.prototype, "_now").andReturn(now());
    activate()

    const testSrc = new TestProposalDataSource()
    spyOn(ProposedTimePicker.prototype, "_dataSource").andReturn(testSrc)
    this.picker = ReactTestUtils.renderIntoDocument(
      <ProposedTimePicker />
    )
    this.weekView = ReactTestUtils.findRenderedComponentWithType(this.picker, WeekView);
  });

  afterEach(() => {
    deactivate()
  })

  it("renders a proposed time picker in week view", () => {
    const picker = ReactTestUtils.findRenderedComponentWithType(this.picker, ProposedTimePicker);
    const weekView = ReactTestUtils.findRenderedComponentWithType(this.picker, WeekView);
    expect(picker instanceof ProposedTimePicker).toBe(true);
    expect(weekView instanceof WeekView).toBe(true);
  });

  // NOTE: We manually fire the SchedulerActions since we've tested the
  // mouse click to time conversion in the nylas-calendar

  it("creates a proposal on click", () => {
    this.picker._onCalendarMouseDown({
      time: now(),
      currentView: NylasCalendar.WEEK_VIEW,
    })
    this.picker._onCalendarMouseUp({
      time: now(),
      currentView: NylasCalendar.WEEK_VIEW,
    })
    const $ = _.partial(ReactTestUtils.scryRenderedDOMComponentsWithClass, this.picker);
    expect(ProposedTimeCalendarStore.proposals().length).toBe(1)
    expect(ProposedTimeCalendarStore.proposalsAsEvents().length).toBe(1)
    const proposals = $("proposal");
    const events = $("calendar-event");
    expect(events.length).toBe(1);
    expect(proposals.length).toBe(1);
  });

  it("creates the time picker for the correct timespan", () => {
    const $ = _.partial(ReactTestUtils.scryRenderedDOMComponentsWithClass, this.picker);
    const title = $("title");
    expect(ReactDOM.findDOMNode(title[0]).innerHTML).toBe("March 13 - March 19 2016");
  });

  it("creates a block of proposals on drag down", () => {
  });

  it("creates a block of proposals on drag up", () => {
  });

  it("removes proposals when clicked on", () => {
  });

  it("can clear all of the proposals", () => {
  });

  it("can change the duration", () => {
  });

  it("creates a block of proposals with a longer duration", () => {
  });
});
