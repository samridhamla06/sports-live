var feed = require('./index');

feed.read('https://codek.tv/feed/', function(err, rss){
    console.log(JSON.stringify(rss));
});
