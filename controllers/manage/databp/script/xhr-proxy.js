(function() {
    var open = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        // var oldReady;
        // if (async) {   
        //     oldReady = this.onreadystatechange;
        //     // override onReadyStateChange
        //     this.onreadystatechange = function() {
        //         if (this.readyState == 4) {
        //             // this.responseText is the ajax result
        //             // create a dummay ajax object so we can modify responseText
        //             var self = this;
        //             var dummy = {};
        //             ["statusText", "status", "readyState", "responseType"].forEach(function(item) {
        //                 dummy[item] = self[item];
        //             });
        //             dummy.responseText = '{"msg": "Hello"}';
        //             return oldReady.call(dummy);
        //         } else {
        //             // call original onreadystatechange handler
        //             return oldReady.apply(this, arguments);
        //         }
        //     }
        // }
        console.log(url);
        // call original open method
        return open.apply(this, arguments);
    }

})();