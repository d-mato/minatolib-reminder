var Spooky = require('spooky');
var cheerio = require('cheerio');

var options = {
  child: {transport: 'http'},
};
var spooky = new Spooky(options, function (err) {
  spooky.start('https://github.com/');
  spooky.then(function() {
    this.emit('body', this.getHTML());
  });
  spooky.run();
});

spooky.on('body', function (body) {
  var $ = cheerio.load(body);
  console.log($('title').text());
});

spooky.on('error', function(err) {
  console.log(err);
});
