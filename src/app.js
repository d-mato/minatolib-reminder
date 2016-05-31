import MinatoLibClient from './MinatoLibClient';
import GCalendarRegister from './GCalendarRegister';
import RemindMailer from './RemindMailer';

MinatoLibClient.on('ready', function() {

  var books = this.getLoanedBooks();
  books.forEach( (book) => {
    GCalendarRegister.set({
      scheduleTitle: `${book.title}`,
      date: book.returnDate,
    });
  });

});
