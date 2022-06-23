var fs = require("fs");
const compressing = require('compressing');
//https://www.npmjs.com/package/compressing

if (!fs.existsSync("./logs")){
    fs.mkdirSync("./logs");
}

//24 hour interval
//ToDO
//Log compretion
setInterval(() => {
    fs.readdir("./logs/", (err, files) => {
        var date = new Date();
        // files object contains all files names
        // log them on console
        files.forEach(file => {
            if(!(file.indexOf("zip") > 0) && !(file.indexOf(date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear())  > -1)){
                compressing.zip.compressFile("./logs/" + file, "./logs/" + file + ".zip").then(() => {
                    fs.unlink("./logs/" + file, () => {});
                });
            }
        });

        module.exports("Compressing Logs",files);
    });    
},(1000 * 60 * 60 * 12));




module.exports = function(name,obj){

    var date = new Date();

    console.log(date.toString() + " : " + name);
    
    var log = "\n\nLog:"+name+"\tTime:"+date.toString()+"\n"+JSON.stringify(obj)+
    "\n-----------------------------------------------------------------------";

    var date = new Date(Date.now())
    fs.writeFileSync( "./logs/" + date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear() + ".log", log,{flag:"a+"});
    
};