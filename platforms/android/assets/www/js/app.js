/// <reference path="openfb.js" />
/// <reference path="../lib/ionic/js/ionic.bundle.js" />
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
function verificaLogin(state, scope, popup) {
    openFB.getLoginStatus(function (data) {
        console.log(data.status);
        if (data.status != 'connected') {
            var alertPopup = popup.alert({
                title: 'Login',
                template: 'Faça o login para acessar todos os recursos do app'
            });
            alertPopup.then(function (res) {
                state.go('login');
            });
        }
    });
}


angular.module('bikeregistrada', ['ionic', 'bikeregistrada.controllers', 'ui.mask'])

.run(function ($ionicPlatform, $state, $rootScope, $window) {

    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (!window.cordova) {
            console.log("pc");
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
            StatusBar.hide();
        }

    });
})

.config(function ($stateProvider, $urlRouterProvider) {
    //openFB.init('341857775995825', 'https://www.facebook.com/connect/login_success.html', window.sessionStorage);
    openFB.init({ appId: '341857775995825' });

    $stateProvider

     .state('app', {
         url: "/app",
         abstract: true,
         templateUrl: "views/menu.html",
         controller: "AppCtrl"
     })

    .state('login', {
        url: "/login",
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
    })


   .state('cadastro', {
       url: "/cadastro",
       //views: {
       //    'menuContent': {
       templateUrl: 'views/cadastroUser.html',
       controller: 'CadastroCtrl'
       //    }
       //}
   })

   .state('addbike', {
       url: "/addbike",
       //views: {
       //    'menuContent': {
       templateUrl: 'views/addBike.html',
       controller: 'BikeCtrl'
       //    }
       //}
   })

   .state('consultabike', {
       url: "/consultabike",
       //views: {
       //    'menuContent': {
       templateUrl: 'views/consultaBike.html',
       controller: 'BikeCtrl'
       //    }
       //}
   })

   .state('resultado', {
       url: "/resultadobike",
       //views: {
       //    'menuContent': {
       templateUrl: 'views/resultadoBike.html',
       controller: 'BikeCtrl'
       //    }
       //}
   })

   .state('app.profile', {
       url: "/profile",
       views: {
           'menuContent': {
               templateUrl: 'views/profile.html',
               controller: 'ProfileCtrl'
           }
       }
   })

    .state('editarprofile', {
        url: "/editarprofile",
        templateUrl: 'views/editarProfile.html',
        controller: 'ProfileCtrl'
    })

       .state('splash', {
           url: "/splash",
           templateUrl: 'views/splash.html',
           controller: 'AppCtrl'
       })

    $urlRouterProvider.otherwise('/splash');
})

.controller('AppCtrl', function ($scope, $state, $ionicPopup) {
    $scope.logout = function () {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Sair',
            template: 'Você tem certeza que deseja sair?'
        });
        confirmPopup.then(function (res) {
            if (res) {
                openFB.logout(function () { $state.go('login'); });
            } else {
                console.log('Você clickou em não');
            }
        });
    };

    $scope.revokePermissions = function () {
        OpenFB.revokePermissions().then(
            function () {
                $state.go('login');
            },
            function () {
                alert('Revoke permissions failed');
            });
    };
})
