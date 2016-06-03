import fs from 'fs';
import gcal from 'google-calendar';

const accessToken = JSON.parse(fs.readFileSync('token.json', 'utf-8')).access_token;
const google_calendar = new gcal.GoogleCalendar(accessToken);
const calendarId = 'telnetstat@gmail.com';

const allEvents = [];
google_calendar.events.list(calendarId, (err, res) => {
  if (err) {
    console.log(err);
    return;
  }
  allEvents.push(...res.items);
  console.log(`Events count: ${res.items.length}`);
});

class GCalendarRegister {
  clean(summary) {
    allEvents.forEach(function(item) {
      if (item.summary == summary) {
        console.log('REMOVE', item.id);
        google_calendar.events.delete(calendarId, item.id, () => {});
      }
    });
  }

  set({summary, date}) {
    let event = {
      summary,
      start: {date},
      end: {date},
    };
    google_calendar.events.insert(calendarId, event, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(res);
    });
  }
}

export default new GCalendarRegister();
