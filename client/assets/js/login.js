var user;

function login() {
  socket.emit("login", {
    username: document.getElementById("username").value,
    passwd: sha256(document.getElementById("pwd").value),
    rememberMe: document.getElementById("RememberMe").checked,
  });
  console.log(document.getElementById("RememberMe").value);
}

function signOut() {
  setCookie("key", "", 0);
  location.reload();
}

function addAccount() {
  if (document.getElementById("username").value != "") {
    socket.emit("addAccount", {
      username: document.getElementById("username").value,
      pwd: sha256(document.getElementById("pwd").value),
      key: getCookie("key"),
    });

    document.getElementById("CreateNewAccount").remove();
    document.getElementById("UserAddedMsg").style.visibility = "visible";
    document.getElementById("username").value = "";
    document.getElementById("pwd").value = "";
  }
}

function changePassword() {
  if (
    document.getElementById("RepeatNewPwd").value ==
    document.getElementById("newPwd").value
  ) {
    socket.emit("changePwd", {
      oldPwd: sha256(document.getElementById("oldPwd").value),
      newPwd: sha256(document.getElementById("newPwd").value),
      key: getCookie("key"),
    });
  }

  socket.on("changePasswordReplay", function (data) {
    if (data == "changed") {
      document.getElementById("changePasswordResponse").innerHTML =
        "Successfully changed password";
    } else {
      document.getElementById("changePasswordResponse").innerHTML =
        "Faild changed password";
    }
  });

  document.getElementById("oldPwd").value = "";
  document.getElementById("newPwd").value = "";
  document.getElementById("RepeatNewPwd").value = "";
}

function logoutAll() {
  socket.emit("logoutAll", {
    key: getCookie("key"),
  });

  document.location.href = "/login.html";
}

socket.emit("keyCheck", getCookie("key"));

socket.on("keyCheckReplay", function (data) {
  user = data;
  document.getElementById("loginBtn").style.visibility = "hidden";
  document.getElementById("loginBtn").innerHTML = "";
  document.getElementById("userInfo").style.visibility = "visible";
  document.getElementById("user").innerHTML =
    "<a style='color:#fff;' href='/account.html' >" + user.username + "</a>";

  //Fix this
  if (typeof anime !== "undefined") {
    for (let i = 0; i < user.bookmarked.length; i++) {
      if (anime.name == user.bookmarked[i].name) {
        document.getElementById("bookmarkBtn").remove();
        document.getElementById("bookmarkAdded").style.visibility = "visible";
        break;
      }
    }
  }

  //console.log(data);
});

socket.on("key", function (key) {
  console.log(key);
  setCookie("key", key, 90);
  window.location = "/";
});

socket.on("badLogin", function () {
  document.getElementById("badLoginMsg").style.visibility = "visible";
});
