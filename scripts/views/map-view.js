'use strict';

(function(module) {

    const Map = module.Map;
    const Spot = module.Spot;

    const mapView = {};
    let infowindow = null; //define in outer scope to avoid duplicates

    mapView.initMapView = () => {
        makeMarkers(Spot.all);
        $('#map-view').show();
    };

    const makeMarkers = (data) => {
        if (infowindow === null) infowindow = new google.maps.InfoWindow();
        
        return data.forEach( spot => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(spot.lat, spot.lng),
                map: Map.mapObject
            });

            const contentString = `<h4>${spot.name}</h4><a href="/spots/${spot.spot_id}">Details</a>`;

            marker.addListener('click', function () {
                infowindow.setContent(contentString);
                infowindow.open(Map.mapObject, marker);
            });


        });};
    module.mapView = mapView;

})(window.module);