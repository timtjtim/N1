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

    this.testSrc = new TestProposalDataSource()
    spyOn(ProposedTimePicker.prototype, "_dataSource").andReturn(this.testSrc)
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

    // It's not an availability block but a full blown proposal
    expect($("availability").length).toBe(0);
  });

  it("creates the time picker for the correct timespan", () => {
    const $ = _.partial(ReactTestUtils.scryRenderedDOMComponentsWithClass, this.picker);
    const title = $("title");
    expect(ReactDOM.findDOMNode(title[0]).innerHTML).toBe("March 13 - March 19 2016");
  });

  it("creates a block of proposals on drag down", () => {
    this.picker._onCalendarMouseDown({
      time: now(),
      currentView: NylasCalendar.WEEK_VIEW,
    })
    this.picker._onCalendarMouseMove({
      time: now().add(30, 'minutes'),
      mouseIsDown: true,
      currentView: NylasCalendar.WEEK_VIEW,
    })
    this.picker._onCalendarMouseMove({
      time: now().add(60, 'minutes'),
      mouseIsDown: true,
      currentView: NylasCalendar.WEEK_VIEW,
    })
    const $ = _.partial(ReactTestUtils.scryRenderedDOMComponentsWithClass, this.picker);

    // Ensure that we don't see any proposals
    expect(ProposedTimeCalendarStore.proposals().length).toBe(0)
    let proposalEls = $("proposal");
    expect(proposalEls.length).toBe(0);

    // But we DO see the drag block event
    expect(ProposedTimeCalendarStore.proposalsAsEvents().length).toBe(1)
    let events = $("calendar-event");
    expect($("availability").length).toBe(1);
    expect(events.length).toBe(1);

    this.picker._onCalendarMouseUp({
      time: now().add(90, 'minutes'),
      currentView: NylasCalendar.WEEK_VIEW,
    })

    // Now that we've moused up, this should convert them into proposals
    const proposals = ProposedTimeCalendarStore.proposals()
    expect(proposals.length).toBe(3)
    expect(ProposedTimeCalendarStore.proposalsAsEvents().length).toBe(3)
    proposalEls = $("proposal");
    events = $("calendar-event");
    expect(events.length).toBe(3);
    expect(proposalEls.length).toBe(3);

    const times = proposals.map((p) =>
      [p.start, p.end]
    );

    expect(times).toEqual([
      [now().unix(), now().add(30, 'minutes').unix() - 1],
      [now().add(30, 'minutes').unix(),
       now().add(60, 'minutes').unix() - 1],
      [now().add(60, 'minutes').unix(),
       now().add(90, 'minutes').unix() - 1],
    ]);
  });

  it("creates a block of proposals on drag up", () => {
    this.picker._onCalendarMouseDown({
      time: now(),
      currentView: NylasCalendar.WEEK_VIEW,
    })
    this.picker._onCalendarMouseMove({
      time: now().subtract(30, 'minutes'),
      mouseIsDown: true,
      currentView: NylasCalendar.WEEK_VIEW,
    })
    this.picker._onCalendarMouseMove({
      time: now().subtract(60, 'minutes'),
      mouseIsDown: true,
      currentView: NylasCalendar.WEEK_VIEW,
    })
    this.picker._onCalendarMouseUp({
      time: now().subtract(90, 'minutes'),
      currentView: NylasCalendar.WEEK_VIEW,
    })

    // Now that we've moused up, this should convert them into proposals
    const proposals = ProposedTimeCalendarStore.proposals()
    const times = proposals.map((p) =>
      [p.start, p.end]
    );

    expect(times).toEqual([
      [now().subtract(90, 'minutes').unix(),
       now().subtract(60, 'minutes').unix() - 1],
      [now().subtract(60, 'minutes').unix(),
       now().subtract(30, 'minutes').unix() - 1],
      [now().subtract(30, 'minutes').unix(),
       now().unix() - 1],
    ]);
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
