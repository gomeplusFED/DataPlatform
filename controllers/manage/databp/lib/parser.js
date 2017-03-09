/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */

function parse(rawcookie) {
    if (typeof rawcookie === 'string') {
        return _parse(rawcookie);
    } else if (Array.isArray(rawcookie)) {
        return rawcookie.reduce((accu, cur) => {
            return accu.concat(_parse(cur));
        }, []);
    }
}

function parseKey(rawcookie) {
    if (typeof rawcookie === 'string') {
        return _parseKey(rawcookie);
    } else if (Array.isArray(rawcookie)) {
        return rawcookie.reduce((accu, cur) => {
            return accu.concat(_parseKey(cur));
        }, []);
    }
}



var pairSplitRegExp = /; */;
var filterRegExp = /(path|domain|expires|httpOnly|secure|max-age)\s*=/i;

function _parse(str, storeKey = false) {
    if (typeof str !== 'string') {
        throw new TypeError('argument str must be a string');
    }

    var obj = {};
    var pairs = str.split(pairSplitRegExp).filter((x) => !filterRegExp.test(x));

    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i];
        var eq_idx = pair.indexOf('=');
        if (eq_idx < 0) {
            continue;
        }
        var key = pair.substr(0, eq_idx).trim();
        if (undefined == obj[key]) {
            obj[key] = storeKey ? key : pair;
        }
    }
    return Object.values(obj);
}

let escapeRegExp = (function () {
    let matchRegex = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;
    return function (str) {
        return str.replace(matchRegex, "\\$&");
    }
})();


function _parseKey(str) {
    return _parse(str, true).map(x => escapeRegExp(x));
}

module.exports = function (cookie, keyOnly = false) {
    if (keyOnly) {
        return parseKey(cookie);
    } else {
        return parse(cookie);
    }
};