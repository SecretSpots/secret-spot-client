'use strict';

(function(module) {

    const Spot = module.Spot;
    const User = module.User;

    const formView = {};

    formView.autocomplete = {};
    let place = {};

    formView.initForm = () => {
        $('#add-spot')[0].reset();
        $('#new-spot-view').show();
        $('#form-view').hide();

        const input = document.getElementById('locationTextField');
        formView.autocomplete = new google.maps.places.Autocomplete(input);
        formView.autocomplete.addListener('place_changed', fillInForm);

        $('#add-spot').off('submit').on('submit', submitHandler);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        const data = {
            name : $('input[name=name]').val(),
            address : $('input[name=address]').val(),
            username: User.name,
            lat : place.lat,
            lng: place.lng,
            date : new Date(),
            note : $('input[name=note]').val()
        };

        Spot.create(data)
            .then(
                (response) => {
                    $('#add-spot')[0].reset();
                    page(`/spots/${response.spot_id}`);
                })
            .catch(
                console.error
            );
    };

    const fillInForm = function() {
        $('#form-view').slideDown(200);

        place = this.getPlace();
        place = {
            name : place.name,
            address : place.formatted_address,
            lat : place.geometry.location.lat(),
            lng : place.geometry.location.lng()
        };

        const form = $('#add-spot input');

        form[0].value = place.name;
        form[1].value = place.address;
        form[2].value = `${place.lat} ${place.lng}`;
    };
    
    module.formView = formView;


})(window.module);
