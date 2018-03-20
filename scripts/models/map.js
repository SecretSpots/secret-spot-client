'use strict';

(function(module) {

    function Map(data) {
        Object.keys(data).map(key => this[key] = data[key]);
    }

    Map.all = [];
    const locations = []

    
    module.Map = Map;

})(window.module);