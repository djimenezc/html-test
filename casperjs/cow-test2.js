
var require = patchRequire(global.require);

//var Cow = require('./cow2');

// cow-test.js
casper.test.begin('Cow can moo', 2, {
    setUp: function(test) {
        this.cow = new Cow();
    },

    tearDown: function(test) {
        this.cow.destroy();
    },

    test: function(test) {
        test.assertEquals(this.cow.moo(), 'moo!');
        test.assert(this.cow.mowed);
        test.done();
    }
});
