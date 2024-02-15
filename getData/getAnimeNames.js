const puppeteer = require("puppeteer");
var fs = require("fs");
var HTMLParser = require("node-html-parser");

const UserAgent = require("user-agents");

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

	await page.goto("https://9animetv.to/az-list");

	await page.waitForTimeout(5000);

	for (let i = 0; i < 186; i++) {
		console.log(`${i} / 186 : Number Of Anime ${animeLinks.length}`);

		await page.waitForTimeout(5000);

		let body = await page.evaluate(() => {
			return document.getElementsByClassName("anime-block-ul")[0].innerHTML;
		});

		let parsedBody = HTMLParser.parse(body);

		let linkTags = parsedBody
			.querySelectorAll(".dynamic-name")
			.map((tag) => "https://9animetv.to" + tag._attrs.href);

		animeLinks.push(...linkTags);

		await page.evaluate(() => {
			return document.querySelector(".ap__-btn-next a").click();
		});
	}

	fs.writeFileSync("./animeLinks.json", JSON.stringify(animeLinks), {
		flag: "w",
	});

	await browser.close();
})();
