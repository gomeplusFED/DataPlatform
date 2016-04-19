var webpack = require('webpack');


var rd = require('rd');

var files = rd.readFileFilterSync('./',function(filename){
	if(filename.match(/node_modules|static|\.git|\.idea|doc|\.gitignore|package.json|webpack/) === null && filename.match(/\.js|\.json/) ){
		return true;
	}
})


var pwd = __dirname;

var entry = {};
files.forEach(function(item){
	var filename = item.replace(pwd,'/lib').replace(/\\/g,'/').replace(/\.js/g,'');
	entry[filename] = item.replace(pwd,'.').replace(/\\/g,'/');
})

 console.log(entry);

var webpackConfig = {
	entry: entry,
	output: {
        filename: '[name].js'
    },
}


module.exports = webpackConfig;