'use strict';

(function(module) {

    const User = {};

    const setTokenHeader = token => {
        $.ajaxSetup({
            headers: { token: token }
        });
    };

    function letUserPass(response) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);
        setUser(response.username, response.token);
    }
    
    function setUser(username, token) {
        User.current = true;
        User.name = username;
        setTokenHeader(token);
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
        const username = localStorage.getItem('username');
        setUser(username, token);
    };

    User.logout = () => {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('username');
        setTokenHeader(null);
        User.current = false;
        delete User.name;
    };

    module.User = User;

})(window.module);