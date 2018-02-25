/*

	Scraper endpoints:
		Female names: https://www.island.is/mannanofn/leit-ad-nafni/?Nafn=&Stulkur=on
		Male names:   https://www.island.is/mannanofn/leit-ad-nafni/?Nafn=&Drengir=on
		Middle names: https://www.island.is/mannanofn/leit-ad-nafni/?Nafn=&Millinofn=on

	NOTE: First names can also be middle names

	Output:
		output/male_names.json
		output/female_names.json
		output/middle_names.json
		output/first_names.json
*/

var fs = require('fs');
var request = require('sync-request');
var cheerio = require('cheerio');
var jsonfile = require('jsonfile');

var endpoints = [
	"https://www.island.is/mannanofn/leit-ad-nafni/?Nafn=&Stulkur=on",
	"https://www.island.is/mannanofn/leit-ad-nafni/?Nafn=&Drengir=on",
	"https://www.island.is/mannanofn/leit-ad-nafni/?Nafn=&Millinofn=on"
];

var all_names = [];
var male_names = [];
var female_names = [];
var middle_names = [];

if (!fs.existsSync('output')){
    fs.mkdirSync('output');
}

function scrape_endpoint(url, outfile){
	var html = "";
	var $;
	var names = [];

	var res = request('GET', url);
	var html = res.getBody();
	var $ = cheerio.load(html);
		
	$('ul.dir>li').map(function(){
		var name = $(this).text();
		var re = /([\s]+.*)/g;
		var cleanedName = name.replace(re, ''); // Replaces trailing whitespace and junk
		names.push(cleanedName);
	});

	jsonfile.writeFile(outfile, names, function (err) {
		if (err) {
			console.log(err);
		}
	});
		
	return names;
}

male_names = scrape_endpoint("https://www.island.is/mannanofn/leit-ad-nafni/?Nafn=&Drengir=on", "output/male_names.json");
female_names = scrape_endpoint("https://www.island.is/mannanofn/leit-ad-nafni/?Nafn=&Stulkur=on", "output/female_names.json");
middle_names = scrape_endpoint("https://www.island.is/mannanofn/leit-ad-nafni/?Nafn=&Millinofn=on", "output/middle_names.json");

all_names = male_names.concat(female_names);

all_names.sort(function(a, b){
    if(a < b) return -1;
    if(a > b) return 1;
    return 0;
})

jsonfile.writeFile("output/first_names.json", all_names, function (err) {});


