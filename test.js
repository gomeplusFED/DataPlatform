var util = require("./utils");

console.log(util.mergeCell([{
    a : 1,
    b : 2
}, {
    a : 2,
    b : 2
}, {
    a : 2,
    b : 2
}, {
    a : 3,
    b : 2
}], ["a", "b"]));