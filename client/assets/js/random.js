var listOfAnime;

socket.emit('listOfAnime', {
    key: getCookie('key'),
});

socket.on("listOfAnimeReplay", function (data) {
    listOfAnime = data;
    document.getElementById("apply").style.visibility = "visible";
    document.getElementById("lucky").style.visibility = "visible";
    document.getElementById("loading").remove();
});

var currentPage = 0;
var pages = [];

function displayPage(page) {
    document.getElementById("listOfRandomAnime").innerHTML = "";

    pages[page].forEach(anime => {
        document.getElementById("listOfRandomAnime").innerHTML += "<div class='randomAnime'>" +
            "<div class='randomAnimeRandomWrap'>" +
            "<a href=\"/anime/" + anime.nameNoSpace + "\">" +
            "<img style=\"display:inline-block;\" src='" + anime.thumb + "'></a><span>" +
            "<h3>" + anime.name + "</h3><br>" +
            anime.plot + "<br><br>" +
            (function () {
                var list = "";
                anime.genres.forEach(genre => {
                    list += genre + " , ";
                });

                return "Genres<br>" + list
            })() +
            "<br>Score " + anime.score + "<br>" +
            //"<br>Eposodes " + anime.score + "<br>" +
            "<br>Link <a href=\"/anime/" + anime.nameNoSpace + "\">http://animeplanet.tv:85/anime" + anime.nameNoSpace + "</a>" +
            "</span>" +
            "</div>" +
            "</div>";
    });
}

function swap(arr, firstIndex, secondIndex) {
    var temp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = temp;
}

function bubbleSortAlgo(arraaytest) {
    var len = arraaytest.length, i, j, stop;
    for (i = 0; i < len; i++) {
        for (j = 0, stop = len - i; j < stop; j++) {
            if (parseFloat(arraaytest[j].score) > parseFloat(arraaytest[j + 1].score)) {
                swap(arraaytest, j, j + 1);
            }
        }
    }
    return arraaytest;
}

function GenList() {
    pages = [];




    filter = {
        include: [],
        exclude: [],
        minScore: parseInt(document.getElementById("minScore").value),
        maxScore: parseInt(document.getElementById("MaxScore").value)
    }

    if (document.getElementById("include-Action").checked)
        filter.include.push("Action")
    if (document.getElementById("include-Adventure").checked)
        filter.include.push("Adventure")
    if (document.getElementById("include-Comedy").checked)
        filter.include.push("Comedy")
    if (document.getElementById("include-Drama").checked)
        filter.include.push("Drama")
    if (document.getElementById("include-Fantasy").checked)
        filter.include.push("Fantasy")
    if (document.getElementById("include-Horror").checked)
        filter.include.push("Horror")
    if (document.getElementById("include-Mystery").checked)
        filter.include.push("Mystery")
    if (document.getElementById("include-Romance").checked)
        filter.include.push("Romance")
    if (document.getElementById("include-Sports").checked)
        filter.include.push("Sports")
    if (document.getElementById("include-Ecchi").checked)
        filter.include.push("Ecchi")

    if (document.getElementById("exclude-Action").checked)
        filter.exclude.push("Action")
    if (document.getElementById("exclude-Adventure").checked)
        filter.exclude.push("Adventure")
    if (document.getElementById("exclude-Comedy").checked)
        filter.exclude.push("Comedy")
    if (document.getElementById("exclude-Drama").checked)
        filter.exclude.push("Drama")
    if (document.getElementById("exclude-Fantasy").checked)
        filter.exclude.push("Fantasy")
    if (document.getElementById("exclude-Horror").checked)
        filter.exclude.push("Horror")
    if (document.getElementById("exclude-Mystery").checked)
        filter.exclude.push("Mystery")
    if (document.getElementById("exclude-Romance").checked)
        filter.exclude.push("Romance")
    if (document.getElementById("exclude-Sports").checked)
        filter.exclude.push("Sports")
    if (document.getElementById("exclude-Supernatural").checked)
        filter.exclude.push("Supernatural")
    if (document.getElementById("exclude-Ecchi").checked)
        filter.exclude.push("Ecchi")


    //Filtering

    var list = [];

    //included
    for (let i = 0; i < listOfAnime.length; i++) {

        var include = true;

        for (let x = 0; x < filter.include.length; x++) {
            subInclude = false;
            for (let y = 0; y < listOfAnime[i].genres.length; y++) {
                if (listOfAnime[i].genres[y] == filter.include[x]) {
                    subInclude = true;
                    break;
                }
            }
            if (!subInclude) {
                include = false;
                break;
            }
        }

        if (include) {
            list.push(listOfAnime[i])
        }

    }

    //excluded
    var tempList = [];
    list.forEach(function (anime) {
        var exclude = true;


        for (let x = 0; x < filter.exclude.length; x++) {
            for (let y = 0; y < anime.genres.length; y++) {
                if (anime.genres[y] == filter.exclude[x]) {
                    exclude = false;
                    break;
                }
            }
        }

        if (exclude) {
            tempList.push(anime);
        }
    });

    list = tempList


    //score

    tempList = [];
    list.forEach(function (anime) {
        if (anime.score <= filter.maxScore && anime.score >= filter.minScore) {
            tempList.push(anime)
        }
    });
    list = tempList




    //sorting
    //i programed this drunk look over it
    if (document.getElementById("sort").value == "Random") {
        for (let i = list.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [list[i], list[j]] = [list[j], list[i]];
        }
    } else if (document.getElementById("sort").value == "Score") {
        console.log("tste")
        console.log(list[8080])
        console.log(parseFloat(list[0].score))
        bubbleSortAlgo(list)
        
        console.log("sorted")
    }




    //making pages
    for (let i = 0; i < list.length / parseInt(document.getElementById("AmmountPerPage").value); i++) {
        pages.push([]);
        for (let x = 0; x < parseInt(document.getElementById("AmmountPerPage").value); x++) {
            pages[i].push(list[x + (i * parseInt(document.getElementById("AmmountPerPage").value))])
        }
    }






    displayPage(0);
}

function NextPage() {
    if (pages.length > currentPage - 1) {
        currentPage++
        displayPage(currentPage)
        window.scrollTo(0, 0);
    }
}

function PreviousPage() {
    if (0 < currentPage) {
        currentPage--
        displayPage(currentPage)
        window.scrollTo(0, 0);
    }
}