'use strict';

(function(module) {
    
    const User = module.User;
    const Spot = module.Spot;
    
    const listTemplate = Handlebars.compile($('#spot-list-template').html());

    const detailViewTemplate = Handlebars.compile($('#detail-view-template').html());

    const updateViewTemplate = Handlebars.compile($('#update-view-template').html());

    const spotView = {};
    
    spotView.showMore = () => {
        $('.hide').slideUp(0);
        $('.editing-buttons, .voting-buttons').hide();
        $('#list-view').off('click', 'a.show-more');
        $('#list-view').on('click', 'a.show-more', function(e) {
            e.preventDefault();
            if ($(this).text() === 'Show More') {
                if(User.name === $(this).data('username')) {
                    $(this).parent().find('.voting-buttons').hide();
                    $(this).parent().find('.editing-buttons').show();
                } else {
                    $(this).parent().find('.voting-buttons').show();
                    $(this).parent().find('.editing-buttons').hide();
                }
                $(this).parent().find('.hide').slideDown(200);
                $(this).html('Show Less');
            } else {
                $(this).html('Show More');
                $(this).parent().find('.hide').slideUp(200);
                $(this).parent().find('.editing-buttons, .voting-buttons').hide();
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

        $('#list-view')
            .off('click', '.list-delete-spot')
            .on('click', '.list-delete-spot', function() {
                Spot.delete($(this).data('spot-id'))
                    .then(response => {
                        console.log(response);
                        page('/list-view');
                    })
                    .catch(err => {
                        $('#delete-status').text(err.responseJSON.error).fadeIn();
                    });
            });
    };

    spotView.loadSpots = () => {
        Spot.all.forEach(spot => {
            const html = listTemplate(spot);
            $('#list-view').append(html);
        });
    };

    spotView.initUpdateView = () => {
        const spot = Spot.detail;
        const html = updateViewTemplate(spot);

        $('#update-view')
            .empty()
            .append(html)
            .fadeIn();

        if (User.name === spot.username) {
            $('#update-spot-form')
                .off('submit')
                .on('submit', event => {
                    event.preventDefault();
    
                    const data = {
                        note: $('textarea[name=note]').val(),
                        spot_id: spot.spot_id
                    };
    
                    Spot.update(data)
                        .then( () => {
                            $('#add-spot')[0].reset();
                            page(`/spots/${spot.spot_id}`);
                        })
                        .catch(console.error);
                });
        } else {
            $('#update-spot').hide();
        }

    };
            
    spotView.initDetailView = () => {
        resetView();

        const html = detailViewTemplate(Spot.detail);

        $('#detail-view')
            .empty()
            .append(html)
            .fadeIn();

        if (User.name === Spot.detail.username) {
            $('#delete-spot')
                .show()
                .off('click')
                .on('click', () => {
                    Spot.delete(Spot.detail.spot_id)
                        .then(response => {
                            console.log(response);
                            page('/map');
                        })
                        .catch(err => {
                            $('#delete-status').text(err.responseJSON.error).fadeIn();
                        });
                });
        } else {
            $('#delete-spot').hide();
            $('#update-spot').hide();
        }

    };

    module.spotView = spotView;

})(window.module);