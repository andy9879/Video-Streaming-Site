var fs = require("fs");
const statFile = "./data/stats.json";

module.exports = {
  start: function (socket) {
    data = {
      ip: socket.handshake.address,
      time: Math.floor(new Date() / 1000),
      url: socket.request.headers.referer,
    };
    fs.appendFile(statFile, JSON.stringify(data) + ",", function () {});
  },
};
