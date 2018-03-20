'use strict';

(function(module) {

    const resetView = () => {
        $('.view').hide();
    };

    const Spot = module.Spot;
    const User = module.User;
    const spotView = module.spotView;
    
    page('*', (ctx, next) => {
        resetView();
        next();
    });

    page('/', () => Spot.fetchAll().then(spotView.initListView));

    page({ hashbang: true });

    User.tryToken();

})(window.module);