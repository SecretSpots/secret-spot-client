'use strict';

'use strict';

(function(module) {

    const formView = {};

    formView.initForm = () => {
        var input = document.getElementById('locationTextField');
        autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', function() {
            var place = autocomplete.getPlace();
            console.log(place);
        });
    };
    
    
    module.formView = formView;


})(window.module);




// var placeSearch, autocomplete;
// const componentForm = {
//     street_number: 'short_name',
//     route: 'long_name',
//     locality: 'long_name',
//     administrative_area_level_1: 'short_name',
//     country: 'long_name',
//     postal_code: 'short_name'
// };

// function initAutocomplete() {
//     // Create the autocomplete object, restricting the search to geographical
//     // location types.
//     autocomplete = new google.maps.places.Autocomplete(
//         /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
//         {types: ['geocode']});

//     // When the user selects an address from the dropdown, populate the address
//     // fields in the form.
//     autocomplete.addListener('place_changed', fillInAddress);
// }

// function fillInAddress() {
//     // Get the place details from the autocomplete object.
//     const place = autocomplete.getPlace();

//     for (const component in componentForm) {
//         document.getElementById(component).value = '';
//         document.getElementById(component).disabled = false;
//     }

//     // Get each component of the address from the place details
//     // and fill the corresponding field on the form.
//     for (let i = 0; i < place.address_components.length; i++) {
//         const addressType = place.address_components[i].types[0];
//         if (componentForm[addressType]) {
//             const val = place.address_components[i][componentForm[addressType]];
//             document.getElementById(addressType).value = val;
//         }
//     }
// }

// // Bias the autocomplete object to the user's geographical location,
// // as supplied by the browser's 'navigator.geolocation' object.
// function geolocate() {
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function(position) {
//             const geolocation = {
//                 lat: position.coords.latitude,
//                 lng: position.coords.longitude
//             };
//             const circle = new google.maps.Circle({
//                 center: geolocation,
//                 radius: position.coords.accuracy
//             });
//             autocomplete.setBounds(circle.getBounds());
//         });
//     }
// }
