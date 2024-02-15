var fs = require("fs");
var crypto = require("crypto");
var logFile = require("./log.js");
var credentialsPath = "./credentials.json";

if (!fs.existsSync(credentials)) {
  let defaultData = JSON.stringify([
    {
      username: "admin",
      passwd:
        "10388a133dada0caa5af6045d888c0ce3289a1fd851a3c89298cb2211a8a4f22",
      watched: {},
      bookmarked: [],
      sponsor: "admin",
      keys: [],
      password:
        "10388a133dada0caa5af6045d888c0ce3289a1fd851a3c89298cb2211a8a4f22",
    },
  ]);

  fs.writeFileSync(credentialsPath, defaultData, { flag: "w" });
}

var credentials = JSON.parse(
  fs.readFileSync(credentialsPath, {
    encoding: "utf8",
  })
);

const expoTime = 86400000;

setInterval(function () {
  credentials.forEach((user) => {
    user.keys.forEach((key, index) => {
      if (key.keyExpo <= Date.now().toString()) {
        user.keys.splice(index, 1);
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
      }
    });
  });

  logFile("Cleaning Keys", credentials);
}, 86400000);

module.exports = {
  checkKey: function (key) {
    for (let i = 0; i < credentials.length; i++) {
      for (let x = 0; x < credentials[i].keys.length; x++) {
        if (
          key == credentials[i].keys[x].key &&
          credentials[i].keys[x].keyExpo > Date.now()
        ) {
          if (credentials[i].keys[x].rememberMe)
            credentials[i].keys[x].keyExpo = Date.now() + expoTime * 90;
          else credentials[i].keys[x].keyExpo = Date.now() + expoTime;

          fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
          logFile("key Approved", credentials[i]);
          return credentials[i];
        }
      }
    }
    return null;
  },

  SetupSocket: function (socket) {
    socket.on("login", function (data) {
      credentialsTrue = false;

      var user;

      for (var i = 0; i < credentials.length; i++) {
        if (
          credentials[i].username == data.username &&
          credentials[i].passwd == data.passwd
        ) {
          credentialsTrue = true;
          user = credentials[i];
          break;
        }
      }

      if (credentialsTrue) {
        var expo;
        if (data.rememberMe) expo = Date.now() + expoTime * 90;
        else expo = Date.now() + expoTime;

        var key = {
          key: crypto.randomBytes(128).toString("hex"),
          keyExpo: expo,
          rememberMe: data.rememberMe,
        };

        user.keys.push(key);

        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));

        logFile("User Logged In", data.username);

        socket.emit("key", key.key);
      } else {
        socket.emit("badLogin");
      }
    });

    //Setup User on client side
    socket.on("keyCheck", function (key) {
      if (module.exports.checkKey(key) != null) {
        socket.emit("keyCheckReplay", module.exports.checkKey(key));
        logFile("Key Check IP:" + socket.handshake.address, {
          ip: socket.handshake.address,
          key: key,
        });
      }
    });

    socket.on("addBookmark", function (data) {
      var user = module.exports.checkKey(data.key);
      if (user != null) {
        for (let i = 0; i < credentials.length; i++) {
          if (credentials[i].username == user.username) {
            credentials[i].bookmarked.push({
              anime: data.anime,
              watched: false,
              episodes: [],
            });
            fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
            logFile("Bookmark Added", {
              username: user.username,
              anime: data.anime.name,
            });
          }
        }
      }
    });

    socket.on("bookmarkReq", function (key) {
      var user = module.exports.checkKey(key);
      if (user != null) {
        for (let i = 0; i < credentials.length; i++) {
          if (credentials[i].username == user.username) {
            socket.emit("bookmarksReplay", credentials[i].bookmarked);
          }
        }
      }
    });

    socket.on("removeBookmark", function (data) {
      var user = module.exports.checkKey(data.key);
      if (user != null) {
        for (let i = 0; i < credentials.length; i++) {
          if (credentials[i].username == user.username) {
            for (let x = 0; x < credentials[i].bookmarked.length; x++) {
              if (credentials[i].bookmarked[x].anime.name == data.anime) {
                credentials[i].bookmarked.splice(x, 1);
                fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
                logFile("Bookmark Removed", {
                  username: user.username,
                  anime: data.anime,
                });
                break;
              }
            }
            break;
          }
        }
      }
    });

    socket.on("addAccount", function (data) {
      var sponsor = module.exports.checkKey(data.key);

      sponsor = {
        username: "admin",
      };

      if (sponsor != null) {
        logFile("Adding User", {
          user: data,
          sponsor: sponsor.username,
        });
        credentials.push({
          username: data.username,
          passwd: data.pwd,
          bookmarked: [],
          watched: {},
          sponsor: sponsor.username,
          keys: [],
        });
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
      }
    });

    socket.on("changePwd", function (data) {
      user = module.exports.checkKey(data.key);

      if (user != null) {
        if (data.oldPwd == user.passwd) {
          user.passwd = data.newPwd;
          fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
          logFile("Password Changed", {
            user,
          });
          socket.emit("changePasswordReplay", "changed");
        } else {
          socket.emit("changePasswordReplay", null);
        }
      }
    });

    socket.on("logoutAll", function (data) {
      var user = module.exports.checkKey(data.key);
      if (user != null) {
        user.keys = [];
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
        logFile("Loged out All", {
          user,
        });
      }
    });

    socket.on("watchedUpdate", function (data) {
      user = module.exports.checkKey(data.key);
      if (user != null) {
        user.watched[data.anime] = data.EpisodesSeen;
        fs.writeFileSync(credentialsPath, JSON.stringify(credentials));
        logFile("Updated Watched List", user);
      }
    });
  },
};
