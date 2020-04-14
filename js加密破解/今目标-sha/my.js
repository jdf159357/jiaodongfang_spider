navigator = {}

var utils = {
expand: function(obj) {
    for (var i in obj) this[i] = obj[i]
},
arraySortResult: function(result) {
    return result ? 1 : -1
},
trim: function(str) {
    return str.replace(/^\s*|\s*$/, "")
},
browser: {
    isIe: /msie|Trident/gi.test(navigator.userAgent)
},
isNullObject: function(obj) {
    var isNull = !0;
    for (var i in obj) obj.hasOwnProperty(i) && (isNull = !1);
    return isNull
},
cssSupport: function(type) {
    return {
        calc: function() {
            var el = document.createElement("div");
            return el.style.cssText = "width:" + ["-webkit-", "-moz-", "-ms-", "", ""].join("calc(10px);width:"),
            !!el.style.length
        },
        transition: function() {
            for (var el = document.createElement("div"), prefix = ["transition", "mozTransition", "msTransition", "webkitTransition"], result = !1, i = 0, len = prefix.length; i < len; i++) if (prefix[i] in el.style) {
                result = !0;
                break
            }
            return result
        }
    } [type]()
},
getCss3Prefix: function(css) {
    for (var el = document.createElement("div"), cssUpper = css.toUpperCase(), prefix = [css, "moz" + cssUpper, "ms" + cssUpper, "webkit" + cssUpper], i = 0, len = prefix.length; i < len; i++) if (prefix[i] in el.style) return prefix[i];
    return css
},
create_object: function(obj) {
    function f() {}
    return void 0 === Object.create ? (f.prototype = obj, new f) : Object.create(obj)
},
remove_htmltag: function(html) {
    var div = document.createElement("div");
    return div.innerHTML = html,
    $(div).text()
},
copy_object: function(obj) {
    return JSON.parse(JSON.stringify(obj))
},
get_obj_type: function(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
},
getObjType: function(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()
},
htmlEncode: function(text) {
    return text.replace(/&/g, "&amp").replace(/\"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
},
htmlDecode: function(text) {
    return text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">")
},
loadTtpl: function(text) {
    text = text.toString();
    var startIndex = text.indexOf("/*loadText*"),
    endIndex = text.indexOf("loadTextEnd*/");
    text = text.substring(startIndex + 11, endIndex);
    for (var targets = text.split(/<!--\s?target/g), i = 0, len = targets.length; i < len; i++) {
        var target = targets[i],
        lastIndex = target.indexOf("--\x3e");
        if ( - 1 != lastIndex && /^\s*:/.test(target)) {
            var targetName = target.substring(0, lastIndex).replace(/^\s*|\s*$/g, "").substring(1),
            tplString = target.substring(lastIndex + 3),
            script = document.createElement("script");
            script.type = "text/ng-template",
            script.id = targetName.replace(/^\s*|\s*$/g, ""),
            script.text = tplString,
            document.getElementsByTagName("head")[0].appendChild(script)
        }
    }
},
load_css: function(css_func) {
    var text = css_func.toString(),
    startIndex = text.indexOf("/*loadText*"),
    endIndex = text.indexOf("loadTextEnd*/");
    text = text.substring(startIndex + 11, endIndex);
    var style = document.createElement("style");
    style.type = "text/css",
    style.styleSheet ? style.styleSheet.cssText = text: style.innerHTML = text,
    document.getElementsByTagName("HEAD")[0].appendChild(style)
}
},
Base64 = {
_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
encode: function(input) {
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4, output = "",
    i = 0;
    for (input = Base64._utf8_encode(input); i < input.length;) chr1 = input.charCodeAt(i++),
    chr2 = input.charCodeAt(i++),
    chr3 = input.charCodeAt(i++),
    enc1 = chr1 >> 2,
    enc2 = (3 & chr1) << 4 | chr2 >> 4,
    enc3 = (15 & chr2) << 2 | chr3 >> 6,
    enc4 = 63 & chr3,
    isNaN(chr2) ? enc3 = enc4 = 64 : isNaN(chr3) && (enc4 = 64),
    output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
    return output
},
decode: function(input) {
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4, output = "",
    i = 0;
    for (input = input.replace(/[^A-Za-z0-9\+\/\=]/g, ""); i < input.length;) enc1 = this._keyStr.indexOf(input.charAt(i++)),
    enc2 = this._keyStr.indexOf(input.charAt(i++)),
    enc3 = this._keyStr.indexOf(input.charAt(i++)),
    enc4 = this._keyStr.indexOf(input.charAt(i++)),
    chr1 = enc1 << 2 | enc2 >> 4,
    chr2 = (15 & enc2) << 4 | enc3 >> 2,
    chr3 = (3 & enc3) << 6 | enc4,
    output += String.fromCharCode(chr1),
    64 != enc3 && (output += String.fromCharCode(chr2)),
    64 != enc4 && (output += String.fromCharCode(chr3));
    return output = Base64._utf8_decode(output)
},
_utf8_encode: function(string) {
    string = string.replace(/\r\n/g, "\n");
    for (var utftext = "",
    n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        c < 128 ? utftext += String.fromCharCode(c) : c > 127 && c < 2048 ? (utftext += String.fromCharCode(c >> 6 | 192), utftext += String.fromCharCode(63 & c | 128)) : (utftext += String.fromCharCode(c >> 12 | 224), utftext += String.fromCharCode(c >> 6 & 63 | 128), utftext += String.fromCharCode(63 & c | 128))
    }
    return utftext
},
_utf8_decode: function(utftext) {
    for (var string = "",
    i = 0,
    c = c1 = c2 = 0; i < utftext.length;) c = utftext.charCodeAt(i),
    c < 128 ? (string += String.fromCharCode(c), i++) : c > 191 && c < 224 ? (c2 = utftext.charCodeAt(i + 1), string += String.fromCharCode((31 & c) << 6 | 63 & c2), i += 2) : (c2 = utftext.charCodeAt(i + 1), c3 = utftext.charCodeAt(i + 2), string += String.fromCharCode((15 & c) << 12 | (63 & c2) << 6 | 63 & c3), i += 3);
    return string
}
},
jsonBase64 = {
toBase64: function(json) {
    return Base64.encode(JSON.stringify(json))
},
toJson: function(base64) {
    return JSON.parse(window.atob(base64))
}
},
sha1 = function() {
var rotateLeft = function(lValue, iShiftBits) {
    return lValue << iShiftBits | lValue >>> 32 - iShiftBits
},
cvtHex = function(value) {
    var i, v, string = "";
    for (i = 7; i >= 0; i--) v = value >>> 4 * i & 15,
    string += v.toString(16);
    return string
},
uTF8Encode = function(string) {
    string = string.replace(/\x0d\x0a/g, "\n");
    for (var output = "",
    n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        c < 128 ? output += String.fromCharCode(c) : c > 127 && c < 2048 ? (output += String.fromCharCode(c >> 6 | 192), output += String.fromCharCode(63 & c | 128)) : (output += String.fromCharCode(c >> 12 | 224), output += String.fromCharCode(c >> 6 & 63 | 128), output += String.fromCharCode(63 & c | 128))
    }
    return output
};
return function(string) {
    var blockstart, i, j, A, B, C, D, E, tempValue, W = new Array(80),
    H0 = 1732584193,
    H1 = 4023233417,
    H2 = 2562383102,
    H3 = 271733878,
    H4 = 3285377520;
    string = uTF8Encode(string);
    var stringLength = string.length,
    wordArray = new Array;
    for (i = 0; i < stringLength - 3; i += 4) j = string.charCodeAt(i) << 24 | string.charCodeAt(i + 1) << 16 | string.charCodeAt(i + 2) << 8 | string.charCodeAt(i + 3),
    wordArray.push(j);
    switch (stringLength % 4) {
    case 0:
        i = 2147483648;
        break;
    case 1:
        i = string.charCodeAt(stringLength - 1) << 24 | 8388608;
        break;
    case 2:
        i = string.charCodeAt(stringLength - 2) << 24 | string.charCodeAt(stringLength - 1) << 16 | 32768;
        break;
    case 3:
        i = string.charCodeAt(stringLength - 3) << 24 | string.charCodeAt(stringLength - 2) << 16 | string.charCodeAt(stringLength - 1) << 8 | 128
    }
    for (wordArray.push(i); wordArray.length % 16 != 14;) wordArray.push(0);
    for (wordArray.push(stringLength >>> 29), wordArray.push(stringLength << 3 & 4294967295), blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
        for (i = 0; i < 16; i++) W[i] = wordArray[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        for (A = H0, B = H1, C = H2, D = H3, E = H4, i = 0; i <= 19; i++) tempValue = rotateLeft(A, 5) + (B & C | ~B & D) + E + W[i] + 1518500249 & 4294967295,
        E = D,
        D = C,
        C = rotateLeft(B, 30),
        B = A,
        A = tempValue;
        for (i = 20; i <= 39; i++) tempValue = rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 1859775393 & 4294967295,
        E = D,
        D = C,
        C = rotateLeft(B, 30),
        B = A,
        A = tempValue;
        for (i = 40; i <= 59; i++) tempValue = rotateLeft(A, 5) + (B & C | B & D | C & D) + E + W[i] + 2400959708 & 4294967295,
        E = D,
        D = C,
        C = rotateLeft(B, 30),
        B = A,
        A = tempValue;
        for (i = 60; i <= 79; i++) tempValue = rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 3395469782 & 4294967295,
        E = D,
        D = C,
        C = rotateLeft(B, 30),
        B = A,
        A = tempValue;
        H0 = H0 + A & 4294967295,
        H1 = H1 + B & 4294967295,
        H2 = H2 + C & 4294967295,
        H3 = H3 + D & 4294967295,
        H4 = H4 + E & 4294967295
    }
    var tempValue = cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4);
    return tempValue.toLowerCase()
}
} (),
Cookie = {
getItem: function(name) {
    var cookieEnd, cookieName = encodeURIComponent(name) + "=",
    cookieStart = document.cookie.indexOf(cookieName),
    cookieValue = null;
    return cookieStart > -1 && (cookieEnd = document.cookie.indexOf(";", cookieStart), -1 == cookieEnd && (cookieEnd = document.cookie.length), cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))),
    cookieValue
},
setItem: function(name, value, time) {
    var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value) + "; path=/",
    date = new Date;
    void 0 != time && (date.setTime(date.getTime() + time), cookieText += "; expires=" + date.toGMTString()),
    document.cookie = cookieText
},
removeItem: function(name) {
    this.setItem(name, "", -24e4)
}
},
Storage = function() {
if ("undefined" != typeof sessionStorage) try {
    sessionStorage.setItem("test", "123");
    var _cookie = sessionStorage;
    sessionStorage.removeItem("test")
} catch(e) {
    var _cookie = Cookie
} else var _cookie = Cookie;
return {
    setItem: function(key, value) {
        if ("string" == typeof key) _cookie.setItem(key, value);
        else for (var i in key) _cookie.setItem(i, key[i])
    },
    getItem: function(key) {
        return _cookie.getItem(key)
    },
    removeItem: function(key) {
        if ("string" == typeof key) _cookie.removeItem(key);
        else for (var i = 0,
        len = key.length; i < len; i++) _cookie.removeItem(key[i])
    }
}
} ();