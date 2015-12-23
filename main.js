var request = require('request');
var cheerio = require('cheerio');
var _s = require('underscore.string');
var fs = require('fs');

var year = process.argv[2] || 2014;
var count = process.argv[3] || 1;

var data = [];

var url = 'http://espn.go.com/golf/statistics/_/year/'+year+'/count/'+count;

var callbackFinal = function(err, resp, body) {
    if (err) throw err;
    getAndStoreData(body);
    write(data);
}
var callbackFive = function(err, resp, body) {//201-241
    if (err) throw err;
    getAndStoreData(body);
    var url = 'http://espn.go.com/golf/statistics/_/year/'+year+'/count/200';
    request(url, callbackFinal);
}
var callbackFour = function(err, resp, body) {//161-200
    if (err) throw err;
    getAndStoreData(body);
    var url = 'http://espn.go.com/golf/statistics/_/year/'+year+'/count/161';
    request(url, callbackFive);
}
var callbackThree = function(err, resp, body) {//121-160
    if (err) throw err;
    getAndStoreData(body);
    var url = 'http://espn.go.com/golf/statistics/_/year/'+year+'/count/121';
    request(url, callbackFour);
}
var callbackTwo = function(err, resp, body) {//81-120
    if (err) throw err;
    getAndStoreData(body);
    var url = 'http://espn.go.com/golf/statistics/_/year/'+year+'/count/81';
    request(url, callbackThree);
}
var callbackOne = function(err, resp, body) {//1-40
    if (err) throw err;
    getAndStoreData(body);
    var url = 'http://espn.go.com/golf/statistics/_/year/'+year+'/count/41';
    request(url, callbackTwo);
}

request(url, callbackOne);

function getAndStoreData(body){
    var $ = cheerio.load(body);

    var table = $("#my-players-table table");
    $("tr:not(.stathead, .colhead)").each(function(i, elem){
        var subData = {};
        // console.log(i + " ___________ ");
        // console.log($(elem.children[1]).text());

        subData.name = $(elem.children[1]).text();
        subData.age = parseInt($(elem.children[2]).text()) - (2014-year);//given data shows current age of player.
        subData.events = $(elem.children[3]).text();
        subData.rounds = $(elem.children[4]).text();
        subData.cuts = $(elem.children[5]).text();
        subData.top10s = $(elem.children[6]).text();
        subData.wins = $(elem.children[7]).text();
        subData.money = $(elem.children[9]).text();


        subData && data.push(subData);
    })
    console.log(data.length);
}

function write(data){
    fs.writeFile('PGATour'+year+'_aggregate.json', JSON.stringify(data), function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
}