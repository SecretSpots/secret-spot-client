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
        // if (Map.tempMarker) Map.tempMarker.setMap(null);
    };

    const displayUser = () => {
        if (User.current) {
            page('*', () => page.redirect('/map'));
            $('.login-options').hide();
            $('#add-link').show();
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
            $('.login-options').show();
            $('#add-link').hide();
            page('*', () => page.redirect('/auth/signin'));
        }
    };

    const loadSpots = (ctx, next) => {
        Spot.fetchAll().then(next);
    };

    page('*', (ctx, next) => {
        resetView();

        $('#add-link').off('click');
        if (ctx.pathname === '/map') {
            $('#add-link').on('click', (event)=>{
                event.preventDefault();
                $('#new-spot-view').slideToggle(200);
            });
            if (ctx.querystring === 'add'){
                $('#new-spot-view').slideDown(200);
            }
        } else {
            $('#add-link').on('click', (event) => {
                event.preventDefault();
                page('/map?add');
            });
        }

        displayUser();
        next();
    });
  
    page('/list-view', loadSpots, spotView.initListView);
    page('/auth/signup', loginView.initSignup);
    page('/auth/signin', loginView.initSignin);
    page('/map', loadSpots, mapView.initMapView);
    page('/spots/:id', ctx => Spot.fetchOne(ctx.params.id).then(spotView.initDetailView));
    page('/spots/:id/update', ctx => Spot.fetchOne(ctx.params.id).then(spotView.initUpdateView));
    
    
    page({ hashbang: true });

})(window.module);