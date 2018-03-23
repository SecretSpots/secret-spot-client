'use strict';

(function(module) {

    const Map = module.Map;
    const Spot = module.Spot;
    const User = module.User;

    const mapView = {};

    mapView.initMapView = () => {
        $('#map-view').show();

        mapView.buildMarkers();
        mapView.initForm();

        google.maps.event.addListener(Map.infoWindow, 'domready', function() {
            $('.gm-style-iw').siblings().first().addClass('info-container');
            $('.gm-style-iw').siblings().last().addClass('icon-cancel-circle').empty();
            $('.info-container div:nth-child(3)').find('div div').addClass('info-triangle');
            $('.info-container div:nth-child(4)').addClass('info-background');
        });

    };

    let autocomplete = {};
    let place = {};

    mapView.initForm = () => {
        $('#form-view').hide();

        autocomplete = new google.maps.places.Autocomplete(document.getElementById('locationTextField')); // don't make jquery
        autocomplete.addListener('place_changed', onAutocomplete); //actions on autocomplete

        $('#add-spot').off('submit').on('submit', submitHandler); //submit
    };

    mapView.buildMarkers = () => {
        setMarkers(null, Map.markersAll); //remove current markers from map
        Map.markersAll = []; //delete current markers
        makeMarkers(Spot.all); // make new markers
        setMarkers(Map.mapObject, Map.markersAll); //set new markers on map
    };

    const onAutocomplete = () => {
        $('#form-view').slideDown(200);

        place = autocomplete.getPlace();
        place = {
            name : place.name,
            address : place.formatted_address,
            lat : place.geometry.location.lat(),
            lng : place.geometry.location.lng()
        };

        fillInForm();
        mapSearch();
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

    const markerSVG = {
        path: 'M0-48c-9.8 0-17.7 7.8-17.7 17.4 0 15.5 17.7 30.6 17.7 30.6s17.7-15.4 17.7-30.6c0-9.6-7.9-17.4-17.7-17.4z',
        fillColor: '#c1af48',
        fillOpacity: .8,
        anchor: new google.maps.Point(0,0),
        strokeWeight: 0,
        scale: .8
    };

    const makeMarkers = (data) => {
        data.forEach( spot => {
            const marker = new google.maps.Marker({
                position: new google.maps.LatLng(spot.lat, spot.lng),
                icon: markerSVG,

                name: spot.name,
                id: spot.spot_id
            });

            Map.markersAll.push(marker);
        });
    };

    const setMarkers = (map, markers) => {

        markers.forEach( marker => {

            const contentString = `<h4>${marker.name}</h4><a class="info-text" href="/spots/${marker.id}">See details!</a>`;
            
            marker.setMap(map);

            marker.addListener('click', function () {
                Map.infoWindow.setContent(contentString);
                Map.infoWindow.open(Map.mapObject, marker);

                if (Map.tempMarker) Map.tempMarker.setMap(null);

                marker.setAnimation(google.maps.Animation.BOUNCE);
                setTimeout(function(){ marker.setAnimation(null); }, 375);
        
            });
        });
    };

    const fillInForm = () => {
        
        const form = $('#add-spot input');

        form[0].value = place.name;
        form[1].value = place.address;
        form[2].value = `${place.lat} ${place.lng}`;
    };

    const mapSearch = () => {
        Map.tempMarker = new google.maps.Marker({
            position: new google.maps.LatLng(place.lat, place.lng),
            map: Map.mapObject,
            icon: markerSVG,
            animation: google.maps.Animation.DROP,

            store_id: 'temp',
        });

        const tempContent = `<div id="info-content"><h3>${place.name}</h3><h4 class="info-text">Is this your secret spot?</h4></div>`;

        Map.infoWindow.setContent(tempContent);
        Map.infoWindow.open(Map.mapObject, Map.tempMarker);

        Map.tempMarker.addListener('click', function () {
            Map.infoWindow.setContent(tempContent);
            Map.infoWindow.open(Map.mapObject, Map.tempMarker);
        });

        Map.mapObject.setCenter(Map.tempMarker.getPosition());
    };

    module.mapView = mapView;

})(window.module);