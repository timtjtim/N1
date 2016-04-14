import moment from 'moment-timezone'

export const TZ = "America/Los_Angeles";
export const TEST_CALENDAR = "TEST_CALENDAR";
export const now = () => moment.tz("2016-03-15 12:00", TZ)
