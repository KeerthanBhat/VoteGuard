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
    .otherwise({
        redirectTo: "/"
    })

}]);

app.run(function($rootScope, $location, $window, $route){
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		console.log("routeChangeStart fired.");
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

app.factory('apiCall', function($http, $window, $location, commonDataFactory){
    let apiCall = {};

    apiCall.catchResponseError = function(error, catchResponseErrorCallback){
        if(error.status === 401){
            console.log("Not logged in.");
            commonDataFactory.storedDataObj = {};
            $window.localStorage.clear();
            $location.url('/');
        }
        else{
            catchResponseErrorCallback(error);
        }
    }

    apiCall.addHeader = function(){
        return {headers: {"X-Auth-Token": $window.localStorage.getItem('token')}};
    }

    apiCall.login = function(loginApiCallObj, loginApiCallback){
        console.log("inside login API call.");
        return $http.post('/login', loginApiCallObj)
        .then(function(response){
            console.log("success response.data : %j ",response);
            loginApiCallback(response);
        })
        .catch(function(error){
            console.log("fail response.data : %j ",error);
            loginApiCallback(error);
        })
    }

    apiCall.logout = function(logoutApiCallObj, logoutApiCallback){
        console.log("inside logout API call.");
        let logoutHeaderObj = apiCall.addHeader();
        return $http.post('/logout', logoutApiCallObj, logoutHeaderObj)
        .then(function(response){
            console.log("success response.data : %j ",response);
            logoutApiCallback(response);
        })
        .catch(function(error){
            console.log("fail response.data : %j ",error);
            apiCall.catchResponseError(error, logoutApiCallback);
        })
    }

    return apiCall;
});

app.factory('alertsAndDialogs', function($mdDialog){

let alertsAndDialogs = {};

    alertsAndDialogs.alert = function(parentContainer, title, text, ariaLabel, btn){
        $mdDialog.show(
        $mdDialog.alert()
        .parent(angular.element(document.querySelector(parentContainer)))
        .clickOutsideToClose(true)
        .title(title)
        .textContent(text)
        .ariaLabel(ariaLabel)
        .ok(btn)
        .targetEvent()
        );
    }

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
        }

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
    }

    return commonFunctions;

});

app.controller('loginCtrl', ['$scope', '$location', '$window', '$timeout', '$rootScope', 'apiCall', 'commonFunctions', function($scope, $location, $window, $timeout, $rootScope, apiCall, commonFunctions){
    console.log("Inside loginCtrl.");
    $scope.loginVariablesObj = {};
    $scope.loginVariablesObj.loginButtonDisabled = false;
    $scope.loginVariablesObj.loginErrorMsg = false;
    $scope.loginFrm = {};
    $scope.login = function(userId, pass){
        console.log(userId);
        console.log(pass);
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
                    $window.sessionStorage.setItem('candidates', response.data.candidates);

                    $location.url('/vote');
                }
                else{
                    console.log("Error: " + response.data.message);
                    if(response.data.success === -1){
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "Wrong Password.";
                    }
                    else if(response.data.success === -2){
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "Voter not registered. Please Signup.";
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
        let Regex = /\b[a-zA-Z0-9]{12}\b/;
        return {
            test: function(value) {
                let check1 = Regex.test(value);
                return check1;
            }
        }
    })();

}]);

app.controller('voteCtrl', ['$scope', '$location', '$window', '$timeout', '$rootScope', 'apiCall', 'commonFunctions', function($scope, $location, $window, $timeout, $rootScope, apiCall, commonFunctions){
    console.log("Inside voteCtrl.");

    /*
    $scope.loginVariablesObj = {};
    $scope.loginVariablesObj.loginButtonDisabled = false;
    $scope.loginVariablesObj.loginErrorMsg = false;
    $scope.loginFrm = {};
    $scope.login = function(userId, pass){
        console.log(userId);
        console.log(pass);
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
                    $window.localStorage.setItem('token', response.data.token);
                    $window.localStorage.setItem('voterId', response.data.voterId);
                    $window.localStorage.setItem('voterName', response.data.name);
                    $window.localStorage.setItem('voterArea', response.data.area);
                    $window.localStorage.setItem('candidates', response.data.candidates);

                    $location.url('/vote');
                }
                else{
                    console.log("Error: " + response.data.message);
                    if(response.data.success === -1){
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "Wrong Password.";
                    }
                    else if(response.data.success === -2){
                        $scope.loginVariablesObj.loginErrorMsg = true;
                        document.getElementById('loginPageErrMsg').innerHTML = "Voter not registered. Please Signup.";
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
        let Regex = /\b[a-zA-Z0-9]{12}\b/;
        return {
            test: function(value) {
                let check1 = Regex.test(value);
                return check1;
            }
        }
    })();

     */

}]);

