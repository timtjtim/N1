import ProposedTimeCalendarStore from '../lib/proposed-time-calendar-store'
import {CalendarDataSource} from 'nylas-exports'

export default class TestProposalDataSource extends CalendarDataSource {
  buildObservable({startTime, endTime}) {
    this.endTime = endTime
    this.startTime = startTime
    return this
  }

  _testProposalsAsEvents() {
    return ProposedTimeCalendarStore.proposalsAsEvents()
  }

  subscribe(onNext) {
    onNext({events: this._testProposalsAsEvents()});
    const dispose = jasmine.createSpy("dispose")
    return {dispose}
  }
}
