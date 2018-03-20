'use strict';

(function(module) {

    function Location(data) {
        Object.keys(data).map(key => this[key] = data[key]);
    }

    Location.all = [];

    module.Location = Location;

})(window.module);