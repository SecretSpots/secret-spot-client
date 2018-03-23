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

        if (User.current) {
            Spot.checkVotesSingle(spot.spot_id)
                .then(response => {
                    $('.voting-buttons').show();
                    $('#good-spot, #been-spot').show().fadeTo(200, 0.3);
                    if (!response.rows.length) {
                        activateBeenButton(spot);
                        activateGoodButton(spot);
                    } else {
                        const voteInfo = response.rows[0];
                        if (!voteInfo.beenHere) {
                            activateBeenButton(spot);
                        } else {
                            $('#been-spot').fadeTo(200, 0.3);
                        }
                        if (!voteInfo.likedHere) {
                            activateGoodButton(spot);
                        } else {
                            $('#good-spot').fadeTo(200, 0.3);
                        }
                    }
                })
                .catch(console.error);
        }

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
            formatVotes(spot);
            spot.date = formatDate(new Date(Date.parse(spot.date)));
            const html = listTemplate(spot);
            $('#list-view').append(html);
        });
    };

    function formatVotes(spot) {
        spot.peopleBeenGrammar = spot.beenHereCount !== '1' ? 'people have' : 'person has';
        spot.peopleGoodGrammar = spot.goodSpotCount !== '1' ? 'people have' : 'person has';
        if (!spot.beenHereCount) spot.beenHereCount = '0';
        if (!spot.goodSpotCount) spot.goodSpotCount = '0';
    }
    
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
        const hour = date.getHours();
        const minutes = date.getMinutes();
      
        return `${monthNames[monthIndex]} ${day}, ${year} ${hour}:${minutes}`;
    }

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
        const spot = Spot.detail;

        formatVotes(spot);

        const html = detailViewTemplate(spot);

        $('#detail-view')
            .empty()
            .append(html)
            .fadeIn();

        $('.editing-buttons, #good-spot, #been-spot').hide();

        if (User.name === spot.username) {
            $('.editing-buttons').show();
            $('#delete-spot')
                .off('click')
                .on('click', () => {
                    handleDelete(spot.spot_id, '/map');
                    
                });
        }
        if (User.name !== spot.username && User.current) {
            Spot.checkVotesSingle(spot.spot_id)
                .then(response => {
                    $('.voting-buttons').show();
                    $('#good-spot, #been-spot').show().fadeTo(200, 0.3);
                    if (!response.rows.length) {
                        activateBeenButton(spot);
                        activateGoodButton(spot);
                    } else {
                        const voteInfo = response.rows[0];
                        if (!voteInfo.beenHere) {
                            activateBeenButton(spot);
                        } else {
                            $('#been-spot').fadeTo(200, 0.3);
                        }
                        if (!voteInfo.likedHere) {
                            activateGoodButton(spot);
                        } else {
                            $('#good-spot').fadeTo(200, 0.3);
                        }
                    }
                })
                .catch(console.error);
        }
    };

    function activateBeenButton(spot) {
        $('#been-spot')
            .fadeTo(200, 1)
            .off('click')
            .on('click', function() {
                handleBeen(spot.spot_id);
                $(this).fadeTo(200, 0.3);
                updateText($(this), '#detail-view', 'been');
            });
    }

    function activateGoodButton(spot) {
        $('#good-spot')
            .fadeTo(200, 1)
            .off('click')
            .on('click', function() {
                handleGood(spot.spot_id);
                $(this).fadeTo(200, 0.3);
                updateText($(this), '#detail-view', 'good');
            });
    }

    function updateText(trigger, parent, voteType) {
        trigger.parents(parent).find(`.${voteType}-you`).text(' + now you have, too');
    }

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
                console.log(response);
            })
            .catch(console.error);
    }

    function handleGood(id) {
        Spot.recordGood(id)
            .then(response => {
                console.log(response);
            })
            .catch(console.error);
    }

    module.spotView = spotView;

})(window.module);