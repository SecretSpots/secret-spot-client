'use strict';

(function(module) {

    const resetView = () => {
        $('.view').hide();
    };

    const displayUser = () => {
        if (localStorage.getItem('username')) {
            User.current = true;
            const username = localStorage.getItem('username');
            $('#current-username').text(username).fadeIn();
            $('#logout')
                .fadeIn()
                .off('click')
                .on('click', () => {
                    User.logout();
                    page('/auth/signin');
                });
        } else {
            User.current = false;
            $('#current-username').empty().hide();
            $('#logout').hide();
        }
    };

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
        displayUser();
        next();
    });
  
    page('/list-view', loadSpots, spotView.initListView);
    page('/spots/new', spotView.initNewSpot);
    page('/auth/signup', loginView.initSignup);
    page('/auth/signin', loginView.initSignin);
    page('/map', loadSpots, mapView.initMapView);
    page('/spots/:id', ctx => Spot.fetchOne(ctx.params.id).then(spotView.initDetailView));
    page('*', () => page.redirect('/list-view'));
    
    
    page({ hashbang: true });

    User.tryToken();

})(window.module);