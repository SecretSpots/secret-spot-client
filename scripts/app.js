'use strict';

(function(module) {

    const resetView = () => {
        $('.view').hide();
    };

    const Map = module.Map;
    const mapView = module.mapView;
    const Spot = module.Spot;
    const User = module.User;
    const spotView = module.spotView;
    const loginView = module.loginView;

    const loadSpots = (ctx, next) => {
        Spot.fetchAll().then(next);
    };

    page('*', (ctx, next) => {
        resetView();
        next();
    });
    page('/', loadSpots, spotView.initListView);
    page('/list-view', loadSpots, spotView.initListView);
    page('/spots/new', spotView.initNewSpot);
    page('/auth/signup', loginView.initSignup);
    page('/auth/signin', loginView.initSignin);
    page('/map', loadSpots, mapView.initMapView);

    page('*', () => page.redirect('/list-view'));


    page({ hashbang: true });

    User.tryToken();

})(window.module);