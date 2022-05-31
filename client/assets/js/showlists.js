
window.onload = (event) => {

    


    socket.emit('listGenre', null); 
               
    socket.on('listGenreReply', function(lists) {
        

        for(let i = 0; i < lists.length;i++){
            var html = "";
            
            html += "<div class=\"ShowLists\"> <h1>" + lists[i].genre +"</h1> <div class=\"ShowList\">";

            for(let x = 0; x < lists[i].list.length;x++){
                html += "<div class=\"Show\"><a href=\"anime/"+ lists[i].list[x].nameNoSpace +"\"><img src=\""+ lists[i].list[x].thumb +"\"/>" + "<h6>" + lists[i].list[x].name +"</h6></a></div>";
            }

            html += "</div></div>"
            document.getElementById("ShowLists").innerHTML += html;
        }
    });

};


