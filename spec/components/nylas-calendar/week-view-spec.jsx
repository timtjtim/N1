import moment from 'moment'
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import {
  now,
  NOW_WEEK_START,
  NOW_BUFFER_START,
  NOW_BUFFER_END,
} from './test-utils'
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

  it("initializes the component", () => {
    expect(this.weekView.todayYear).toBe(now().year());
    expect(this.weekView.todayDayOfYear).toBe(now().dayOfYear());
  });

  it("initializes the data source & state with the correct times", () => {
    expect(this.dataSource.startTime).toBe(NOW_BUFFER_START.unix());
    expect(this.dataSource.endTime).toBe(NOW_BUFFER_END.unix());
    expect(this.weekView.state.startMoment.unix()).toBe(NOW_BUFFER_START.unix());
    expect(this.weekView.state.endMoment.unix()).toBe(NOW_BUFFER_END.unix());
    expect(this.weekView._scrollTime).toBe(NOW_WEEK_START.unix())
  });

  it("has the correct days in buffer", () => {
    const days = this.weekView._daysInView();
    expect(days.length).toBe(21);
    expect(days[0].dayOfYear()).toBe(66)
    expect(days[days.length - 1].dayOfYear()).toBe(86)
  });

  it("shows the correct current week", () => {
    expect(this.weekView._currentWeekText()).toBe("March 13 - March 19 2016")
  });

  it("goes to next week on click", () => {
    const nextBtn = this.weekView.refs.headerControls.refs.onNextAction
    expect(this.weekView.state.startMoment.unix()).toBe(NOW_BUFFER_START.unix());
    expect(this.weekView._scrollTime).toBe(NOW_WEEK_START.unix())

    ReactTestUtils.Simulate.click(nextBtn);

    expect((this.weekView.state.startMoment).unix())
      .toBe(moment(NOW_BUFFER_START).add(1, 'week').unix());

    expect(this.weekView._scrollTime)
      .toBe(moment(NOW_WEEK_START).add(1, 'week').unix());
  });

  it("goes to the previous week on click", () => {
    const prevBtn = this.weekView.refs.headerControls.refs.onPreviousAction
    expect(this.weekView.state.startMoment.unix()).toBe(NOW_BUFFER_START.unix());
    expect(this.weekView._scrollTime).toBe(NOW_WEEK_START.unix())

    ReactTestUtils.Simulate.click(prevBtn);

    expect((this.weekView.state.startMoment).unix())
      .toBe(moment(NOW_BUFFER_START).subtract(1, 'week').unix());

    expect(this.weekView._scrollTime)
      .toBe(moment(NOW_WEEK_START).subtract(1, 'week').unix());
  });

  it("goes to 'today' when the 'today' btn is pressed", () => {
    const todayBtn = this.weekView.refs.todayBtn;
    const nextBtn = this.weekView.refs.headerControls.refs.onNextAction
    ReactTestUtils.Simulate.click(nextBtn);
    ReactTestUtils.Simulate.click(todayBtn)

    expect(this.weekView.state.startMoment.unix()).toBe(NOW_BUFFER_START.unix());
    expect(this.weekView._scrollTime).toBe(NOW_WEEK_START.unix())
  });
});
