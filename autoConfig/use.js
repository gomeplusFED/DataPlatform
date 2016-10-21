var hello = require("./hello.js");

hello.what = "abc";
hello.do();


var hello2 = JSON.stringify(hello);

const fs = require("fs");

/*var source = fs.createWriteStream("./hello.js");

source.write(hello2)*/


fs.open("./hello.js" , "r+" , function(err , fb){
    console.log(fb);
});