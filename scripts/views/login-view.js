'use strict';

(function(module) {

    const User = module.User;

    const loginView = {};

    let method = '';

    loginView.initSignup = () => {
        if(User.current) {
            $('#auth-type').fadeOut();
            $('#auth-form').fadeOut();
            $('#logged-in').fadeIn();
        } else {
            method = 'signup';
            $('#auth-type').attr('href', '/auth/signin').text('Have an account? Sign in.');
            $('#auth-form').off('submit').on('submit', handleSubmit);
            $('#logged-in').fadeOut();
        }
        $('#auth-view').fadeIn();
    };

    loginView.initSignin = () => {
        if(User.current) {
            $('#auth-type').fadeOut();
            $('#auth-form').fadeOut();
            $('#logged-in').fadeIn();
        } else {
            method = 'signin';
            $('#auth-type').attr('href', '/auth/signup').text('No account? Sign up.');
            $('#auth-form').off('submit').on('submit', handleSubmit);
            $('#logged-in').fadeOut();
        }
        $('#auth-view').fadeIn();
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