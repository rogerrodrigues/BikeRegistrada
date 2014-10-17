/// <reference path="openfb-angular.js" />
/// <reference path="../lib/ionic/js/ionic.bundle.js" />
/// <reference path="openfb.js" />

angular.module("bikeregistrada.controllers", [])



.controller('LoginCtrl', function ($scope, $ionicModal, $timeout, $location, $state) {
    openFB.getLoginStatus(function (data) {
        console.log(data.status);
        if (data.status == 'connected') {
            $state.go("app.profile");
        }
    });
    $scope.facebookLogin = function () {

        openFB.login(function (response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                //  $scope.closeLogin();
                $scope.$apply(function () {
                    $location.path('app/profile');
                });
            } else {
                alert('Facebook login failed');
            }
        },
        { scope: 'email,publish_actions,read_stream,publish_stream' });
    };

    $scope.login = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Login',
            template: 'Não implementado'
        });
        alertPopup.then(function (res) {
            //$state.go('login');
        });
    };
})

.controller('BikeCtrl', function ($scope, $ionicModal, $timeout, $state, $ionicPopup) {
    verificaLogin($state, $scope, $ionicPopup);
    $scope.grupoSelected = 1;
    $scope.registro = "";
    $scope.registros = [{ valor: "XXXXXX" }, { valor: "XXXXXX" }, { valor: "XXXXXX" }, { valor: "XXXXXX" }, { valor: "XXXXXX" }];

    $scope.isSelected = function (index) {
        return this.grupoSelected === index;
    }

    $scope.selectGrupo = function (setGrupo) {
        this.grupoSelected = setGrupo;
        this.registro = (this.registros[this.grupoSelected - 1].valor != "" && this.registros[this.grupoSelected - 1].valor != "XXXXXX") ? this.registros[this.grupoSelected - 1].valor : "";
    }

    $scope.salvarGrupo = function () {
        var r = { valor: this.registro != "" ? this.registro : "XXXXXX" }
        this.registros[this.grupoSelected - 1] = r;
    }

    $scope.consultarBike = function () {
        if (window.cordova) {
            cordova.plugins.barcodeScanner.scan(
                        function (result) {
                            if (!result.cancelled) {
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Resultado Scan',
                                    template: 'Resultado: ' + result.text + '\n <br />Formato: ' + result.format
                                });
                                alertPopup.then(function (res) {
                                    $state.go("resultado");
                                });

                            }
                        },
                        function (error) {
                            var alertPopup = $ionicPopup.alert({
                                title: 'Erro',
                                template: 'Ocorreu um erro, tente realizar a operação novamente'
                            });
                            alertPopup.then(function (res) {
                                $state.go('login');
                            });
                        });
        } else {
            var alertPopup = $ionicPopup.alert({
                title: 'Alerta',
                template: "Funcionalidade necessita estar rodando no Device ou Emulador"
            });
            alertPopup.then(function (res) {
                $state.go("resultado");
            });
        }
    }

})

.controller('CadastroCtrl', function ($scope, $ionicModal, $timeout, $ionicNavBarDelegate, $ionicLoading) {
    //$ionicLoading.show({
    //    template: 'Loading...'
    //});
    $scope.cadastrarUsuario = function () {
        $ionicNavBarDelegate.back();
    }
})

.controller('ProfileCtrl', function ($scope, $state, $ionicPopup) {
    verificaLogin($state, $scope, $ionicPopup);

    if (sessionStorage["usuario"] !== undefined) {
        $scope.usuario = angular.fromJson(sessionStorage["usuario"]);
    } else {
        openFB.api({
            path: "/me",
            success: function (data) {
                $scope.$apply(function () {
                    data.fotoFacebook = 'http://graph.facebook.com/' + data.id + '/picture?type=large'
                    data.fotoPrincipal = data.fotoFacebook;
                    sessionStorage["usuario"] = angular.toJson(data);

                    $scope.usuario = data;
                });
            },
            error: function (error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Erro',
                    template: 'Ocorreu um erro ao recuperar os dados'
                });
                alertPopup.then(function (res) {
                    $state.go('login');
                });
            }
        });
    }

    $scope.salvarDados = function () {
        //$scope.usuario = angular.fromJson(sessionStorage["usuario"]);
        sessionStorage["usuario"] = angular.toJson($scope.usuario);
        alerta($ionicPopup, "Sucesso", "Perfil Atualizado com sucesso", function () {
            $state.go("app.profile");
        });

    };

    $scope.getFoto = function () {
        if (!window.cordova) {
            alerta($ionicPopup, "Device", "Necessita de estar rodando em device", function () { });
        } else {
            try {
                navigator.camera.getPicture(function (dataURL) {
                    $scope.$apply(function () {
                        $scope.usuario.fotoPrincipal = "data:image/jpeg;base64," + dataURL;
                        sessionStorage["usuario"] = angular.toJson($scope.usuario);
                    });
                }, function (err) {
                    console.err(err);
                }, {
                    quality: 75,
                    targetWidth: 320,
                    targetHeight: 320,
                    saveToPhotoAlbum: false,
                    correctOrientation: true,
                    destinationType: window.Camera.DestinationType.DATA_URL
                    //window.Camera.DestinationType.FILE_URI
                });
            } catch (e) {
                alert(e.message);
            }
        }
    };

    $scope.getFotoAlbum = function () {
        if (!window.cordova) {
            alerta($ionicPopup, "Device", "Necessita de estar rodando em device", function () { });
        } else {
            try {
                console.log("get album");
                navigator.camera.getPicture(function (dataURL) {
                    $scope.$apply(function () {
                        $scope.usuario.fotoPrincipal = "data:image/jpeg;base64," + dataURL;
                        sessionStorage["usuario"] = angular.toJson($scope.usuario);
                    });
                }, function (err) {
                    console.err(err);
                }, {
                    quality: 50,
                    destinationType: window.Camera.DestinationType.DATA_URL,
                    sourceType: navigator.camera.PictureSourceType.SAVEDPHOTOALBUM
                });
            } catch (e) {
                alert(e.message);
            }
        }
    }

})



function alerta(ionicPopup,titulo,conteudo,callback) {
    var alertPopup = ionicPopup.alert({
        title: titulo,
        template: conteudo
    });
    alertPopup.then(function (res) {
        callback(res);
    });

}