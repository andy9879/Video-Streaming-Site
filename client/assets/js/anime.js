
var anime;
var EpisodesSeen;

function epChange(ep){
    document.getElementById("video").src = anime.ep[ep];
    document.getElementById("EpisodeNumber").innerHTML = ep+1;

    if(anime.ep.length > ep + 1){
        document.getElementById("nextEp").onclick = function(){epChange(ep+1);};
        document.getElementById("nextEp").style.backgroundColor = "#044480";
    }
    else{
        document.getElementById("nextEp").onclick = "";
        document.getElementById("nextEp").style.backgroundColor = "#061033";
    }
        

    if(ep > 0){
        document.getElementById("previousEp").onclick = function(){epChange(ep-1);};
        document.getElementById("previousEp").style.backgroundColor = "#044480";
    }
    else{
        document.getElementById("previousEp").onclick = "";
        document.getElementById("previousEp").style.backgroundColor = "#061033";
    }

    

    for(let i = 0; i < EpisodesSeen.length;i++){
        if(ep == EpisodesSeen[i])
            alreadySeen = true;
    }

    EpisodesSeen.push(ep);
    document.getElementById("ep-" + ep).style.backgroundColor = "#061033";
    var alreadySeen = false;
    
    
    if(!alreadySeen){
        socket.emit('watchedUpdate',{
            anime:anime.nameNoSpace,
            EpisodesSeen:EpisodesSeen,
            key:getCookie("key")
        });
        //setCookie(("EpisodesSeen-" + anime.name),EpisodesSeen,365);
    }
        
}

function addBookmark(){
    //console.log(anime);
    socket.emit("addBookmark",{
        key:getCookie('key'),
        anime:anime
    });
    document.getElementById("bookmarkBtn").remove();
    document.getElementById("bookmarkAdded").style.visibility = "visible";
}

function clearWatched(){
    socket.emit('watchedUpdate',{
        anime:anime.nameNoSpace,
        EpisodesSeen:[],
        key:getCookie("key")
    });
    location.reload();
} 

socket.emit("GetAnime",{
    name:animeName,
    key:getCookie("key")
})



socket.on("AnimeData",function(data){

    anime = data;

    socket.emit("bookmarkReq",getCookie('key'));
    
    socket.on("bookmarksReplay",function(bookmarks){
        bookmarks.forEach(bookmark => {
            if(bookmark.anime.nameNoSpace == anime.nameNoSpace){
                document.getElementById("bookmarkBtn").remove();
                document.getElementById("bookmarkAdded").style.visibility = "visible";
            }
        });
    });

    if(anime.ep.length > 1){
        document.getElementById("nextEp").onclick = function(){epChange(1);};
        document.getElementById("nextEp").style.backgroundColor = "#044480";
        //Next Ep Shortcut
    }
    
    
    //EpisodesSeen = JSON.parse("[" + getCookie("EpisodesSeen-" + anime.name) + "]");
    console.log(user)

    EpisodesSeen = user.watched[anime.nameNoSpace];
    if(EpisodesSeen == undefined)
        EpisodesSeen = [];

    
    console.log(EpisodesSeen)

    if(EpisodesSeen.length == 0){
        EpisodesSeen.push(0)
        socket.emit('watchedUpdate',{
            anime:anime.nameNoSpace,
            EpisodesSeen:EpisodesSeen,
            key:getCookie("key")
        });
    }
        


    //Makes anime pages
    document.getElementById("title").innerHTML = anime.name;
    document.getElementById("plot").innerText = anime.plot;
    document.getElementById("video").src = anime.ep[0];
    document.getElementsByTagName("title")[0].innerHTML += anime.name;
    document.getElementById("EpisodeNumber").innerHTML = "1";
    document.getElementById("malLink").innerHTML = anime.mal;
    document.getElementById("malLink").href = anime.mal;

    anime.genres.forEach(genre => {
        document.getElementById("genres").innerHTML += genre + " ";
    });
    

    
    for(let i = 0;i < anime.ep.length;i++){
        document.getElementById("epList").innerHTML += "<div class=\"ep\" id=\"ep-"+ i +"\"onClick=\"epChange("+ i +")\"><h6>"+ (i+1) +"</h6></div>"
    }
    document.getElementById("ep-" + EpisodesSeen[0]).style.backgroundColor = "#061033";
    
    for(let i = 0; i < EpisodesSeen.length; i++){
        document.getElementById("ep-" + EpisodesSeen[i]).style.backgroundColor = "#061033";
    }

    
});

//next ep short cut
$('body').keypress(function(event){
      
    var keycode = (event.keyCode ? event.keyCode : event.which);

    if(keycode == '78' || keycode == '110'){
         document.getElementById("nextEp").click();
    }
    event.stopPropagation();
});

