'use strict';

(function(module) {

    const Spot = module.Spot;

    const listTemplate = Handlebars.compile($('#spot-list-template').html());

    const spotView = {};

    spotView.initListView = () => {
        spotView.loadSpots();
    };

    spotView.loadSpots = () => {
        Spot.all.forEach(spot => {
            const html = listTemplate(spot);
            $('#list-view').append(html);
        });
    };

    module.spotView = spotView;

})(window.module);