(function(origin) {
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        var args = [];
        var length = arguments.length;
        for (var i = 0; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        args[1] = '/databp/ajax' + url;
        // call original open method
        return open.apply(this, args);
    }
})
