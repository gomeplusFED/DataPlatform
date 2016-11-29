var utils = {};

utils.strToDom = function(str) {
	var obj = document.createElement('div');
	obj.innerHTML = str;
	return obj.childNodes[0];
};


utils.observeDOMInserted = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
        eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                if( mutations[0].addedNodes.length) {
                    callback(mutations);
                }
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
        else if( eventListenerSupported ){
            obj.addEventListener('DOMNodeInserted', callback, false);
        }
    }
})();

module.exports = utils;
