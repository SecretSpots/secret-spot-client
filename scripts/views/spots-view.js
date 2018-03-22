'use strict';

(function(module) {
    
    const User = module.User;
    const Spot = module.Spot;
    
    const listTemplate = Handlebars.compile($('#spot-list-template').html());
    const detailViewTemplate = Handlebars.compile($('#detail-view-template').html());
    const updateViewTemplate = Handlebars.compile($('#update-view-template').html());
    const beenHereTemplate = Handlebars.compile($('#been-here-template').html());

    const spotView = {};

    // const cleanDivs = () => {
    //     if( $('.spot').is(':empty') ) {
    //         console.log('empty div');
    //     }
    // }
    
    spotView.showMore = () => {
        $('.hide').slideUp(0);
        $('.editing-buttons, .voting-buttons').hide();
        $('#list-view').off('click', 'a.show-more');
        $('#list-view').on('click', 'a.show-more', function(e) {
            e.preventDefault();
            if ($(this).text() === 'Show More') {
                if(User.name === $(this).data('username')) {
                    $(this).parent().find('.editing-buttons').show();
                } else if (User.current) {
                    $(this).parent().find('.voting-buttons').show();
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

    spotView.sortListener = () => {
        $('select').change(function(){
            const sortVal = $('#sort option:selected').val();
            spotView.sortBy(sortVal);
        });
    };

    spotView.sortBy = (sortVal) => {
        const $posts = $('#list-view');

        $posts.find('.spot').sort(function (a, b) {
            if (sortVal !== 'data-spot-id'){
                return $(a).attr(`${sortVal}`).toLowerCase() > $(b).attr(`${sortVal}`).toLowerCase();
            } else {
                console.log('spot-id is checked');
                return $(a).attr(`${sortVal}`).toLowerCase() < $(b).attr(`${sortVal}`).toLowerCase();
            }
        })
            .appendTo($posts);
    };
  
    spotView.populateFilter = () => {
        if (User.current) {
            $('#filter').show();
            spotView.filterHandler();
        }
        else {
            $('#filter').hide();
        }
    };

    spotView.filterHandler = () => {
        const filterAction = function (){
            if ($('input:checkbox').is(':checked')) {
                $('.spot').hide();
                $(`.${User.name}`).fadeIn();
            }
            else {
                $('.spot').fadeIn();
            }
        };
        filterAction();
        $('input:checkbox').change(function(){
            filterAction();
        });
    };
  
    spotView.initListView = () => {
        $('#list-view').fadeIn();
        $('.spot').empty().remove();
        spotView.loadSpots();
        spotView.showMore();
        spotView.populateFilter();
        spotView.sortListener();
        // spotView.sortBy();

        $('#list-view')
            .off('click', '.list-delete-spot')
            .on('click', '.list-delete-spot', function() {
                handleDelete($(this).parents('.spot-info').data('spot-id'), '/list-view');
            });
        
        $('#list-view')
            .off('click', '.list-been-spot')
            .on('click', '.list-been-spot', function() {
                handleBeen($(this).parents('.spot-info').data('spot-id'));
            });

        $('#list-view')
            .off('click', '.list-good-spot')
            .on('click', '.list-good-spot', function() {
                handleGood($(this).parents('.spot-info').data('spot-id'));
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

        $('#cancel-update')
            .off('click')
            .on('click'), () => {
            history.back();
        };

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

        const html = detailViewTemplate(Spot.detail);

        $('#detail-view').show();

        $('#detail-holder')
            .empty()
            .append(html)
            .fadeIn();

        Spot.collectBeen(Spot.detail.spot_id)
            .then(response => {
                const beenReport = {
                    beenHereCount: response,
                    peopleHaveGrammar: response !== '1' ? 'people have' : 'person has'
                };

                const html = beenHereTemplate(beenReport);
                
                $('#been-here-holder')
                    .empty()
                    .append(html)
                    .fadeIn();
            });

        $('.editing-buttons, .voting-buttons').hide();

        if (User.name === Spot.detail.username) {
            $('.editing-buttons').show();
            $('#delete-spot')
                .off('click')
                .on('click', () => {
                    handleDelete(Spot.detail.spot_id, '/map');
                });
        } else if (User.current) {
            $('.voting-buttons').show();
            $('#been-spot')
                .off('click')
                .on('click', () => {
                    handleBeen(Spot.detail.spot_id);
                });
            $('#good-spot')
                .off('click')
                .on('click', () => {
                    handleGood(Spot.detail.spot_id);
                });
        }
    };

    function handleDelete(id, newView) {
        if (confirm('Do you really want to delete this spot permanently?')) {
            Spot.delete(id)
                .then(response => {
                    console.log(response);
                    page(newView);
                })
                .catch(console.error);
        }
    }

    function handleBeen(id) {
        Spot.reportBeen(id)
            .then(response => {
                const beenReport = {
                    beenHereCount: response,
                    peopleHaveGrammar: response !== '1' ? 'people have' : 'person has'
                };

                const html = beenHereTemplate(beenReport);
                
                $('#been-here-holder')
                    .empty()
                    .append(html)
                    .fadeIn();
            })
            .catch(console.error);
    }

    function handleGood(id) {
        Spot.reportGood(id)
            .then(response => {
                console.log(response);
            })
            .catch(console.error);
    }

    module.spotView = spotView;

})(window.module);