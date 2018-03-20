'use strict';

(function(module) {

    const User = module.User;

    const loginView = {};

    let method = '';

    loginView.initSignup = () => {
        if(User.current) {
            $('#auth-form').hide();
            $('#logged-in').show();
        } else {
            method = 'signup';
            $('#auth-type').attr('href', '/auth/signin').text('Have an account? Sign in.');
            $('#auth-form').off('submit').on('submit', handleSubmit);
            $('#logged-in').hide();
        }
        $('#auth-view').show();
    };

    loginView.initSignin = () => {
        if(User.current) {
            $('#auth-form').hide();
            $('#logged-in').show();
        } else {
            method = 'signin';
            $('#auth-type').attr('href', '/auth/signup').text('No account? Sign up.');
            $('#auth-form').off('submit').on('submit', handleSubmit);
            $('#logged-in').hide();
        }
        $('#auth-view').show();
    };

    const handleSubmit = e => {
        e.preventDefault();
        const credentials = {
            username: $('#username').val(),
            password: $('#password').val()
        };

        User[method](credentials)
            .then(() => {
                $('#auth-form')[0].reset();
                page('/');
            })
            .catch(err => {
                $('#auth-error').text(err.responseJSON.error);
            });
    };

    module.loginView = loginView;

})(window.module);