/*jshint strict:false*/
/*global CasperError, console, phantom, require*/

/**
 * Create a mosaic image from all headline photos on BBC homepage
 */
var casper = require("casper").create({
	verbose : true,
	logLevel : "debug"
});

nbLinks = 0;
currentLink = 0;
var images = [];
var buildPage, next;

var url = "http://localhost:8080/uilib-sample/test-resources/sap/m/demokit/inbox/index.html";
var siteName = "My Inbox";

// helper to hide some element from remote DOM
casper.hide = function(selector) {
	this.evaluate(function(selector) {
		document.querySelector(selector).style.display = "none";
	}, selector);
};

casper
		.start(
				url,
				function() {

					this.test.assert(this.getCurrentUrl() === url, 'url is the one expected');

					this.test.assertHttpStatus(200, siteName + ' is up');

					this.test.assertTitle('My Inbox', siteName + ' has the correct title');

					this.test
							.assertResourceExists(
									'http://localhost:8080/uilib-sample/resources/sap/ui/core/themes/sap_bluecrystal/img/bg_white_transparent.png',
									'Background exists');

					this.test.assertTextExists('Leave Requests', 'page body contains "Leave Requests"');

					nbLinks = this.evaluate(function() {
						return __utils__.findAll('.sapMTile');
					});
					debugger;
					this.echo(nbLinks.length + " items founds");
					this.mouse.move("#__tile0");
					this.viewport(1900, 800);
				});

// casper.waitUntilVisible(".sapMTCAnim", function() {
// this.echo("Moving over pause button");
// this.mouse.move("#__tile0");
// this.click("#__tile0");
// this.echo("Clicked on first card");
// this.waitUntilVisible(".LrDetail--page-cont", function() {
// this.echo("Carousel has been paused");
// // hide play button
// //this.hide(".autoplay");
// this.capture('aaaa.png');
// });
// });

// Capture carrousel area
next = function() {
	var image;
	image = "bbcshot" + currentLink + ".png";
	images.push(image);

	if (currentLink < 1) {
		this.echo("Clicking link " + currentLink);
		this.test.assertExists("#__tile" + currentLink);
		this.mouse.move("#__tile" + currentLink);
		this.mouse.down("#__tile" + currentLink);

		this.waitUntilVisible("#__button4", function() {
			this.echo("Processing image " + currentLink);
			this.capture(image);
		});
		currentLink++;
		this.wait(1000, function() {
			this.echo("Back from link " + currentLink);
			casper.back();
			this.then(next);
		});
	} else {
		this.then(buildPage);
	}
};

// Building resulting page and image
buildPage = function() {
	var fs, pageHtml;
	this.echo("Build result page");
	fs = require("fs");
	this.viewport(1900, 800);
	pageHtml = "<html><body style='background:black;margin:0;padding:0'>";
	images.forEach(function(image) {
		pageHtml += "<img src='file://" + fs.workingDirectory + "/" + image + "'><br>";
	});
	pageHtml += "</body></html>";
	fs.write("result.html", pageHtml, 'w');
	this.thenOpen("file://" + fs.workingDirectory + "/result.html", function() {
		this.echo("Resulting image saved to result.png");
		this.capture("result.png");
	});
};

finish = function() {

	casper.test.comment('Ending Testing');
	// require('utils').dump(this.test.getFailures());
	// require('utils').dump(this.test.getPasses());
	this.test.done();
	this.exit();
};

casper.then(next);
casper.then(finish);

casper.run();
