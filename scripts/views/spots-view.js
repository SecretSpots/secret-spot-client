'use strict';

(function(module) {
    
    const Spot = module.Spot;
    
    const listTemplate = Handlebars.compile($('#spot-list-template').html());

    const detailViewTemplate = Handlebars.compile($('#detail-view-template').html());

    const spotView = {};
    
    spotView.showMore = () => {
        $('.hide').slideUp(0);
        $('#list-view').off('click', 'a.show-more');
        $('#list-view').on('click', 'a.show-more', function(e) {
            e.preventDefault();
            if ($(this).text() === 'Show More') {
                $(this).parent().find('*').slideDown(200);
                $(this).html('Show Less');
            } else {
                $(this).html('Show More');
                $(this).parent().find('.hide').slideUp(200);
            }
        });
    };

    function resetView() {
        $('.view').fadeOut();
    }

    spotView.initListView = () => {
        resetView();
        $('#list-view').fadeIn();
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

    spotView.initDetailView = () => {
        resetView();

        const html = detailViewTemplate(Spot.detail);

        $('#detail-view')
            .empty()
            .append(html)
            .fadeIn();

        $('#delete-spot').off('click').on('click', () => {
            Spot.delete(Spot.detail.spot_id)
                .then(response => {
                    console.log(response);
                    page('/list-view');
                })
                .catch(err => {
                    $('#delete-status').text(err.responseJSON.error).fadeIn();
                });
        });

    };

    module.spotView = spotView;

})(window.module);