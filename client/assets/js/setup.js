var socket = io();

//Search Bar
socket.on("searchReply", function (names) {
  //console.log("hi")
  document.getElementById("searchListDiv").style.visibility = "";
  document.getElementById("searchList").innerHTML = "";
  for (let i = 0; i < names.length; i++) {
    console.log(names[i].name);
    document.getElementById("searchList").innerHTML +=
      '<li><a style="color:#fff;" href="' +
      "/anime/" +
      names[i].anime.nameNoSpace +
      '">' +
      names[i].anime.name +
      "</a></li>";
  }
});

$(window).click(function () {
  //Hide the menus if visible
  document.getElementById("searchListDiv").style.visibility = "hidden";
});

$("#searchReply").click(function (event) {
  event.stopPropagation();
});

$("#search-field").on("input", function () {
  socket.emit("search", document.getElementById("search-field").value);
});
