'use strict';

(function(module) {

    const resetView = () => {
        $('.view').hide();
    };

    const Spot = module.Spot;
    const spotView = module.spotView;
    
    page('*', (ctx, next) => {
        resetView();
        next();
    });
    
    page('/', () => Spot.fetchAll().then(spotView.initListView));

    page({ hashbang: true });

})(window.module);