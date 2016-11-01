import MinatoLibClient from '../v2';
import GCalendarRegister from './GCalendarRegister';
import RemindMailer from './RemindMailer';

const readyGCalendarRegister = new Promise((resolve) => {
  GCalendarRegister.on('ready', () => {
    console.log("GCalendarRegister: ready");
    resolve();
  });
});

const readyMinatoLibClient = new Promise((resolve) => {
  MinatoLibClient.on('ready', () => {
    console.log("MinatoLibClient: ready");
    resolve();
  });
});

Promise.all([readyGCalendarRegister, readyMinatoLibClient]).then(() => {
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
});
