
socket.emit("bookmarkReq",getCookie('key'));
socket.on("bookmarksReplay",function(bookmarks){
    console.log(bookmarks)

    for(let i = 0; i < bookmarks.length;i++){
        document.getElementById("BookmarkList").innerHTML += "<div id=\"bookmark-" + bookmarks[i].anime.name.replace(/\s/g, '-') + "\" style=\"color: #ebebeb;\"><img onclick=\"removeBookmark(\'"+ bookmarks[i].anime.name +"\')\" src=\"assets/img/trashcan.png\" style=\"margin-top:0px; margin-right:20px; cursor: pointer;\" width=\"15x\"><span style=\"width: 600px; display: inline-block; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; margin:-10px;\"><a style=\"color: #ebebeb;\" href=\"/anime/" + bookmarks[i].anime.name.replace(/\s/g, '-') + "\">" + bookmarks[i].anime.name + "</a></span> | <span style=\"width: 125px;display: inline-block;\">Epasodes " + bookmarks[i].anime.ep.length + "</span>  | <span style=\"width: 300px;display: inline-block;\">Aired " + bookmarks[i].anime.aired + "</span></div>"
    }

});

function removeBookmark(anime){
    socket.emit("removeBookmark",{anime:anime,key:getCookie('key')});
    document.getElementById("bookmark-" + anime.replace(/\s/g, '-')).remove();
}