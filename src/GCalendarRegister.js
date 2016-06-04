import {EventEmitter} from 'events';
import gcal from 'google-calendar';
import APIClient from './APIClient';

const calendarId = 'telnetstat@gmail.com';
const allEvents = [];

class GCalendarRegister extends EventEmitter {
  constructor() {
    super();
    APIClient.on('ready', (access_token) => {
      this.google_calendar = new gcal.GoogleCalendar(access_token);

      this.google_calendar.events.list(calendarId, (err, res) => {
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
        this.google_calendar.events.delete(calendarId, item.id, () => {
          console.log('REMOVE', item.id);
        });
      }
    });
  }

  set({summary, date}) {
    let event = {
      summary,
      start: {date},
      end: {date},
    };
    this.google_calendar.events.insert(calendarId, event, (err, res) => {
      if (err) {
        console.log(err);
        process.exit();
      }
      console.log('SET', summary);
    });
  }
}

export default new GCalendarRegister();
