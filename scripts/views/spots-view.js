'use strict';

(function(module) {
    
    const Spot = module.Spot;
    
    const listTemplate = Handlebars.compile($('#spot-list-template').html());
    
    const spotView = {};
    
    spotView.showMore = () => {
        $('.hide').hide();
        $('#list-view').on('click', 'a.show-more', function(e) {
            e.preventDefault();
            if ($(this).text() === 'Show More') {
                $(this).parent().find('*').slideDown();
                $(this).html('Show Less');
            } else {
                $(this).html('Show More');
                $(this).parent().find('.hide').slideUp();
            }
        });
    };

    function resetView() {
        $('.view').hide();
    }

    spotView.initListView = () => {
        resetView();
        $('#list-view').show();
        $('#list-view').empty();
        spotView.loadSpots();
        spotView.showMore();
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
                    name: $('input[name=name]').val(),
                    user_id: $('input[name=user_id]').val(),
                    address: $('input[name=address]').val(),
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