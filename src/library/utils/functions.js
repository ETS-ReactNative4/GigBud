// export String.prototype.format = function() {
//     a = this;
//     for(k in arguments) {
//         a = a.replace('{' + k + '}', arguments[k]);
//     }
//     return a;
// }

export function UrlFormat(b) {
    var a = arguments;
    return b.replace(/(\{\{\d\}\}|\{\d\})/g, function (b) {
        if (b.substring(0, 2) == "{{") return b;
        var c = parseInt(b.match(/\d/)[0]);
        return a[c + 1]
    })
};
