'use strict';

(function(module) {

    function Spot(data) {
        Object.keys(data).map(key => this[key] = data[key]);
    }

    Spot.all = [];

    Spot.fetchAll = () => {
        return $.getJSON(`${API_URL}/spots`)
            .then(data => {
                Spot.all = data.map(each => new Spot(each));
            });
    };

    Spot.create = data => {
        return $.post(`${API_URL}/spots/new`, data);
        
    };

    module.Spot = Spot;

})(window.module);