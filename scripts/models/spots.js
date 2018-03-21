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

    Spot.detail = null;

    Spot.fetchOne = (id) => {
        return $.getJSON(`${API_URL}/spots/${id}`)
            .then(data => {
                Spot.detail = new Spot(data);
            });

    };

    Spot.create = data => {
        return $.post(`${API_URL}/spots/new`, data);
    };

    Spot.delete = (id) => {
        return $.ajax({
            url: `${API_URL}/spots/${id}`,
            method: 'DELETE'
        });
    };

    module.Spot = Spot;

})(window.module);