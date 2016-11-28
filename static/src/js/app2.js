let Vue = require("Vue2");
let $ = require("jQuery");

$(function() {
    $('#side-menu').metisMenu();
});

new Vue({
    el : "#addMoudle",
    data : {
        message : "hello world"
    },
    methods : {
        gg(){
            alert(1234);
        }
    }
})