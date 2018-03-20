'use strict';

(function(module) {

    const Spot = module.Spot;

    const listTemplate = Handlebars.compile($('#spot-list-template').html());

    const spotView = {};

    function resetView() {
        $('.view').hide();
    }

    spotView.initListView = () => {
        resetView();
        $('#list-view').show();
        $('#list-view').empty();
        spotView.loadSpots();
    };

    spotView.loadSpots = () => {
        Spot.all.forEach(spot => {
            const html = listTemplate(spot);
            $('#list-view').append(html);
        });
    };

    spotView.initNewSpot = () => {
        resetView();
        $('#new-spot-view').show();

        $('#add-spot')
            .off('submit')
            .on('submit', event => {
                event.preventDefault();

                const data = {
                    spot_id: $('input[name=spot_id]').val(),
                    name: $('input[name=name]').val(),
                    user_id: $('input[name=user_id]').val(),
                    location: $('input[name=location]').val(),
                    note: $('input[name=note]').val(),
                    date: $('input[name=date]').val()
                };

                Spot.create(data)
                    .then( () => {
                        $('#add-spot')[0].reset();
                        page(`/list-view`);
                    })
                    .catch(console.error);
            });
    };

    module.spotView = spotView;

})(window.module);