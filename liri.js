require("dotenv").config();
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var client = new twitter(keys.twitterKeys);
var fs = require('fs');

var spotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);

var command = process.argv[2];
var title = process.argv[3];

runSwitch(command);

function runSwitch(command) {
    switch (command) {
        case 'my-tweets':
            myTweets();
            break;
        case 'spotify-this-song':
            spotifyTrack();
            break;
        case 'movie-this':
            movie();
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log("Wrong command, please try again !");
    }
}


function myTweets() {
    var params =
        {
            screen_name: 'snipper_io',
            count: 20
        };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++) {
                console.log(tweets[i].text + " =====> " + tweets[i].created_at);
            }
        }
    });
}

function spotifyTrack() {

    if (!title) {
        title = 'The Sign';
    }
    spotify.search({ type: 'track', query: title }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (var i = 0; i < 20; i++) {
            // console.log("Start", data.tracks.items[5]);
            console.log("Artist Name(s): ", data.tracks.items[i].album.artists[0].name);
            console.log("Song Name: ", data.tracks.items[i].name);
            console.log("Preview Link: ", data.tracks.items[i].album.external_urls.spotify);
            console.log("Album Name: ", data.tracks.items[i].album.name);
            console.log();
        }
    });
}

function movie() {

    if (!title) {
        title = 'Mr. Nobody';
    }
    var movieName = title;
    request('http://www.omdbapi.com/?apikey=trilogy&t=' + movieName, function (error, response, body) {
        var ourData = JSON.parse(body);
            console.log();
            console.log("Title: ", ourData.Title);
            console.log("Year: ", ourData.Year);
            console.log("imdbRating: ", ourData.imdbRating);
            console.log("Rotten Tomatoes Score: ", ourData.Ratings[1].Value)
            console.log("Country: ", ourData.Country);
            console.log("Language: ", ourData.Language);
            console.log("Plot: ", ourData.Plot);
            console.log("Actors in the Movie: ", ourData.Actors);
            console.log();
        
    });
}

function doWhatItSays() {
    fs.readFile('random.txt', "UTF-8", function (err, data) {
        if (err) {
            return console.log(err);
        }

        title = data.split(",")[1];
        command = data.split(",")[0];
        runSwitch(command);
    });
}