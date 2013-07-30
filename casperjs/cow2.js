//var require = patchRequire(require);

var require = patchRequire(global.require);

// now you're ready to go
var utils = require('utils');
var magic = 42;
function Cow() {
    this.mowed = false;
    this.moo = function moo() {
        this.mowed = true; // mootable state: don't do that at home
        return 'moo!';
    };
}
