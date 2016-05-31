import MinatolibClient from './minatolib-client';
import GCalendarRegister from './gcalendar-register';

var books = MinatolibClient.getLoanedBooks();
books.forEach( (book) => {
  GCalendarRegister.set({
    scheduleTitle: `${book.title}`,
    date: book.returnDate,
  });
});

