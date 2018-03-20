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

    page('*', (ctx, next) => {
        resetView();
        next();
    });
    page('/', () => Spot.fetchAll().then(spotView.initListView));
    page('/list-view', () => Spot.fetchAll().then(spotView.initListView));
    page('/spots/new', spotView.initNewSpot);
    page('/auth/signup', loginView.initSignup);
    page('/auth/signin', loginView.initSignin);
    page('/map', () => mapView.initMapView());
    
    page('*', () => page.redirect('/list-view'));
    
    
    page({ hashbang: true });

    User.tryToken();

})(window.module);