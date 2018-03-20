'use strict';

(function(module) {

    const Map = module.Map;
    const Spot = module.Spot;

    const mapView = {};

    mapView.initMapView = () => {
        makeMarkers();
        $('#map-view').show();
    };

    const makeMarkers = () => {
        return Spot.all.forEach( spot => {
            new google.maps.Marker({
                position: new google.maps.LatLng(spot.lat, spot.lng),
                map: Map.mapObject
            });
        });
    };
    module.mapView = mapView;

})(window.module);