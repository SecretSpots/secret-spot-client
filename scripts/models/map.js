'use strict';

(function(module) {

    const Spot = module.Spot;

    const Map = {};

    Map.makeMarkers = () => {
        Spot.fetchAll();

        Spot.all.map( spot => {
            const location = JSON.parse(spot.location);
            const coords = new google.maps.LatLng(location.lat, location.lng);
            const marker = new google.maps.Marker({
                position: coords,
                map: map
            });
        });

    };

    module.Map = Map;

})(window.module);