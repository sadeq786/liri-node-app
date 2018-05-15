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
    
    if (!process.argv[3]) {
        process.argv[3] = 'The Sign';
    }
    spotify.search({ type: 'track', query: process.argv[3] }, function (err, data) {
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

    if (!process.argv[3]) {
        process.argv[3] = 'Mr. Nobody';
    }
    var movieName = process.argv[3];
    request('http://www.omdbapi.com/?apikey=trilogy&s=' + movieName, function (error, response, body) {
        // console.log('error:', error); // Print the error if one occurred
        // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        ourData = JSON.parse(body);
        for (var i = 0 ; i < 5 ; i++) {
        console.log("Movie Title : ", ourData.Search[i].Title);
        console.log("Year of Release: ", ourData.Search[i].Year);
        console.log();
        }
    });
}

function doWhatItSays () {
    fs.readFile('random.txt', function(err, data) {
        //get index of ','. this is what separates the command from the name of the song/movie
        // str = data;
        // console.log(data);
        var comma = data.indexOf(',');
        // console.log(comma);
        var fileCommand = data.substring(1 , comma);
        // console.log(fileCommand); 
        var songName = data.substring(comma+2 , str.length-1);
        process.argv[3] = songName;
        command = fileCommand;


    });
}