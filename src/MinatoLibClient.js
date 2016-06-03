import Spooky from 'spooky';
import {EventEmitter} from 'events';
import cheerio from 'cheerio';

let _books = [];

class MinatoLibClient extends EventEmitter {
  getLoanedBooks() {
    return _books;
  }
}
/* test */
const client = new MinatoLibClient();

var options = {
  child: {
    transport: 'http'
  }
};
var spooky = new Spooky(options, function(err) {
  var url = 'https://www.lib.city.minato.tokyo.jp/licsxp-opac/WOpacTifSchCmpdExecAction.do?tifschcmpd=1';
  spooky.start(url);

  spooky.then(function() {
    this.click('#login');
    this.waitForSelector('form[name="LBForm"]');
  });

  spooky.then(function() {
    account = {
      username: '0095510665',
      j_password: 'lib8848'
    };
    this.fill('form[name="LBForm"]', account, false);
    this.click('.exec');
    this.waitForSelector('a#logout');
  });

  spooky.then(function() {
    this.click('#stat-lent');
    this.waitForSelector('table.list');
  });

  spooky.then(function() {
    this.emit('body', this.getHTML());
  });

  spooky.run();
});

// spooky.on('console', function(msg) {
//   console.log(msg);
// });
spooky.on('error', function(msg) {
  console.log(msg);
});

spooky.on('p', function(msg) {
  console.log(msg);
});
spooky.on('body', function(body) {
  var $ = cheerio.load(body);
  var books = [];
  $('.list tbody tr').each(function(i, tr) {
    var book = {
      title: $('td', tr).eq(0).text().trim(),
      returnDate: $('td', tr).eq(4).text().trim().replace(/\//g, '-')
    };
    books.push(book);
  });

  _books = books;
  client.emit('ready');

});

export default client;
