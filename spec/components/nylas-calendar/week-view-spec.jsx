import React from 'react'
import ReactTestUtils from 'react-addons-test-utils'
import {now} from './test-utils'
import TestDataSource from './test-data-source'
import {NylasCalendar} from 'nylas-component-kit'

fdescribe("Nylas Calendar Week View", () => {
  beforeEach(() => {
    this.dataSource = new TestDataSource();
    this.calendar = ReactTestUtils.renderIntoDocument(
      <NylasCalendar
        currentMoment={now()}
        dataSource={this.dataSource}
      />
    );
  });

  it("renders a calendar", () => {
    ReactTestUtils.isElementOfType(this.calendar, NylasCalendar)
  });
});
