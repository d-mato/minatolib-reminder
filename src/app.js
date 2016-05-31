import MinatoLibClient from './MinatoLibClient';
import GCalendarRegister from './GCalendarRegister';
import RemindMailer from './RemindMailer';

var books = MinatoLibClient.getLoanedBooks();
books.forEach( (book) => {
  GCalendarRegister.set({
    scheduleTitle: `${book.title}`,
    date: book.returnDate,
  });
});

