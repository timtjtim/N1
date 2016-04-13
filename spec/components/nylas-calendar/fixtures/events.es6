import {Event} from 'nylas-exports'
import moment from 'moment'

// All day
// All day overlap
//
// Simple single event
// Event that spans a day
// Overlapping events

let gen = 0

export const TEST_CALENDAR = "TEST_CALENDAR";

const genEvent = ({start, end, object = "timespan"}) => {
  gen += 1;

  let when = {}
  if (object === "timespan") {
    when = {
      object: "timespan",
      end_time: moment(end).unix(),
      start_time: moment(start).unix(),
    }
  }
  if (object === "datespan") {
    when = {
      object: "datespan",
      end_date: end,
      start_date: start,
    }
  }

  return new Event().fromJSON({
    id: `server-${gen}`,
    calendar_id: TEST_CALENDAR,
    account_id: window.TEST_ACCOUNT_ID,
    description: `description ${gen}`,
    location: `location ${gen}`,
    owner: `${window._TEST_ACCOUNT_NAME} <${window.TEST_ACCOUNT_EMAIL}>`,
    participants: [{
      email: window.TEST_ACCOUNT_EMAIL,
      name: window.TEST_ACCOUNT_NAME,
      status: "yes",
    }],
    read_only: "false",
    title: `Title ${gen}`,
    busy: true,
    when,
    status: "confirmed",
  })
}

// NOTE:
// DST Started 2016-03-13 01:59 and immediately jumps to 03:00
// DST Ended 2016-11-06 01:59 and immediately jumps to 03:00

export const events = [
  genEvent({start: "2016-01-01 ", end: ""})
]
