'use strict';

(function(module) {

    const mapView = module.mapView;
    const Spot = module.Spot;
    const User = module.User;
    const spotView = module.spotView;
    const loginView = module.loginView;
    
    User.tryToken();

    const resetView = () => {
        $('.view').hide();
    };

    const displayUser = () => {
        if (User.current) {
            $('#current-username').text(User.name).fadeIn();
            $('#logout')
                .fadeIn()
                .off('click')
                .on('click', () => {
                    User.logout();
                    page('/auth/signin');
                });
        } else {
            $('#current-username').empty().hide();
            $('#logout').hide();
        }
    };

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
    page('/spots/:id/update', ctx => Spot.fetchOne(ctx.params.id).then(spotView.initUpdateView));
    page('*', () => page.redirect('/map'));
    
    
    page({ hashbang: true });

})(window.module);