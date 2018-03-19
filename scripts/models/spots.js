'use strict';

(function(module) {
    
    const template = Handlebars.compile($('#spot-list-template').html());

    function Spot(data) {
        Object.keys(data).map(key => this[key] = data[key]);
    }

    Spot.prototype.toHtml = function() {
        return template(this);
    };

    Spot.all = [];

    Spot.fetchAll = () => {
        return $.getJSON(`${API_URL}/spots`)
            .then(data => {
                Spot.all = data.map(each => new Spot(each));
            });
    };

    module.Spot = Spot;

})(window.module);