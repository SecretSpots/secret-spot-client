'use strict';

(function(module) {

    const User = {};

    const setTokenHeader = token => {
        $.ajaxSetup({
            headers: { token: token }
        });
    };

    function letUserPass(response) {
        User.current = true;
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
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
    };

    User.logout = () => {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('username');
        User.current = false;
    };

    module.User = User;

})(window.module);