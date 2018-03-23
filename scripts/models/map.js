'use strict';

(function(module) {

    const Map = {};

    Map.markersAll = [];

    Map.mapObject = null;
    Map.tempMarker = null; //define in outer scope to avoid duplicates
    Map.infoWindow = null; //define in outer scope to avoid duplicates

    Map.initMap = () => {
        const center = { lat: 45.519900, lng: -122.678316 };
        
        Map.mapObject = new google.maps.Map(document.getElementById('map'), {
            zoom: 13,
            center: center,
            styles: mapStyle,
            gestureHandling: 'greedy',
            mapTypeControl: false,
            scaleControl: true,
            streetViewControl: false,
            rotateControl: true,
            fullscreenControl: true
        });

        Map.infoWindow = new google.maps.InfoWindow();
    };

    const cyan = '#407887';
    const blue = '#163142';
    const gold = '#c1af48';

    const mapStyle = [
        {
            'featureType': 'administrative',
            'elementType': 'geometry.stroke',
            'stylers': [
                { 'visibility': 'on' },
                { 'color': blue },
                { 'weight': '0.30' }
            ]
        },
        {
            'featureType': 'administrative',
            'elementType': 'labels.text.fill',
            'stylers': [
                { 'color': gold }
            ]
        },
        {
            'featureType': 'administrative',
            'elementType': 'labels.text.stroke',
            'stylers': [
                { 'color': cyan },
                { 'visibility': 'on' },
                { 'weight': '6' }
            ]
        },
        {
            'featureType': 'administrative',
            'elementType': 'labels.icon',
            'stylers': [
                { 'visibility': 'off' }
            ]
        },
        {
            'featureType': 'administrative.country',
            'elementType': 'labels.text',
            'stylers': [
                { 'visibility': 'off' }
            ]
        },
        {
            'featureType': 'administrative.province',
            'elementType': 'all',
            'stylers': [
                { 'visibility': 'off' }
            ]
        },
        {
            'featureType': 'administrative.locality',
            'elementType': 'all',
            'stylers': [
                { 'visibility': 'off' }
            ]
        },
        {
            'featureType': 'administrative.locality',
            'elementType': 'geometry',
            'stylers': [
                { 'visibility': 'off' }
            ]
        },
        {
            'featureType': 'landscape',
            'elementType': 'all',
            'stylers': [
                { 'color': cyan }
            ]
        },
        {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': [
                { 'visibility': 'off' }
            ]
        },
        {
            'featureType': 'road',
            'elementType': 'all',
            'stylers': [
                { 'color': blue },
                { 'visibility': 'simplified' }
            ]
        },
        {
            'featureType': 'road',
            'elementType': 'labels.text',
            'stylers': [
                { 'visibility': 'on' },
                { 'color': cyan },
                { 'weight': 8 }
            ]
        },
        {
            'featureType': 'road',
            'elementType': 'labels.text.fill',
            'stylers': [
                { 'visibility': 'on' },
                { 'color': blue },
                { 'weight': 8 }
            ]
        },
        {
            'featureType': 'road',
            'elementType': 'labels.icon',
            'stylers': [
                { 'visibility': 'off' }
            ]
        },
        {
            'featureType': 'transit',
            'elementType': 'all',
            'stylers': [
                { 'visibility': 'on' },
                { 'color': blue }
            ]
        },
        {
            'featureType': 'transit',
            'elementType': 'geometry',
            'stylers': [
                { 'visibility': 'off' }
            ]
        },
        {
            'featureType': 'transit',
            'elementType': 'labels',
            'stylers': [
                { 'visibility': 'off' }
            ]
        },
        {
            'featureType': 'transit.station',
            'elementType': 'all',
            'stylers': [
                { 'visibility': 'off' }
            ]
        },
        {
            'featureType': 'water',
            'elementType': 'geometry.fill',
            'stylers': [
                { 'visibility': 'on' },
                { 'color': blue }
            ]
        },
        {
            'featureType': 'water',
            'elementType': 'labels.text',
            'stylers': [
                { 'visibility': 'simplified' },
                { 'color': cyan },
            ]
        },
        {
            'featureType': 'water',
            'elementType': 'labels.icon',
            'stylers': [
                { 'visibility': 'off' }
            ]
        }
    ];

    module.Map = Map;

})(window.module);