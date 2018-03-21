'use strict';

(function(module) {

    const User = module.User;

    const loginView = {};

    let method = '';

    loginView.initSignup = () => {
        if(User.current) {
            $('#auth-type').hide();
            $('#auth-form').hide();
            $('#user-status').fadeIn();
        } else {
            method = 'signup';
            $('#auth-type').attr('href', '/auth/signin').text('Have an account? Click here to sign in instead.');
            $('#auth-form').off('submit').on('submit', handleSubmit);
            $('#user-status').hide();
            $('#current-username').hide();
            $('#logout').hide();
        }
        $('#auth-view').fadeIn();
    };

    loginView.initSignin = () => {
        if(User.current) {
            $('#auth-type').hide();
            $('#auth-form').hide();
            $('#user-status').fadeIn();
        } else {
            method = 'signin';
            $('#auth-type').attr('href', '/auth/signup').text('No account? Click here to sign up instead.');
            $('#auth-form').off('submit').on('submit', handleSubmit);
            $('#user-status').hide();
            $('#current-username').hide();
            $('#logout').hide();
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
                $('#user-status').text('you are logged in').fadeIn();
                $('#current-username').text(`${credentials.username}`).fadeIn();
                $('#logout').fadeIn().off('click').on('click', User.logout);
            })
            .catch(err => {
                $('#user-status').text(err.responseJSON.error).fadeIn();
            });
    };

    module.loginView = loginView;

})(window.module);