'use strict';

'use strict';

(function(module) {

    const formView = {};

    formView.autocomplete = {};

    formView.initForm = () => {
        $('#add-spot')[0].reset();
        $('#new-spot-view').show();
        $('#form-view').hide();

        const input = document.getElementById('locationTextField');
        formView.autocomplete = new google.maps.places.Autocomplete(input);
        formView.autocomplete.addListener('place_changed', fillInForm);
    };

    const fillInForm = function() {
        $('#form-view').slideDown(200);

        let place = this.getPlace();
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
