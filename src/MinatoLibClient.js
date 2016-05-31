class MinatoLibClient {
  getLoanedBooks() {
    let books = [];
    books.push({title: 'Book001', returnDate: '2016/5/31'});
    books.push({title: 'Book002', returnDate: '2016/6/2'});

    return books;
  }
}

export default new MinatoLibClient();
