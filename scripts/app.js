'use strict';

(function(module) {
    const Map = module.Map;
    const mapView = module.mapView;
    const Spot = module.Spot;
    const spotView = module.spotView;

    page('/', () => Spot.fetchAll().then(spotView.initListView));

    page('/map', () => mapView.initMapView);

    page({ hashbang: true });

})(window.module);