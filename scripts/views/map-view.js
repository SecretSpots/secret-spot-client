'use strict';

(function(module) {

    const Map = module.Map;
    const Spot = module.Spot;

    const mapView = {};
    let infowindow = null; //define in outer scope to avoid duplicates
    let markersAll = [];

    mapView.initMapView = () => {
        setMarkers(null, markersAll);
        markersAll = [];
        makeMarkers(Spot.all);
        setMarkers(Map.mapObject, markersAll);
        $('#map-view').show();
    };

    const makeMarkers = (data) => {
        data.forEach( spot => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(spot.lat, spot.lng),
                name: spot.name,
                id: spot.spot_id
            });

            markersAll.push(marker);
        });
    };

    const setMarkers = (map, markers) => {

        markers.forEach( marker => {
            if (infowindow === null) infowindow = new google.maps.InfoWindow();

            const contentString = `<h4>${marker.name}</h4><a href="/spots/${marker.id}">Details</a>`;
            
            marker.setMap(map);

            marker.addListener('click', function () {
                infowindow.setContent(contentString);
                infowindow.open(Map.mapObject, marker);
            });

        });
    };

    module.mapView = mapView;

})(window.module);