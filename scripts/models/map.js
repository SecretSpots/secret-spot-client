'use strict';

(function(module) {

    // const Spot = module.Spot;

    const Map = {};

    Map.markers = [];

    Map.mapObject = null;

    Map.initMap = () => {
        const center = { lat: 45.519900, lng: -122.678316 };
        Map.mapObject = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: center
        });
    };

    module.Map = Map;

})(window.module);