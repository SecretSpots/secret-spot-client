'use strict';

(function(module) {

    const Map = module.Map;
    const Spot = module.Spot;
    const User = module.User;

    const mapView = {};

    let infoWindow = null; //define in outer scope to avoid duplicates
    let markersAll = [];
    let tempMarker = null;

    mapView.initMapView = () => {
        $('#map-view').show();

        setMarkers(null, markersAll);
        markersAll = [];
        makeMarkers(Spot.all);
        setMarkers(Map.mapObject, markersAll);

        mapView.initForm();
    };

    const makeMarkers = (data) => {
        data.forEach( spot => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(spot.lat, spot.lng),
                name: spot.name,
                id: spot.spot_id
            });

            markersAll.push(marker);
        });
    };

    const setMarkers = (map, markers) => {

        markers.forEach( marker => {
            if (infoWindow === null) infoWindow = new google.maps.InfoWindow();

            const contentString = `<h4>${marker.name}</h4><a href="/spots/${marker.id}">Details</a>`;
            
            marker.setMap(map);

            marker.addListener('click', function () {
                infoWindow.setContent(contentString);
                infoWindow.open(Map.mapObject, marker);

                if (tempMarker) tempMarker.setMap(null);
            });

        });
    };

    mapView.autocomplete = {};
    let place = {};

    mapView.initForm = () => {
        $('#form-view').hide();

        const input = document.getElementById('locationTextField');
        mapView.autocomplete = new google.maps.places.Autocomplete(input);
        mapView.autocomplete.addListener('place_changed', fillInForm);

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

        tempMarker = new google.maps.Marker({
            position: new google.maps.LatLng(place.lat, place.lng),
            map: Map.mapObject,

            store_id: 'temp',
        });

        if (infoWindow === null) infoWindow = new google.maps.InfoWindow();
        const tempContent = `<h3>${place.name}</h3><h4>Add me!</h4>`;
        infoWindow.setContent(tempContent);
        infoWindow.open(Map.mapObject, tempMarker);
        tempMarker.addListener('click', function () {
            infoWindow.setContent(tempContent);
            infoWindow.open(Map.mapObject, tempMarker);
        });
        

        const form = $('#add-spot input');

        form[0].value = place.name;
        form[1].value = place.address;
        form[2].value = `${place.lat} ${place.lng}`;
    };

    module.mapView = mapView;

})(window.module);