app.controller('homeCtrl', ['$scope', '$location', '$window', '$mdDialog', '$rootScope', '$timeout', 'apiCall', 'commonDataFactory', 'bankData', 'commonFunctions', 'alertsAndDialogs', function($scope, $location, $window, $mdDialog, $rootScope, $timeout, apiCall, commonDataFactory, bankData, commonFunctions, alertsAndDialogs){
    console.log("Inside homeCtrl.");
    $scope.homeVariablesObj = {};

    // change css when selecting menu bar links portion
    $scope.homeVariablesObj.hoverAllTrans = false;
    $scope.homeVariablesObj.hoverPendingTrans = false;
    $scope.homeVariablesObj.hoverSettledTrans = false;

    //navbar open and close portion
    $scope.homeVariablesObj.showNavDropdown = false;
    $scope.homeVariablesObj.outletDropdownShow = false;


    $scope.navbarDropdownOpen = function(){
        console.log("show dropdown");
        $scope.homeVariablesObj.showNavDropdown = true;
    }

    $scope.navbarDropdownHide = function(){
        console.log("hide dropdown");
        $scope.homeVariablesObj.showNavDropdown = false;
    }

    $scope.outletDropdownToggle = function(){
        console.log("outlet dropdown toggled.");
        if($scope.homeVariablesObj.outletDropdownShow === false){
            $scope.homeVariablesObj.outletDropdownShow = true;
        }
        else{
            $scope.homeVariablesObj.outletDropdownShow = false;
        }
    }
    // add condition for keyboard clicks as well
    $window.onclick = function(event){
        let isNavbarClick = event.target.id === "profileIcon";
        let isOutletListClick = event.target.id === "outletListToggle";
        let isOutletListIconClick = event.target.id === "outletListToggleIcon";

        if(isOutletListClick || isOutletListIconClick){
            $scope.homeVariablesObj.showNavDropdown = false;
        }
        else if(isNavbarClick){
            $scope.homeVariablesObj.outletDropdownShow = false;
        }
        else{
            $scope.homeVariablesObj.showNavDropdown = false;
            $scope.homeVariablesObj.outletDropdownShow = false;
        }
        $scope.$apply();
    }

    // logout portion
    $scope.homeVariablesObj.logoutDisabled = false;

    $scope.logout = function(){
        let logoutObj = {
            reg_id: ""
        }
        if($scope.homeVariablesObj.logoutDisabled === false){
            $scope.homeVariablesObj.logoutDisabled = true;
            apiCall.logout(logoutObj, function(response){
                $scope.homeVariablesObj.logoutDisabled = false;
                if(response.status !== 200){
                    console.log("Sorry, there was an error. Please try again.");
                    if(response.status === -1){
                        console.log("Error connecting. Check Internet & Retry.");
                        alertsAndDialogs.alert("alertContainer", "No Internet Connection", "Error connecting. Check Internet & Retry.", "No Internet Connection Alert", "OK");
                    }
                    else{
                        alertsAndDialogs.alert("alertContainer", "Error", "Sorry, there was an error. Please try again.", "Error Alert", "OK");
                    }
                }
                else{
                    if(response.data.success === 1){
                        console.log("Logout Successful.");
                        commonDataFactory.storedDataObj = {};
                        $window.localStorage.clear();
                        $location.url('/');
                    }
                    else{
                        console.log("Error: " + response.data.message);
                        alertsAndDialogs.alert("alertContainer", "Error", "Sorry, there was an error. Please try again.", "Error Alert", "OK");
                    }
                }
            });
        }
    }

    // change password portion
    $scope.openChangePassDialog = function(){
        console.log("inside openChangePassDialog function.");
        $scope.changePass = {};
        $scope.homeVariablesObj.changePassShowErr = false;
        $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            templateUrl: '../views/changePassDialog.html',
        })
        .catch(function(){
            alertsAndDialogs.alert('alertContainer', 'Error', 'Sorry, there was an error. Please try again.', 'Error Alert', 'OK');
        })
    }

    $scope.closeChangePassDialog = function(){
        console.log("inside closeChangePassDialog function.");
        $mdDialog.hide();
    }
    // change password show/hide toggle
    $scope.homeVariablesObj.showPassword = false;
    $scope.homeVariablesObj.disableChangePass = false;

    $scope.toggleChangePasswordShow = function(){
        $scope.homeVariablesObj.showPassword = !$scope.homeVariablesObj.showPassword;
    }

    $scope.changePassConfirm = function(oldPass, newPass, confirmPass){
        console.log(oldPass);
        console.log(newPass);
        console.log(confirmPass);
        if(newPass !== confirmPass){
            console.log("Password mismatch.");
            $scope.homeVariablesObj.changePassShowErr = true;
            document.getElementById('changePassFormErrorMsg').innerHTML = "Password mismatch.";
        }
        else{
            let changePassObj = {
                new_pass: newPass,
                old_pass: oldPass,
                reg_id: ""
            }
            $scope.homeVariablesObj.disableChangePass = true;
            apiCall.changePass(changePassObj, function(response){
                $scope.homeVariablesObj.disableChangePass = false;
                if(response.status !== 200){
                    if(response.status === -1){
                        $scope.homeVariablesObj.changePassShowErr = true;
                        document.getElementById('changePassFormErrorMsg').innerHTML = "Error connecting. Check Internet & Retry.";
                    }
                    else{
                        console.log("Sorry, there was an error. Please try again.");
                        $scope.homeVariablesObj.changePassShowErr = true;
                        document.getElementById('changePassFormErrorMsg').innerHTML = "Sorry, there was an error. Please try again.";
                    }
                }
                else{
                    if(response.data.success === 1){
                        console.log("password changed successfully.");
                        $mdDialog.hide();
                    }
                    else{
                        console.log("Error: " + response.data.message);
                        if(response.data.success === -1){
                            $scope.homeVariablesObj.changePassShowErr = true;
                            document.getElementById('changePassFormErrorMsg').innerHTML = "Incorrect Current Password.";
                        }
                        else if(response.data.success === -10){
                            let time = commonFunctions.convertTime(response.data.time);
                            $scope.homeVariablesObj.changePassShowErr = true;
                            document.getElementById('changePassFormErrorMsg').innerHTML = "Attempts exceeded. Please retry after" + time + ".";
                        }
                        else{
                            $scope.homeVariablesObj.changePassShowErr = true;
                            document.getElementById('changePassFormErrorMsg').innerHTML = "Sorry, there was an error. Please try again.";
                        }
                    }
                }
            });
        }
    }

    $scope.openContactDialog = function(){
        console.log("contact us dialog opened");
        $mdDialog.show({
            scope: $scope,
            preserveScope: true,
            templateUrl: '../views/contactUsDialog.html',
        })
        .catch(function(){
            alertsAndDialogs.alert('alertContainer', 'Error', 'Sorry, there was an error. Please try again.', 'Error Alert', 'OK');
        })
    }

    $scope.closeContactDialog = function(){
        console.log("close contact us dialog");
        $mdDialog.hide();
    }

    // check if the data factory variables have been declared.
    if(commonDataFactory.storedDataObj.allTrans === undefined){
        console.log("Variables not declared.");
        commonDataFactory.declareVariablesFunc();
    }

    // get all the values stored in localStorage (eg. merch name, address, outlets, etc.)
    $rootScope.loggedInMerchantName = $window.localStorage.getItem('merchName');
    // to reset the value upon logout.
    $rootScope.loggedInMerchantAddress = undefined;
    if($window.localStorage.getItem('merchAddress') !== null){
        $rootScope.loggedInMerchantAddress = $window.localStorage.getItem('merchAddress');
    }
    // to reset the value upon logout.
    $rootScope.loggedInMerchantParType = undefined;
    if($window.localStorage.getItem('parType') !== null){
        $rootScope.loggedInMerchantParType = Number($window.localStorage.getItem('parType'));
    }
    $rootScope.outletArr = [];
    if($window.localStorage.getItem('merchsArr') !== null){
        $rootScope.outletArr = JSON.parse($window.localStorage.getItem('merchsArr'));
        for(let i = 0; i < $rootScope.outletArr.length; i++) {
            if($rootScope.outletArr[i].area2 !== null && $rootScope.outletArr[i].area2 !== undefined && $rootScope.outletArr[i].area2 !== ""){
                $rootScope.outletArr[i].address = $rootScope.outletArr[i].area2 + ", " + $rootScope.outletArr[i].area1;
            }
            else{
                $rootScope.outletArr[i].address = $rootScope.outletArr[i].area1;
            }
        }
    }

    // menu button click functions
    $scope.getAllTransactions = function(){
        let params = $location.search();
        if(params.hasOwnProperty('outlId')){
            $location.search({'outlId': params.outlId, 'transType': 'all', 'page': 1});
        }
        else{
            $location.search({'allTransPage': 1});
        }
    }

    $scope.getPendingTransactions = function(){
        let params = $location.search();
        if(params.hasOwnProperty('outlId')){
            $location.search({'outlId': params.outlId, 'transType': 'pending', 'page': 1});
        }
        else{
            $location.search({'pendingTransPage': 1});
        }
    }

    $scope.getSettledTransactions = function(){
        let params = $location.search();
        if(params.hasOwnProperty('outlId')){
            $location.search({'outlId': params.outlId, 'transType': 'settled', 'page': 1});
        }
        else{
            $location.search({'settledTransPage': 1});
        }
    }

    //URL parameter conditionals
    if(JSON.stringify($location.search()) === "{}"){
        $scope.homeVariablesObj.selectedMer = "All Outlets";
    }

    else if($location.search().allTransPage !== undefined){
        if($location.search().allTransPage === true || $location.search().allTransPage === ""){
            $location.search({'allTransPage': 1});
        }
        else{
            console.log("In homeCtrl getAllTrans called.");
            $scope.homeVariablesObj.getAllTrans = true;
            $scope.homeVariablesObj.getPendingTrans = false;
            $scope.homeVariablesObj.getSettledTrans = false;
            $scope.homeVariablesObj.selectedMerId = "allOutlets";
            $scope.homeVariablesObj.selectedMer = "All Outlets";
        }
    }

    else if($location.search().pendingTransPage !== undefined){
        if($location.search().pendingTransPage === true || $location.search().pendingTransPage === ""){
            $location.search({'pendingTransPage': 1});
        }
        else{
            console.log("In homeCtrl getPendingTrans called.");
            $scope.homeVariablesObj.getAllTrans = false;
            $scope.homeVariablesObj.getPendingTrans = true;
            $scope.homeVariablesObj.getSettledTrans = false;
            $scope.homeVariablesObj.selectedMerId = "allOutlets";
            $scope.homeVariablesObj.selectedMer = "All Outlets";
        }
    }

    else if($location.search().settledTransPage !== undefined){
        if($location.search().settledTransPage === true || $location.search().settledTransPage === ""){
            $location.search({'settledTransPage': 1});
        }
        else{
            console.log("In homeCtrl getSettledTrans called.");
            $scope.homeVariablesObj.getAllTrans = false;
            $scope.homeVariablesObj.getPendingTrans = false;
            $scope.homeVariablesObj.getSettledTrans = true;
            $scope.homeVariablesObj.selectedMerId = "allOutlets";
            $scope.homeVariablesObj.selectedMer = "All Outlets";
        }
    }

    else if($location.search().outlId !== undefined && $location.search().transType === undefined){
        $scope.homeVariablesObj.selectedMerId = $location.search().outlId;
        for(let i = 0; i < $rootScope.outletArr.length; i++){
            if($rootScope.outletArr[i].merId === $scope.homeVariablesObj.selectedMerId){
                if($rootScope.loggedInMerchantParType === 1){
                    $scope.homeVariablesObj.selectedMer = $rootScope.outletArr[i].address;
                }
                else{
                    $scope.homeVariablesObj.selectedMer = $rootScope.outletArr[i].shop_name;
                }
                break;
            }
            if(i === $rootScope.outletArr.length - 1){
                $scope.homeVariablesObj.selectedMer = "No merchant found";
            }
        }
    }

    else if($location.search().outlId !== undefined && $location.search().transType !== undefined){
        if($location.search().page === undefined || $location.search().page === true || $location.search().page === ""){
            $location.search("page", 1);
        }
        else{
            $scope.homeVariablesObj.selectedMerId = $location.search().outlId;
            for(let i = 0; i < $rootScope.outletArr.length; i++){
                if($rootScope.outletArr[i].merId === $scope.homeVariablesObj.selectedMerId){
                    if($rootScope.loggedInMerchantParType === 1){
                        $scope.homeVariablesObj.selectedMer = $rootScope.outletArr[i].address;
                    }
                    else{
                        $scope.homeVariablesObj.selectedMer = $rootScope.outletArr[i].shop_name;
                    }
                    break;
                }
                if(i === $rootScope.outletArr.length - 1){
                    $scope.homeVariablesObj.selectedMer = "No merchant found";
                }
            }
            console.log($location.search());
            if($location.search().transType === "all"){
                console.log("In homeCtrl getAllTrans for outlet called.");
                $scope.homeVariablesObj.getAllTrans = true;
                $scope.homeVariablesObj.getPendingTrans = false;
                $scope.homeVariablesObj.getSettledTrans = false;
            }
            else if($location.search().transType === "pending"){
                console.log("In homeCtrl getPendingTrans for outlet called.");
                $scope.homeVariablesObj.getAllTrans = false;
                $scope.homeVariablesObj.getPendingTrans = true;
                $scope.homeVariablesObj.getSettledTrans = false;
            }
            else if($location.search().transType === "settled"){
                console.log("In homeCtrl getSettledTrans for outlet called.");
                $scope.homeVariablesObj.getAllTrans = false;
                $scope.homeVariablesObj.getPendingTrans = false;
                $scope.homeVariablesObj.getSettledTrans = true;
            }
            else{
                let params = $location.search();
                $location.search({outlId: params.outlId});
            }
        }
    }

    else{
        $location.search({});
    }

    $scope.getOutletTrans = function(merId){
        console.log("Outlet selected");
        let params = $location.search();
        if(JSON.stringify(params) === "{}" || (params.hasOwnProperty('outlId') && !params.hasOwnProperty('transType'))){
            if(merId === "allOutlets"){
                $location.search({});
            }
            else{
                console.log("selected outlet in homePage.");
                $location.search({'outlId': merId});
            }
        }
        else if(params.hasOwnProperty('allTransPage') || (params.hasOwnProperty('transType') && params.transType === "all")){
            if(merId === "allOutlets"){
                $location.search({'allTransPage': 1});
            }
            else{
                console.log("selected outlet in allTransPage.");
                $location.search({'outlId': merId, 'transType': 'all', 'page': 1});
            }
        }
        else if(params.hasOwnProperty('pendingTransPage') || (params.hasOwnProperty('transType') && params.transType === "pending")){
            if(merId === "allOutlets"){
                $location.search({'pendingTransPage': 1});
            }
            else{
                console.log("selected outlet in pendingTransPage.");
                $location.search({'outlId': merId, 'transType': 'pending', 'page': 1});
            }
        }
        else if(params.hasOwnProperty('settledTransPage') || (params.hasOwnProperty('transType') && params.transType === "settled")){
            if(merId === "allOutlets"){
                $location.search({'settledTransPage': 1});
            }
            else{
                console.log("selected outlet in settledTransPage.");
                $location.search({'outlId': merId, 'transType': 'settled', 'page': 1});
            }
        }
    }

    $scope.$on("openTransDialog", function(event, transDetls){
        console.log("catching emitted signal");
        $scope.openMobSizeDialog(transDetls);
    });

    $scope.openMobSizeDialog = function(transDetls){
        $scope.viewSettlementDetlsMerch = transDetls;
        console.log($scope.viewSettlementDetlsMerch);
        $mdDialog.show ({
            /*clickOutsideToClose: true,*/
            scope: $scope,
            preserveScope: true,
            templateUrl: '../views/transDialog.html',
        })
        .catch(function(){
            alertsAndDialogs.alert('alertContainer', 'Error', 'Sorry, there was an error. Please try again.', 'Error Alert', 'OK');
        })
    }

    $scope.closeMobSizeDialog = function(){
        console.log("close dialog");
        $mdDialog.hide();
        $location.search('transDialog', null);
    }

    $scope.displayTransDialogFunc = function(){
        console.log("displayTransDialogFunc called.");
        $location.search('transDialog', true);
    }

}]);
