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
        $('#list-view button').hide();
        $('#list-view').off('click', 'a.show-more');
        $('#list-view').on('click', 'a.show-more', function(e) {
            e.preventDefault();
            if ($(this).text() === 'Show More') {
                if(User.name === $(this).data('username')) {
                    $(this).parent().find('button').show();
                } else {
                    $(this).parent().find('button').hide();
                }
                $(this).parent().find('.hide').slideDown(200);
                $(this).html('Show Less');
            } else {
                $(this).html('Show More');
                $(this).parent().find('.hide').slideUp(200);
                $('#list-view button').hide();
            }
        });
    };
    
    function resetView() {
        $('.view').fadeOut();
    }
    
    spotView.populateFilter = () => {
        if (User.current) {
            console.log('hello', User.name);
            spotView.filterHandler();
        }
        else {
            $('#filter').hide();
        }
    };

    spotView.filterHandler = () => {
        $('input:checkbox').change(
            function(){
                if ($(this).is(':checked')) {
                    alert('checked');
                    $('.spot').hide();
                    $(`.${User.name}`).show();
                }
            });
    };
    
    spotView.initListView = () => {
        resetView();
        $('#list-view').fadeIn();
        $('.spot').empty();
        spotView.loadSpots();
        spotView.showMore();
        spotView.populateFilter();
        
        $('.list-delete-spot')
            .off('click')
            .on('click', function() {
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