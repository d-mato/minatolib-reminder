import MinatoLibClient from './MinatoLibClient';
import GCalendarRegister from './GCalendarRegister';
import RemindMailer from './RemindMailer';

MinatoLibClient.on('ready', function() {

  var books = this.getLoanedBooks();
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
