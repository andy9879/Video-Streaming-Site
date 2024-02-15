var logFile = require("./log.js");
var account = require("./account.js");

var express = require("express");
var app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
var animeData = require("./animeData.js");
var statCounter = require("./statCounter.js");
var account = require("./account.js");
var fs = require("fs");
//var HTMLParser = require('node-html-parser');
const clientDir = "./client/";
const port = 85;

//Starts Http server in client folder

app.use(express.static(clientDir));

//Makes and sends anime html
app.use("/anime/", function (req, res) {
  fs.readFile(clientDir + "/anime/anime.html", "utf8", function (err, html) {
    // Display the file content
    var path = req._parsedOriginalUrl.path.replace("/anime/", "");

    var anime = animeData.findAnime(path);

    //console.log(anime.name)
    //res.send(addStr(html, 30, "\n\t<script> var animeName = JSON.parse(\""+ anime.replace(/\\/g , "\\\\").replace(/"/g,"\\\"").replace(/'/g,"\\\'") + "\")</script>"));
    if (anime != null) {
      res.send(
        addStr(
          html,
          30,
          '\n\t<script> var animeName = "' + anime.name + '"</script>',
        ),
      );
    }

    return null;
  });
});

console.log("HTTP server for ./client is running on PORT:" + port);

//Socket IO server
io.on("connection", (socket) => {
  animeData.SetupSocket(socket);
  statCounter.start(socket);
  account.SetupSocket(socket);
  logFile("User Connected to socket.io", {});
});
//io.emit('dataTx', data);

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

function addStr(str, index, stringToAdd) {
  return (
    str.substring(0, index) + stringToAdd + str.substring(index, str.length)
  );
}
