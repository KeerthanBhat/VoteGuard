var app = angular.module('myApp',['ngRoute', 'ui.bootstrap', 'ngMaterial', 'ngMessages']);

app.config(['$routeProvider', '$locationProvider', '$httpProvider',  function($routeProvider, $locationProvider, $httpProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
    .when('/',{
        templateUrl: '../views/loginpage.html',
        controller: 'loginCtrl',
        reloadOnSearch: false
    })
    .when('/vote',{
        templateUrl: '../views/vote.html',
        controller: 'voteCtrl',
        reloadOnSearch: false
    })
    .when('/temp',{
        templateUrl: '../views/temp.html',
        controller: 'tempCtrl',
        reloadOnSearch: false
    })
    .otherwise({
        redirectTo: "/"
    })

}]);

app.run(function($rootScope, $location, $window, $route){
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		console.log("routeChangeStart fired.");

        if(next.templateUrl === "../views/temp.html"){
            //Dont do anything
        } else {
            if($window.sessionStorage.getItem('token') === null) {
                console.log("token not found.");
                if(next.templateUrl !== "../views/loginpage.html" ) {
                    console.log("redirect to login page.");
                    $location.replace();
                    $location.url( "/" );
                }
            }
            else{
                console.log("token found.");
                console.log(next.templateUrl);
                if(next.templateUrl === "../views/loginpage.html"){
                    console.log("already logged in. redirect to dashboard.");
                    $location.replace();
                    $location.url("/vote");
                }
            }
        }

    });

    $rootScope.$on('$routeUpdate', function(event, next){
        console.log("routeUpdate fired");
        $route.reload();
    });

    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);

    $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);

});

