import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import ProposedTimePicker from '../lib/calendar/proposed-time-picker'
import TestProposalDataSource from './test-proposal-data-source'
import WeekView from '../../../src/components/nylas-calendar/week-view'

import {activate} from '../lib/main'

fdescribe("ProposedTimePicker", () => {
  beforeEach(() => {
    spyOn(NylasEnv, "getWindowType").andReturn("calendar");
    activate()

    const testSrc = new TestProposalDataSource()
    spyOn(ProposedTimePicker.prototype, "_dataSource").andReturn(testSrc)
    this.picker = ReactTestUtils.renderIntoDocument(
      <ProposedTimePicker />
    )
  });

  it("renders a proposed time picker in week view", () => {
    const picker = ReactTestUtils.findRenderedComponentWithType(this.picker, ProposedTimePicker);
    const weekView = ReactTestUtils.findRenderedComponentWithType(this.picker, WeekView);
    expect(picker instanceof ProposedTimePicker).toBe(true);
    expect(weekView instanceof WeekView).toBe(true);
  });

  it("creates a proposal on click", () => {
    
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
