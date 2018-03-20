'use strict';

(function(module) {
    const Spot = module.Spot;
    const spotView = module.spotView;

    const resetView = () => {
        $('.view').hide();
    };

    page('*', (ctx, next) => {
        resetView();
        next();
    });

    page('/list-view', () => Spot.fetchAll().then(spotView.initListView));


    page('/spots/new', spotView.initNewSpot);

    page('*', () => page.redirect('/list-view'));

    page({ hashbang: true });

})(window.module);