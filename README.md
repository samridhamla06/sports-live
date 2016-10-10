#INTRODUCTION

With sports-live NPM package, you can extract highly accurate live updates about various popular sports absolutely FREE. The current API version is bundled with two key functions as mentioned below:

i) getAllMatches(sport):

-> It takes the sport’s name as an argument and gives you the output containing all the latest matches with live scores for the desired sport.

ii) getLiveScores(sport,team1,team2):

-> It takes three argument where team1 and team2 signifies the names of the opponents playing the sport. It gives the output as the live score for the concerned match.

 
#SETUP:
var api = require('sports-live');
 
#USAGE:

This can help you understand the various arguments and callbacks involved, as shown below, 

1) api.getAllMatches(“tennis”,function(err,matches){
    if (err) {
        console.log(err.message);
    }
    else {
        console.log(matches);
    }
});

Output: 

[ { team1: 'Golubic V.',
    team2: 'Siegemund L',
    score: '2-0',
    currentStatus: 'Match Finished' },
  { team1: 'Youzhny M.',
    team2: 'Almagro N',
    score: '1-1',
    currentStatus: ‘3rd Set' },
{ team1: ‘Murray A.’,
    team2: ‘Dimitrov G.’,
    score: '2-0',
    currentStatus: 'Match Finished' },
  { team1: 'Karlovic I.',
    team2: 'Pospisil V',
    score: '0-2',
    currentStatus: 'Match Finished' }]


2) api.getLiveScores(“tennis”,”murray”,”dimitrov”,function(err,match) {
    if (err) {
        console.log(err.message);
    }
    else {
       console.log(match);
    }
});
 
Output:

{   team1: ‘Murray A.’,
    team2: ‘Dimitrov G.’,
    score: '2-0',
    currentStatus: 'Match Finished' }

In case the match isn't going on, you’ll get a message saying:
 “No match available for mentioned sport or Team”

Have a look at the output of test.js for better understanding.

#IMPORTANT POINTS:

1) The available sports as of now are :

a) Cricket
b) Soccer (European leagues)
c) Baseball
d) American Football
e) Tennis
f) Ice Hockey

2)  To enter multi-word sport name or team name, it is recommended to have NO SPACES and UNDERSCORE for differentiation e.g:

Cricket Match between India & New Zealand, then type

api.getLiveScores(“cricket”,”india”,”new_zealand”,function(err,match) {
    if (err) {
        console.log(err.message);
    }
    else {
       console.log(match);
    }
});

3) For cricket the O/P convention is bit different than other sport due to its scoring pattern, an example can help you understand. (output for above match)

Output:
{
  "team1": "India 557/5 ,  18 *",
  "team2": "New Zealand 299/10",
  "score": " ",
  "currentStatus": " "
}
