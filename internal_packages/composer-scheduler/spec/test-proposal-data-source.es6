import ProposedTimeCalendarStore from '../lib/proposed-time-calendar-store'
import {CalendarDataSource} from 'nylas-exports'

export default class TestProposalDataSource extends CalendarDataSource {
  buildObservable({startTime, endTime}) {
    this.endTime = endTime
    this.startTime = startTime
    return this
  }

  manuallyTrigger() {
    this.onNext({events: ProposedTimeCalendarStore.proposalsAsEvents()})
  }

  subscribe(onNext) {
    this.onNext = onNext
    this.manuallyTrigger()
    const dispose = jasmine.createSpy("dispose")
    return {dispose}
  }
}
