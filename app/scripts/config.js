"use strict";
BeetApp.config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: '/scripts/languages/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('pt_br');
});
