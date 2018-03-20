'use strict';

(function(module) {

    const User = module.User;

    const loginView = {};

    let method = '';

    loginView.initSignup = () => {
        if(User.current) {
            $('#auth-form').hide();
            $('#logged-in').show();
        }
        else {
            method = 'signup';
            $('#auth-type').attr('href', '/auth/signin').text('Have an account? Sign in.');
            $('#auth-form').off('submit').on('submit', handleSubmit);
            $('#logged-in').hide();
        }
        $('#auth-view').show();
    };

    


})(window.module);