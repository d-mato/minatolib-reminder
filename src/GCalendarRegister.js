import {EventEmitter} from 'events';
import gcal from 'google-calendar';
import APIClient from './APIClient';

const calendarId = 'telnetstat@gmail.com';
const allEvents = [];
const wait = 1000;
let SerialQ = Promise.resolve();
let google_calendar;

const _delete = function(eventId) {
  return new Promise((resolve) => {
    google_calendar.events.delete(calendarId, eventId, (err) => {
      console.log('REMOVE', eventId);
      setTimeout(resolve, wait);
    });
  });
};

const _insert = function(event) {
  return new Promise((resolve) => {
    google_calendar.events.insert(calendarId, event, (err, res) => {
      if (err) {
        console.log(err);
        process.exit();
      }
      console.log('SET', event.summary);
      setTimeout(resolve, wait);
    });
  });
};

class GCalendarRegister extends EventEmitter {
  constructor() {
    super();
    APIClient.on('ready', (access_token) => {
      google_calendar = new gcal.GoogleCalendar(access_token);

      let date = new Date();
      date.setDate(date.getDate() - 7);
      let options = {
        singleEvents: true,
        orderBy: 'startTime',
        timeMin: date.toISOString(),
      };
      google_calendar.events.list(calendarId, options, (err, res) => {
        if (err) {
          console.log(err);
          process.exit();
        }
        allEvents.push(...res.items);
        console.log(`Events count: ${res.items.length}`);
        this.emit('ready');
      });
    });
  }

  clean(summary) {
    allEvents.forEach((item) => {
      if (item.summary == summary) {
        SerialQ = SerialQ.then(_delete.bind(null, item.id));
      }
    });
  }

  set({summary, date}) {
    let event = {
      summary,
      start: {date},
      end: {date},
    };
    SerialQ = SerialQ.then(_insert.bind(null, event));
  }

}

export default new GCalendarRegister();
