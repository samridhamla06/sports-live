var request = require("request");
var Feed = require('rss-to-json');

function getResponseObject(team1, team2, score, keyMoment) {
    var json = {};
    json.team1 = team1;
    json.team2 = team2;
    json.score = score;
    json.currentStatus = keyMoment;
    return json;
}

function extractCricketScores(match){
    var description = match.description;
    description = description.replace("&amp;",",");
    var indexOfV = description.indexOf(" v ")
    var team1 = description.substring(0,indexOfV);
    var team2 = description.substring(indexOfV + 2);
    return getResponseObject(team1.trim(),team2.trim()," "," ");
}


function extractOtherScores(sport,match){
    if (sport == "soccer"){ // soccer response is different
        var description = match.description;
        var indexOfBracket = description.indexOf(")");
        description = description.substring(indexOfBracket+1);
        var indexOfVs = description.indexOf("vs");
        var indexOfColon = description.indexOf(":");
        var indexOfHyphen = description.lastIndexOf("-");
        var l = description.length - 1;
        var team1 = description.substring(0,indexOfVs-1).replace("#"," ").trim();
        var team2 = description.substring(indexOfVs + 2,indexOfColon - 1).replace("#"," ").trim();
        var score = description.substring(indexOfColon + 1,indexOfHyphen-1).trim();
        var keyMoment = description.substring(indexOfHyphen+1).trim();
        return getResponseObject(team1,team2,score,keyMoment);
    }else {
        var title = match.title;
        var indexOfBracket = title.indexOf(")");
        title = title.substring(indexOfBracket + 1);
        var indexOfVs = title.indexOf("vs");
        var indexOfColon = title.indexOf(":");
        var l = title.length - 1;
        var team1 = title.substring(0, indexOfVs - 1).replace("#", " ").trim();
        var team2 = title.substring(indexOfVs + 2, indexOfColon - 1).replace("#", " ").trim();
        var score = title.substring(indexOfColon + 1).trim();
        var keyMoment = match.description;
        return getResponseObject(team1, team2, score, keyMoment);
    }
}

function isTheMatch(match,sport,pattern1,pattern2){
    var description;
    if (sport == "soccer" || sport == "cricket"){
        description = match.description;
    }else{
        description = match.title;
    }
    return description.search(pattern1)!=-1 && description.search(pattern2)!=-1;
}

exports.getCricketScores = function(team1,team2,callback) {
    var pattern1 = new RegExp(team1,"i");
    var pattern2 = new RegExp(team2,"i");
    var sport = "cricket";
    var match;

    request.post({
        url: "http://cricapi.com/api/cricket/",
        form: { "apikey": null }
    }, function(err, resp, data) {
        if (err){
            callback(err);
        }
        if(resp.statusCode == 200){
            var matches = JSON.parse(data).data;
            for (var i=0; i<matches.length;i++ ){
                match = matches[i];
                if (isTheMatch(match,sport,pattern1,pattern2)){
                    var response = extractCricketScores(match);
                    callback(err,response);
                    break;
                }
            }
            if(i==matches.length){
                callback(new Error("No match available for mentioned sport or Team"));
            }
        }else{
            callback(new Error("CricApi Server responded BAD",resp.statusCode));
        }});
};



exports.getOthersScores = function (sport,team1, team2,callback) {
    var pattern1 = new RegExp(team1,"i");
    var pattern2 = new RegExp(team2,"i");//case insensitive
    var url = 'http://www.scorespro.com/rss2/live-' + sport +'.xml';
    var match;
    Feed.load(url, function(err, result){
        if (err) {
            callback(err);
        }
        var matches = result.items;
        for (var i =0; i <matches.length ; i++){
            match = matches[i];
            if(isTheMatch(match,sport,pattern1,pattern2)){
                var response = extractOtherScores(sport,matches[i]);
                callback(err,response);
                break;
            }
        }

        if(i==matches.length) {
            callback(new Error("No match available for mentioned sport or Team"));
        }
    });





};

exports.getAllCricketMatches = function(callback) {
    var responseArray = [];

    request.post({
        url: "http://cricapi.com/api/cricket/",
        form: { "apikey": null }
    }, function(err, resp, data) {
        if (err){
            callback(err);
        }
        if(resp.statusCode == 200){
            var matches = JSON.parse(data).data;

            for (var i=0; i<matches.length;i++ ){
                var matchInfo = extractCricketScores(matches[i]);
                responseArray.push(matchInfo);
            }
            callback(err,responseArray);

        }else{
            callback(new Error("CricApi Server responded BAD",resp.statusCode));
        }
    });

}
exports.getAllOtherMatches = function(sport,callback) {
    var url = 'http://www.scorespro.com/rss2/live-' + sport +'.xml';
    var responseObject = [];
    Feed.load(url, function(err, result){
        if (err) {
            callback(err);
        }
        var matches = result.items;
        for (var i =0; i <matches.length ; i++){
            var  matchInfo = extractOtherScores(sport,matches[i]);
            responseObject.push(matchInfo);
        }
        callback(err,responseObject);
    });
}