app.directive('arrowNavigation', ['$document', '$rootScope', function($document, $rootScope){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            $document.on('keydown',function(e){
                if(scope.homeVariablesObj.outletDropdownShow){
                    if(e.keyCode === 38){
                        console.log("up arrow key pressed");
                        if(document.activeElement.id === "outletListToggle"){
                            document.getElementById('row_' + $rootScope.outletArr.length).focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(4);
                            console.log(index);
                            index--;
                            if(index < 0){
                                document.getElementById('row_' + $rootScope.outletArr.length).focus();
                            }
                            else{
                                document.getElementById('row_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                    else if(e.keyCode === 40){
                        console.log("down arrow key pressed");
                        console.log(document.activeElement.id);
                        if(document.activeElement.id === "outletListToggle"){
                            document.getElementById('row_0').focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(4);
                            console.log(index);
                            index++;
                            if(index > $rootScope.outletArr.length){
                                document.getElementById('row_0').focus();
                            }
                            else{
                                document.getElementById('row_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                }
            });
            scope.$on("$destroy", function() {
                $document.off('keydown')
            });
        }
    }
}]);

app.directive('profileArrowNav', ['$document', '$rootScope', function($document, $rootScope){
    return{
        restrict: 'A',
        link: function(scope, element, attrs){
            $document.on('keydown',function(e){
                if(scope.homeVariablesObj.showNavDropdown){
                    if(e.keyCode === 38){
                        console.log("up arrow key pressed");
                        if(document.activeElement.tagName === "BODY"){
                            document.getElementById('navLink_2').focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(8);
                            console.log(index);
                            index--;
                            if(index < 0){
                                document.getElementById('navLink_2').focus();
                            }
                            else{
                                document.getElementById('navLink_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                    else if(e.keyCode === 40){
                        console.log("down arrow key pressed");
                        if(document.activeElement.tagName === "BODY"){
                            document.getElementById('navLink_0').focus();
                        }
                        else{
                            let currentFocused = document.activeElement.id;
                            let index = currentFocused.substring(8);
                            console.log(index);
                            index++;
                            if(index > 2){
                                document.getElementById('navLink_0').focus();
                            }
                            else{
                                document.getElementById('navLink_' + index).focus();
                            }
                        }
                        e.preventDefault();
                    }
                }
            });
            scope.$on("$destroy", function() {
                $document.off('keydown')
            });
        }
    }
}]);

app.factory('commonDataFactory', function(){
    let commonDataFactory = {};
    console.log("inside commonDataFactory.");
    // Object containing all the stored data. To be emptied upon logout or tab close.
    commonDataFactory.storedDataObj = {};

    commonDataFactory.declareVariablesFunc = function(){
        console.log("Variable declaration function called inside commonDataFactory.");

        commonDataFactory.storedDataObj.token = "";
        commonDataFactory.storedDataObj.VoterName = "";
        commonDataFactory.storedDataObj.voterId = "";
        commonDataFactory.storedDataObj.VoterArea = "";
        commonDataFactory.storedDataObj.candidates = [];

    };

    commonDataFactory.declareVariablesFunc();

    return commonDataFactory;
});

app.factory('apiCall', function($http, $window, $location, commonDataFactory, alertsAndDialogs){

    let apiCall = {};

    apiCall.login = function(loginApiCallObj, loginApiCallback){
        console.log("inside login API call.");
        return $http.post('/login', loginApiCallObj)
        .then(function(response){
            console.log("success response.data : %j ",response);
            if(response.data.success === -1){
                alertsAndDialogs.alert('#alertContainer', 'Error', 'Wrong Password', 'OK');
            }
            else if(response.data.success === -2){
                alertsAndDialogs.alert('#alertContainer', 'Error', 'Voter not registered. Please Signup', 'OK');
            }
            else if(response.data.success === -5){
                alertsAndDialogs.alert('#alertContainer', 'Error', 'No Candidates registered', 'OK');
            }
            else if(response.data.success === -8){
                let msg = "Already Voted! Cast Number: " + response.data.cast;
                alertsAndDialogs.alert('#alertContainer', 'Error', msg, 'OK');
            }

            loginApiCallback(response);

        })
        .catch(function(error){
            console.log("FAILED!!!");
            console.log("fail response.data : %j ",error);
            alertsAndDialogs.alert('#alertContainer', 'Error', 'Some error occurred, please try again', 'OK');
            loginApiCallback(error);
        })
    };

    apiCall.castVote = function(voteApiCallObj, voteApiCallback){
        console.log("inside voting API call.");
        return $http.post('/cast_vote', voteApiCallObj)
            .then(function(response){
                console.log("success response.data : %j ",response);
                if(response.data.success === 1){
                    let msg = 'Cast Number: ' + response.data.cast;
                    alertsAndDialogs.alert('#alertContainer', 'Success!', msg, 'OK');
                } else {
                    alertsAndDialogs.alert('#alertContainer', 'Error', 'Error voting! Please try again', 'OK');
                }
                voteApiCallback(response);
            })
            .catch(function(error){
                console.log("fail response.data : %j ",error);
                alertsAndDialogs.alert('#alertContainer', 'Error', 'Some error occurred, please try again', 'OK');
                voteApiCallback(error);
            })
    };

    apiCall.temp = function(voteApiCallback){
        console.log("inside voting API call.");
        return $http.post('/temp')
            .then(function(response){
                console.log("success response.data : %j ",response);
                if(response.data.success === 1){
                    alertsAndDialogs.alert('#alertContainer', 'Success!', "Database Populated", 'OK');
                } else {
                    alertsAndDialogs.alert('#alertContainer', 'Error', 'Error populating DB! Please try again', 'OK');
                }
                voteApiCallback(response);
            })
            .catch(function(error){
                console.log("fail response.data : %j ",error);
                alertsAndDialogs.alert('#alertContainer', 'Error', 'Some error occurred, please try again', 'OK');
                voteApiCallback(error);
            })
    };

    return apiCall;
});

app.factory('alertsAndDialogs', function($mdDialog, $route){

let alertsAndDialogs = {};

    alertsAndDialogs.alert = function(parentContainer, title, text, btn){
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector(parentContainer)))
                .clickOutsideToClose(true)
                .title(title)
                .textContent(text)
                .ariaLabel('Alert Dialog')
                .ok(btn)
                .targetEvent()
        );
        $route.reload();
        //$mdSidenav('rightOffer').open();
    };

return alertsAndDialogs;

});

app.factory('commonFunctions', function(){

    let commonFunctions = {};

    commonFunctions.isEqual = function(val1, val2){
        let type = Object.prototype.toString.call(val1);
        if(type !== Object.prototype.toString.call(val2)){
            return false;
        }
        let val1length = type === '[object Array]' ? val1.length : Object.keys(val1).length;
        let val2length = type === '[object Array]' ? val2.length : Object.keys(val2).length;
        if(val1length !== val2length){
            return false;
        }

        let compare = function(item1, item2){
            let itemType = Object.prototype.toString.call(item1);
            if(['[object Array]', '[object Object]'].indexOf(itemType) > -1){
                if(!commonFunctions.isEqual(item1, item2)){
                    return false;
                }
            }
            else{
                if(item1 !== item2){
                    return false;
                }
            }
        };

        if(type === '[object Array]'){
            for(let i = 0; i < val1.length; i++){
                if(compare(val1[i], val2[i]) === false){
                    return false;
                }
            }
        }
        else{
            for(let key in val1){
                if(val1.hasOwnProperty(key)){
                    if(compare(val1[key], val2[key]) === false){
                        return false;
                    }
                }
            }
        }
        return true;
    };

    return commonFunctions;

});

app.controller('loginCtrl', ['$scope', '$location', '$window', '$timeout', '$rootScope', 'apiCall', 'commonFunctions', function($scope, $location, $window, $timeout, $rootScope, apiCall, commonFunctions){
    console.log("Inside loginCtrl.");
    $scope.loginVariablesObj = {};
    $scope.loginVariablesObj.loginButtonDisabled = false;
    $scope.loginVariablesObj.loginErrorMsg = false;
    $scope.loginFrm = {};
    $scope.login = function(userId, pass){
        $scope.loginVariablesObj.loginButtonDisabled = true;
        let loginObj = {
            voter_id: userId,
            password: pass
        }
        apiCall.login(loginObj, function(response){
            $scope.loginVariablesObj.loginButtonDisabled = false;
            if(response.status !== 200){
                if(response.status === -1){
                    console.log("Not connected to internet.");
                    $scope.loginVariablesObj.loginErrorMsg = true;
                    document.getElementById('loginPageErrMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                    $timeout(function(){
                        $scope.loginVariablesObj.loginErrorMsg = false;
                    }, 5000)
                }
                else{
                    console.log("Sorry, there was an error. Please try again.");
                    $scope.loginVariablesObj.loginErrorMsg = true;
                    document.getElementById('loginPageErrMsg').innerHTML = "Sorry, there was an error. Please try again.";
                }
            }
            else{
                if(response.data.success === 1){
                    console.log("Login Successful.");
                    $window.sessionStorage.setItem('token', response.data.token);
                    $window.sessionStorage.setItem('voterId', response.data.voterId);
                    $window.sessionStorage.setItem('voterName', response.data.name);
                    $window.sessionStorage.setItem('voterArea', response.data.area);
                    let candi = JSON.stringify(response.data.candidates);
                    $window.sessionStorage.setItem('candidates', candi);

                    $location.url('/vote');
                }
                else{
                    console.log("Error: " + response.data.message);
                    if(response.data.success === -1){
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        $route.reload();
                    }
                    else if(response.data.success === -2){
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "Voter not registered. Please Signup.";
                    }
                    else if(response.data.success === -5){
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "No Candidates registered.";
                    }
                    else if(response.data.success === -8){
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "Already Voted!\nCast Number: " + response.data.cast;
                    }
                    else{
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "Sorry, there was an error. Please try again.";
                    }
                }
            }
        });
    }

    $scope.loginVariablesObj.showPassword = false;

    $scope.togglePassword = function(){
        $scope.loginVariablesObj.showPassword = !$scope.loginVariablesObj.showPassword;
    }

    // validation for loginID input field
    $scope.loginFormInputValidation = (function(){
        console.log("loginFormInputValidation");
        let Regex = /\b[a-zA-Z0-9]{32}\b/;
        return {
            test: function(value) {
                let check1 = Regex.test(value);
                return check1;
            }
        }
    })();

}]);

app.controller('voteCtrl', ['$scope', '$location', '$window', '$timeout', '$rootScope', 'apiCall', 'commonFunctions', function($scope, $location, $window, $timeout, $rootScope, apiCall, commonFunctions){
    console.log("Inside voteCtrl");

    $rootScope.voterName = $window.sessionStorage.getItem('voterName');
    $rootScope.voterArea = $window.sessionStorage.getItem('voterArea');
    $scope.candidates = JSON.parse($window.sessionStorage.getItem('candidates'));
    $scope.voteVariablesObj = {};

    $scope.voteVariablesObj.showNavDropdown = false;

    $scope.navbarDropdownOpen = function(){
        console.log("show dropdown");
        $scope.voteVariablesObj.showNavDropdown = true;
    };

    $scope.navbarDropdownHide = function(){
        console.log("hide dropdown");
        $scope.voteVariablesObj.showNavDropdown = false;
    };

    // logout portion
    $scope.voteVariablesObj.logoutDisabled = false;

    $scope.logout = function(){
        $window.sessionStorage.clear();
        $location.url('/');
    }

    $scope.castVote = function(candidate){

        let voteObj = {
            voterId: $window.sessionStorage.getItem('voterId'),
            candidate: candidate
        };
        apiCall.castVote(voteObj, function(response){
            if(response.status !== 200){
                if(response.status === -1){
                    console.log("Not connected to internet.");
                    $scope.voteVariablesObj.loginErrorMsg = true;
                    document.getElementById('loginPageErrMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                    $timeout(function(){
                        $scope.voteVariablesObj.loginErrorMsg = false;
                    }, 5000)
                }
                else{
                    console.log("Sorry, there was an error. Please try again.");
                    $scope.voteVariablesObj.loginErrorMsg = true;
                    document.getElementById('loginPageErrMsg').innerHTML = "Sorry, there was an error. Please try again.";
                }
            }
            else{
                if(response.data.success === 1){
                    console.log("Voting Successful!");
                } else {
                    console.log("Error voting");
                }
                $window.sessionStorage.clear();
                $location.url('/');
            }
        });
    };

}]);

app.controller('tempCtrl', ['$scope', '$location', '$window', '$timeout', '$rootScope', 'apiCall', 'commonFunctions', function($scope, $location, $window, $timeout, $rootScope, apiCall, commonFunctions){
    console.log("Inside tempCtrl.");

    apiCall.temp(function (err) {
        $location.url('/');
    })
}]);
