'use strict';

(function(module) {
    const Spot = module.Spot;
    const spotView = module.spotView;

    page('/', () => Spot.fetchAll().then(spotView.initListView));

    page({ hashbang: true });

})(window.module);