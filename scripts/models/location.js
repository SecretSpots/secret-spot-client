'use strict';

(function(module) {

    const Location = module.Location;

    function Location(data) {
        Object.keys(data).map(key => this[key] = data[key]);
    }

    Location.all = [];

    module.Location = Location;

})(window.module);