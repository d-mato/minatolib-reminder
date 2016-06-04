import MinatoLibClient from './MinatoLibClient';
import GCalendarRegister from './GCalendarRegister';
import RemindMailer from './RemindMailer';
import {EventEmitter} from 'events';

const execute = () => {
  let books = MinatoLibClient.getLoanedBooks();
  books.forEach( (book) => {
    let type = '[返却日]';
    let summary = `${type} ${book.title}`;

    // 同じsummaryの予定を削除
    GCalendarRegister.clean(summary);

    GCalendarRegister.set({
      summary,
      date: book.returnDate,
    });
  });
};

let eventCount = 0;
GCalendarRegister.on('ready', () => {
  console.log("GCalendarRegister: ready");
  if (++eventCount === 2) execute();
});

MinatoLibClient.on('ready', () => {
  console.log("MinatoLibClient: ready");
  if (++eventCount === 2) execute();
});
