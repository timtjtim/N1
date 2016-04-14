import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import {now} from './test-utils'
import TestDataSource from './test-data-source'
import {NylasCalendar} from 'nylas-component-kit'

import WeekView from '../../../src/components/nylas-calendar/week-view'

fdescribe("Nylas Calendar Week View", () => {
  beforeEach(() => {
    spyOn(WeekView.prototype, "_now").andReturn(now())

    this.dataSource = new TestDataSource();
    this.calendar = ReactTestUtils.renderIntoDocument(
      <NylasCalendar
        currentMoment={now()}
        dataSource={this.dataSource}
      />
    );
    this.weekView = ReactTestUtils.findRenderedComponentWithType(this.calendar, WeekView);
  });

  it("renders a calendar", () => {
    expect(ReactTestUtils.findRenderedComponentWithType(this.calendar, NylasCalendar) instanceof NylasCalendar).toBe(true)
  });

  it("sets the correct moment", () => {
    expect(this.calendar.state.currentMoment.valueOf()).toBe(now().valueOf())
  });

  it("defaulted to WeekView", () => {
    expect(this.calendar.state.currentView).toBe("week");
    expect(this.weekView instanceof WeekView).toBe(true);
  });
});
