'use strict';

(function(module) {

    // const Map = module.Map;

    const mapView = {};

    let map = null;

    mapView.initMap = () => {
        const center = { lat: 45.519900, lng: -122.678316 };
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: center
        });
        const marker = new google.maps.Marker({
            position: center,
            map: map
        });
    };

    mapView.initMapView = () => {

        $('#map-view').show();

    };

    module.mapView = mapView;

})(window.module);