'use strict';

(function(module) {

    const resetView = () => {
        $('.view').hide();
    };

    const Spot = module.Spot;
    const User = module.User;
    const spotView = module.spotView;
    const loginView = module.loginView;
    
    page('*', (ctx, next) => {
        resetView();
        next();
    });

    page('/', () => Spot.fetchAll().then(spotView.initListView));
    page('/auth/signup', loginView.initSignup);
    page('/auth/signin', loginView.initSignin);

    page({ hashbang: true });

    User.tryToken();

})(window.module);