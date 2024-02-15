const puppeteer = require("puppeteer");
var fs = require("fs");
var HTMLParser = require("node-html-parser");

const UserAgent = require("user-agents");
const { url } = require("inspector");

const userAgent = new UserAgent({
	deviceCategory: "desktop",
	platform: "Linux x86_64",
});

let animeLinks = [];

(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.setViewport({
		width: 1920,
		height: 1080,
	});

	page.setUserAgent(new UserAgent().toString());

	await page.goto("https://9animetv.to/watch/monster-37?ep=1050");

	let animeData = {
		title: "",
		sources: [],
	};

	await page.waitForTimeout(5000);

	await page.screenshot("./anime.jpg");

	let body = await page.evaluate(() => {
		return document.getElementsByTagName("body")[0].innerHTML;
	});

	let parseHtml = HTMLParser.parse(body);

	let sourceList = parseHtml.querySelectorAll(".ps__-list div");

	sourceListParsed = sourceList.map((source) => {
		let data = {
			type: "",
			dataId: "",
			src: "",
		};

		data.type = source.rawAttrs.replace(/.*data-type="/, "").replace(/".*/, "");
		data.dataId = source.rawAttrs.replace(/.*data-id="/, "").replace(/".*/, "");

		return data;
	});

	for (let i = 0; i < sourceListParsed.length; i++) {
		let data = await page.evaluate((id) => {
			return document.querySelector(`[data-id="${id}"]`).innerHTML;
		}, sourceListParsed[i].dataId);

		await page.evaluate((id) => {
			document.querySelector(`[data-id="${id}"] a`).click();
		}, sourceListParsed[i].dataId);
		page.waitForTimeout(2000);
		let body = await page.evaluate(() => {
			return document.getElementsByTagName("body")[0].innerHTML;
		});
		let parseHtml = HTMLParser.parse(body);
		let animeIframe = parseHtml.querySelectorAll("iframe")[0].rawAttrs;
		let animeSrc = animeIframe.slice(animeIframe.indexOf("src="));
		animeSrc = animeSrc.replace('src="', "");
		animeSrc = animeSrc.substring(0, animeSrc.indexOf('"'));
		sourceListParsed[i].src = animeSrc;
	}

	console.log(sourceListParsed);

	await browser.close();
})();
