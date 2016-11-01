const EventEmitter = require('events').EventEmitter
const request = require('request').defaults({jar: true})
const cheerio = require('cheerio')

var _books = []

class MinatoLibClient2 extends EventEmitter {
  login() {
    let url_init = 'https://www.lib.city.minato.tokyo.jp/licsxp-opac/WOpacMnuTopInitAction.do'
    return new Promise((resolve, reject) => {
      request(url_init, (err, res) => {
        let formData = {
          j_username: '00000000000000000095510665',
          j_password: 'lib8848',
        }
        let options = {
          url: 'https://www.lib.city.minato.tokyo.jp/licsxp-opac/j_security_check',
          method: 'POST',
          form: formData
        }
        request(options, (err, res) => {
          if (!res.headers.location) return reject()
          request(res.headers.location, (err, res) => resolve() )
        })
      })
    })
  }

  fetch_books() {
    request('https://www.lib.city.minato.tokyo.jp/licsxp-opac/WOpacMnuTopToPwdLibraryAction.do?gamen=usrlend', (err, res, body) => {
      let $ = cheerio.load(body);
      _books = $('.list tbody tr').map( (i, tr) => {
        return {
          title: $('td', tr).eq(0).text().trim(),
          returnDate: $('td', tr).eq(4).text().trim().replace(/\//g, '-')
        }
      }).get()
      this.emit('ready')
    })
  }

  getLoanedBooks() {
    return _books;
  }
}

let client = new MinatoLibClient2()
client.login()
  .then( () => {
    console.log('OK')
    client.fetch_books()
  })
  .catch( ()=> console.log('NG') )

export default client;
