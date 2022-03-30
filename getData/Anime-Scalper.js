const puppeteer = require('puppeteer');
var fs = require("fs");
var HTMLParser = require('node-html-parser');

var startAnime = 1;

startPage = 276;


const UserAgent = require("user-agents");


const userAgent = new UserAgent({
    deviceCategory: "desktop",
    platform: "Linux x86_64",
});

if(startPage == 0){
    fs.writeFileSync("animeNames.json", "[", {
        encoding: "utf8",
        flag: 'a+'
    });
}




(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    })


    page.setUserAgent(new UserAgent().toString());

    await page.goto('https://9anime.gg/az-list/all/');

    for (let i = 0; i <= 320; i++) {

        if(startPage != 0){

            for(let c = 1;c < startPage;c++)
            {
                console.log(c + " : " + (await page.evaluateHandle(() => {
                    document.getElementsByClassName("pull-right")[0].click();
                    return(window.location.href);
                }))._remoteObject.value);
                await page.waitForTimeout(3000);
                
            }

            i = startPage;
            startPage = 0;
            

        }


        console.log("Page:" + i)

        await page.waitForTimeout(3000);

        page.setUserAgent(new UserAgent().toString());


        var body = await page.evaluateHandle(() => {
            return (document.getElementsByTagName("body")[0].innerHTML)
        });



        var root = HTMLParser.parse(body._remoteObject.value)


        for (let x = 0; x < root.querySelectorAll(".name").length; x++) {
            if(startAnime != 0){
                x = startAnime;
                startAnime = 0; 
            }
            


            const animePage = await browser.newPage();

            var anime = {
                name: root.querySelectorAll(".name")[x].removeWhitespace().childNodes[0]._rawText,
                link: root.querySelectorAll(".name")[x]._attrs.href,
                ep: []
            };

            await animePage.goto(root.querySelectorAll(".name")[x]._attrs.href);

            var body = await animePage.evaluateHandle(() => {
                return (document.getElementsByTagName("body")[0].innerHTML)
            });

            var Subroot = HTMLParser.parse(body._remoteObject.value)


            Subroot.querySelectorAll(".btn-eps").forEach(li => {
                anime.ep.push(li._attrs["data-src"])
            });



            fs.writeFileSync("./animeNames.json", JSON.stringify(anime) + ',', {
                encoding: "utf8",
                flag: 'a+'
            });

            console.log("Page:" + i + "/320 Anime:" + x + " : " + anime.name)

            animePage.close();

        }


        console.log((await page.evaluateHandle(() => {
            document.getElementsByClassName("pull-right")[0].click();
            return(window.location.href);
        }))._remoteObject.value);
    }





    await browser.close();
})();