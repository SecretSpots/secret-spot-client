'use strict';

(function(module) {

    const mapView = {};

    mapView.initMapView = () => {
        const center = { lat: 45.519900, lng: -122.678316 };
        const map = new google.maps.Map(document.getElementById('map'), {
            zoom: 4,
            center: center
        });
    };

    module.mapView = mapView;

})(window.module);