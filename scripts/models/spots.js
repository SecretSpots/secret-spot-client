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

    Spot.update = data => {
        return $.ajax({
            url: `${API_URL}/spots/${data.spot_id}`,
            method: 'PUT',
            data: data
        });
    };

    Spot.delete = (id) => {
        return $.ajax({
            url: `${API_URL}/spots/${id}`,
            method: 'DELETE'
        });
    };

    Spot.collectBeen = (id) => {
        return $.get(`${API_URL}/spots/${id}/been`);
    };

    Spot.reportBeen = (id) => {
        return $.post(`${API_URL}/spots/${id}/been`);
    };

    Spot.reportGood = (id) => {
        return $.post(`${API_URL}/spots/${id}/good`);
    };

    module.Spot = Spot;

})(window.module);