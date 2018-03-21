'use strict';

(function(module) {

    const User = {};

    User.current = null;

    const setTokenHeader = token => {
        $.ajaxSetup({
            headers: { token: token }
        });
    };

    function letUserPass(response) {
        User.current = true;
        localStorage.setItem('token', response.token);
        setTokenHeader(response.token);
    }

    User.signup = credentials => {
        return $.post(`${API_URL}/auth/signup`, credentials)
            .then(response => {
                letUserPass(response);
            });
    };
  
    User.signin = credentials => {
        return $.post(`${API_URL}/auth/signin`, credentials)
            .then(response => {
                letUserPass(response);
            });
    };

    User.tryToken = () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        setTokenHeader(token);
        User.current = true;
    };

    User.logout = () => {
        window.localStorage.removeItem('token');
        User.current = false;
    };

    module.User = User;

})(window.module);