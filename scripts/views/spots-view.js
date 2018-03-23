'use strict';

(function(module) {
    
    const User = module.User;
    const Spot = module.Spot;
    
    const listTemplate = Handlebars.compile($('#spot-list-template').html());
    const detailViewTemplate = Handlebars.compile($('#detail-view-template').html());
    const updateViewTemplate = Handlebars.compile($('#update-view-template').html());
    const beenHereTemplate = Handlebars.compile($('#been-here-template').html());
    const goodSpotTemplate = Handlebars.compile($('#good-spot-template').html());
    Handlebars.registerPartial('beenReport', $('#been-here-template').html());
    Handlebars.registerPartial('goodReport', $('#good-spot-template').html());

    const spotView = {};
    
    spotView.showMore = () => {
        $('.hide').slideUp(0);
        $('.editing-buttons, .voting-buttons').hide();
        $('#list-view').off('click', 'a.show-more, a.icon-circle-down, a.show-less');
        $('#list-view').on('click', 'a.show-more, a.icon-circle-down, a.show-less', function(e) {
            e.preventDefault();
            if ($(this).hasClass('show-more')) {
                if(User.name === $(this).data('username')) {
                    $(this).parent().find('.editing-buttons').show();
                } else if (User.current) {
                    $(this).parent().find('.voting-buttons').show();
                }
                $(this).parent().find('.hide').slideDown(200);
                $(this).addClass('show-less');
                $(this).removeClass('show-more');
            } else if ($(this).hasClass('show-less')) {
                $(this).parent().find('.hide').slideUp(200);
                $(this).parent().find('.editing-buttons, .voting-buttons').hide();
                $(this).addClass('show-more');
                $(this).removeClass('show-less');
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
            if (sortVal === 'data-title' || sortVal === 'data-date') { // sort 1-10...
                return $(a).attr(`${sortVal}`).toLowerCase() > $(b).attr(`${sortVal}`).toLowerCase();
            } else { // sort 10-1...
                return $(a).attr(`${sortVal}`).toLowerCase() < $(b).attr(`${sortVal}`).toLowerCase();
            }
        })
            .appendTo($posts).hide().fadeIn(500);
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
        
        // $('#list-view')
        //     .off('click', '.list-been-spot')
        //     .on('click', '.list-been-spot', function() {
        //         handleListBeen($(this).parents('.spot-info').data('spot-id'));
        //     });

        // $('#list-view')
        //     .off('click', '.list-good-spot')
        //     .on('click', '.list-good-spot', function() {
        //         handleListGood($(this).parents('.spot-info').data('spot-id'));
        //     });
        
    };
    
    spotView.loadSpots = () => {
        Spot.all.forEach(spot => {
            const html = listTemplate(spot);
            $('#list-view').append(html);
        });
    };
    
    function formatDate(date) {
        const monthNames = [
            'January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November', 'December'
        ];
      
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
      
        return `${monthNames[monthIndex]} ${day}, ${year}`;
    }

    spotView.loadSpots = () => {
        Spot.all.forEach(spot => {
            spot.date = formatDate(new Date(Date.parse(spot.date)));
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
            .on('click', () => {
                history.back();
            });

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
                displayBeen(response);
            })
            .catch(console.error);
        
        Spot.collectGood(Spot.detail.spot_id)
            .then(response => {
                displayDetailGood(response);
            })
            .catch(console.error);

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
                    handleDetailGood(Spot.detail.spot_id);
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
        Spot.recordBeen(id)
            .then(response => {
                displayBeen(response);
            })
            .catch(console.error);
    }

    function displayBeen(response) {
        const beenReport = {
            beenHereCount: response,
            peopleHaveGrammar: response !== '1' ? 'people have' : 'person has'
        };

        const html = beenHereTemplate(beenReport);
        
        $('#been-here-holder')
            .empty()
            .append(html)
            .fadeIn();
    }

    function handleDetailGood(id) {
        Spot.recordGood(id)
            .then(response => {
                displayDetailGood(response);
            })
            .catch(console.error);
    }

    function displayDetailGood(response) {
        const goodReport = {
            goodSpotCount: response,
            peopleLikeGrammar: response !== '1' ? 'people like' : 'person likes'
        };

        const html = goodSpotTemplate(goodReport);
        
        $('#good-spot-holder')
            .empty()
            .append(html)
            .fadeIn();
    }

    module.spotView = spotView;

})(window.module);