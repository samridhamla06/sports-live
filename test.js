var api = require('./index.js');

var sport = "tennis";
var team1 = "murray";
var team2 = "dimitrov";



api.getAllMatches(sport,function(err,matches){
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("All matches of sport " + sport + " are:");
        console.log(matches);
    }
});



api.getLiveScores(sport,team1,team2,function(err,match) {
    if (err) {
        console.log(err.message);
    }
    else {
        console.log("match detail for team1: " + team1 + " and team2 :" + team2 + " is:");
        console.log(match);
    }
});

