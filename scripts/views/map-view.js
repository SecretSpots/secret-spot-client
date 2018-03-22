'use strict';

(function(module) {

    const Map = module.Map;
    const Spot = module.Spot;
    const User = module.User;

    const mapView = {};

    mapView.tempMarker = null; //define in outer scope to avoid duplicates
    let infoWindow = null; //define in outer scope to avoid duplicates
    let markersAll = [];

    mapView.initMapView = () => {
        $('#map-view').show();
        buildMarkers();
        mapView.initForm();
    };

    let autocomplete = {};
    let place = {};

    mapView.initForm = () => {
        $('#form-view').hide();

        autocomplete = new google.maps.places.Autocomplete(document.getElementById('locationTextField')); // don't make jquery
        autocomplete.addListener('place_changed', onAutocomplete); //actions on autocomplete

        $('#add-spot').off('submit').on('submit', submitHandler); //submit
    };

    const buildMarkers = () => {
        setMarkers(null, markersAll); //remove current markers from map
        markersAll = []; //delete current markers
        makeMarkers(Spot.all); // make new markers
        setMarkers(Map.mapObject, markersAll); //set new markers on map
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

            markersAll.push(marker);
        });
    };

    const setMarkers = (map, markers) => {

        markers.forEach( marker => {
            if (infoWindow === null) {
                infoWindow = new google.maps.InfoWindow(infoWindowInner);
            }

            const contentString = `<h4>${marker.name}</h4><a href="/spots/${marker.id}">Details</a>`;
            
            marker.setMap(map);

            marker.addListener('click', function () {
                infoWindow.setContent(contentString);
                infoWindow.open(Map.mapObject, marker);

                if (mapView.tempMarker) mapView.tempMarker.setMap(null);

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
        mapView.tempMarker = new google.maps.Marker({
            position: new google.maps.LatLng(place.lat, place.lng),
            map: Map.mapObject,
            icon: markerSVG,
            animation: google.maps.Animation.DROP,

            store_id: 'temp',
        });

        if (infoWindow === null) {
            infoWindow = new google.maps.InfoWindow(infoWindowInner);
        }
        const tempContent = `<h3>${place.name}</h3><h4>Add me!</h4>`;

        infoWindow.setContent(tempContent);
        infoWindow.open(Map.mapObject, mapView.tempMarker);

        mapView.tempMarker.addListener('click', function () {
            infoWindow.setContent(tempContent);
            infoWindow.open(Map.mapObject, mapView.tempMarker);
        });

        Map.mapObject.setCenter(mapView.tempMarker.getPosition());
    };

    const infoWindowInner = {
        closeOnMapClick: true,
        padding: '48px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        border: false,
        borderRadius: '0px',
        shadow: false,
        fontColor: '#fff',
        fontSize: '15px'
    };

    module.mapView = mapView;

})(window.module);