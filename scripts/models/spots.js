'use strict';

(function(module) {

    function Spot(data) {
        Object.keys(data).map(key => this[key] = data[key]);
    }

    Spot.all = [];

    function formatDate(date) {
        const formattedDate = new Date(Date.parse(date));
        const monthNames = [
            'January', 'February', 'March',
            'April', 'May', 'June', 'July',
            'August', 'September', 'October',
            'November', 'December'
        ];
      
        const day = formattedDate.getDate();
        const monthIndex = formattedDate.getMonth();
        const year = formattedDate.getFullYear();
        const hour = date.getHours();
        const minutes = date.getMinutes();
      
        return `${monthNames[monthIndex]} ${day}, ${year} ${hour}:${minutes}`;
    }

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
                Spot.detail.date = formatDate(Spot.detail.date);
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

    Spot.recordBeen = (id) => {
        return $.post(`${API_URL}/spots/${id}/been`);
    };

    Spot.collectGood = (id) => {
        return $.get(`${API_URL}/spots/${id}/good`);
    };

    Spot.recordGood = (id) => {
        return $.post(`${API_URL}/spots/${id}/good`);
    };

    module.Spot = Spot;

})(window.module);