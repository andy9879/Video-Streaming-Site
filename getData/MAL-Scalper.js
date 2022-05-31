var fs = require("fs");

const delay = require('delay');
const malScraper = require('mal-scraper')
var newdata = JSON.parse(fs.readFileSync("./animeNames.json", {
    'encoding': "utf8"
}));




(async () => {
    const name = 'Sakura Trick'

    for (let i = 0; i < newdata.length; i++) {
        await delay(5000);

        malScraper.getInfoFromName(newdata[i].name)
            .then((data) => {
                console.log("Anime : " + i);

                newdata[i].score = data.score;
                newdata[i].plot = data.synonyms
                newdata[i].thumb = data.picture
                newdata[i].aired = data.aired
                newdata[i].mal = data.link
                newdata[i].genres = data.genres

               // console.log(data)

                fs.writeFileSync("NewAnimeData.json", JSON.stringify(newdata), {
                    encoding: "utf8",
                    flags: "w"
                });

            })
            .catch((err) => console.log(err))
    }




})();