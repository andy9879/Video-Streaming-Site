var fs = require("fs");
const { platform } = require("os");
var account = require("./account.js");
var logFile = require('./log.js');
const AnimeDataDir = './data/ListOfAnimeData.json'
var AnimeData = JSON.parse(fs.readFileSync(AnimeDataDir,{'encoding':"utf8"}));
const MinScoreForHomePageLists = 7;
const HomePageListSize = 25;
var listOfNames = [];

//Ads nameNoSpace OBJ
for(let i = 0;i< AnimeData.length;i++){
    AnimeData[i].name.replace('/ /a','-');
    AnimeData[i].nameNoSpace = AnimeData[i].name.replace(/\s/g, '-');
}

//Genarate Home page Lists
function GenarateHomePageList(genre){
    var candidates = []; 
    for(let i = 0; i < AnimeData.length; i++){
        if(parseFloat(AnimeData[i].score) >= MinScoreForHomePageLists){
            for(let x = 0; x < AnimeData[i].genres.length;x++){
                if(genre == AnimeData[i].genres[x]){
                    candidates.push(AnimeData[i]);
                    break;
                }
            }
        }
            
    }

    var list = [];
    for(let i = 0; i < HomePageListSize;i++){
        var r = Math.floor(Math.random() * candidates.length-1);
        var winner = Object.assign({},candidates[r]) 
        delete winner.ep
        list.push(winner);
        list.splice(r,1);
    }

    return list;
}
var HomePageLists = [
    {
        'genre':'Comedy',
        'list':GenarateHomePageList("Comedy")
    },
    {
        'genre':'Romance',
        'list':GenarateHomePageList("Romance")
    },
    {
        'genre':'Shounen',
        'list':GenarateHomePageList("Shounen")
    },
    {
        'genre':'Ecchi',
        'list':GenarateHomePageList("Ecchi")
    },
    {
        'genre':'Adventure',
        'list':GenarateHomePageList("Adventure")
    },
    {
        'genre':'Slice of Life',
        'list':GenarateHomePageList("Slice of Life")
    },
];

setInterval(function() {
    HomePageLists = [
        {
            'genre':'Comedy',
            'list':GenarateHomePageList("Comedy")
        },
        {
            'genre':'Romance',
            'list':GenarateHomePageList("Romance")
        },
        {
            'genre':'Shounen',
            'list':GenarateHomePageList("Shounen")
        },
        {
            'genre':'Ecchi',
            'list':GenarateHomePageList("Ecchi")
        },
        {
            'genre':'Adventure',
            'list':GenarateHomePageList("Adventure")
        },
        {
            'genre':'Slice of Life',
            'list':GenarateHomePageList("Slice of Life")
        },
    ];
    logFile("Making New Anime List",HomePageLists);
  }, 1800000);


//Makes list of names for searching
for(var i = 0;i < AnimeData.length; i++){
    listOfNames.push({
        'anime':AnimeData[i],
        'name':AnimeData[i].name
    });

    listOfNames.push({
        'anime':AnimeData[i],
        'name':AnimeData[i].englishTitle
    });

    for(var x = 0; x < AnimeData[i].synonyms.length;x++){
        if(AnimeData[i].synonyms[x] != ""){
            listOfNames.push({
                'anime':AnimeData[i],
                'name':AnimeData[i].synonyms[x]
            });
        }
    }
}


module.exports = {
    SetupSocket:function(socket){
        socket.on('listGenre',function(){
            socket.emit("listGenreReply",HomePageLists);
        });
        //Search bar socket
        socket.on("search",function(search){
            //console.log("hi")
            var names = [];

            for(let i = 0;i < listOfNames.length;i++){
               if(listOfNames[i].name.toLowerCase().includes(search.toLowerCase())){
                   //Checks if its already in list
                   var inList = false;
                   for(let x = 0; x < names.length;x++){
                       if(names[x].anime.name == listOfNames[i].anime.name){
                        inList = true;
                        break;
                       }
                   }
                   //Push anime to list in not in list
                   if(!inList){
                        var obj = JSON.parse(JSON.stringify(listOfNames[i]))
                        delete obj.anime.ep
                        names.push(obj);
                   }
               }
               //Breaks if list is to long
               if(names.length > 50)
                break;
            }
            //console.log(names)
            socket.emit("searchReply",names);
            
        
        });

        //Sends Anime data for the anime Pages
        socket.on("GetAnime",function(data){
            if(account.checkKey(data.key) != null){

                var anime = null;

                for(let i = 0;i < AnimeData.length; i++){

                    if(data.name == AnimeData[i].name){
                        anime = AnimeData[i];
                        break;
                    }
                }

                socket.emit("AnimeData",anime)
                logFile("Sending Anime Data",anime);
            }
        });

        socket.on('listOfAnime',function (data){
            var user = account.checkKey(data.key);

            var list = [];

            if(user != null){
                AnimeData.forEach(function(anime){
                    list.push({
                        name:anime.name,
                        nameNoSpace:anime.nameNoSpace,
                        score:anime.score,
                        genres:anime.genres,
                        numberOfEp:anime.ep.length,
                        mal:anime.mal,
                        plot:anime.plot,
                        thumb:anime.thumb
                    });
                });

                socket.emit('listOfAnimeReplay',list);
                logFile("Sent list of anime for random page",list);

            }
        });

    },
    //Finds anime for home page lists
    findAnime:function(anime){
        for(let i = 0;i < AnimeData.length; i++){

            if(anime == AnimeData[i].nameNoSpace){
                return AnimeData[i];
            }
        }
        return null;
    }
}

