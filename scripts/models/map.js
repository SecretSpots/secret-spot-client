'use strict';

(function(module) {

    const Location = module.Location;

    function Map(data) {
        Object.keys(data).map(key => this[key] = data[key]);
    }

    Map.fetchAll = function() {
        $.getJSON(`${API_URL}/spots`) //eslint-disable-line
            .then(data => {
                Location.all = data.map(each => new Location(each));
            });
    };

    Map.makeMarkers = function(data) {

        Location.all.map( spot => {
            const coords = new google.maps.LatLng(spot.location[0], spot.location[1]);
            const marker = new google.maps.Marker({
                position: coords,
                map: map
            });
        });

    };

    module.Map = Map;

})(window.module);