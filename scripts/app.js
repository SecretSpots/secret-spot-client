'use strict';

(function(module) {
    const Map = module.Map;
    const mapView = module.mapView;
    const Spot = module.Spot;
    const spotView = module.spotView;

    const resetView = () => {
        $('.view').hide();
    };

    page('*', (ctx, next) => {
        resetView();
        next();
    });

    page('/', () => Spot.fetchAll().then(spotView.initListView));

    page('/map', () => mapView.initMapView());

    page({ hashbang: true });

})(window.module);