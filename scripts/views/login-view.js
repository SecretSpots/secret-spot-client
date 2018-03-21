'use strict';

(function(module) {

    const User = module.User;

    const loginView = {};

    let method = '';

    function handleViewToggle(methodType, authTypeLink, switchLinkText) {
        if(User.current) {
            $('#auth-type').hide();
            $('#auth-form').hide();
            $('#user-status').fadeIn();
        } else {
            method = methodType;
            $('#auth-type').attr('href', authTypeLink).text(switchLinkText).fadeIn();
            $('#auth-form').off('submit').on('submit', handleSubmit).fadeIn();
            $('#user-status').hide();
            $('#current-username').hide();
            $('#logout').hide();
        }
        $('#auth-view').fadeIn();
    }

    loginView.initSignup = () => {
        const methodType = 'signup';
        const authTypeLink = '/auth/signin';
        const switchLinkText = 'Have an account? Click here to sign in instead.';
        handleViewToggle(methodType, authTypeLink, switchLinkText);
    };

    loginView.initSignin = () => {
        const methodType = 'signin';
        const authTypeLink = '/auth/signup';
        const switchLinkText = 'No account? Click here to sign up instead.';
        handleViewToggle(methodType, authTypeLink, switchLinkText);
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
                $('#logout')
                    .fadeIn()
                    .off('click')
                    .on('click', () => {
                        User.logout();
                        page('/auth/signin');
                    });
            })
            .catch(err => {
                $('#user-status').text(err.responseJSON.error).fadeIn();
            });
    };

    module.loginView = loginView;

})(window.module);