'use strict';

(function(module) {

    const Location = module.Location;

    function Map(data) {
        Object.keys(data).map(key => this[key] = data[key]);
    }

    Map.allMarkers = [];

    Map.fetchAll = function() {
        $.getJSON(`${API_URL}/spots`) //eslint-disable-line
            .then(data => {
                Location.all = data.map(each => new Location(each));
            });
    };

    Map.makeMarkers = function(data) {
        
    };

    
    module.Map = Map;

})(window.module);