
var app = angular.module('myApp', ['ngCookies','angularSpinkit']);
app.controller('validateCtrl', function($scope,$http,$cookies,$window) {
$scope.login=function(){


console.log($cookies.get('token'));
$scope.prograssing = true;
 $http({
    url: 'http://192.168.0.93:45455/api/login',
    dataType: 'json',
    method: 'POST',
    data: $scope.User,
    headers: {
       
          "Content-Type": "application/json"
    }
}).then(function (response) {
	 var expireDate = new Date();
       var expiry=parseInt(response.headers()['tokenexpiry']);
        expireDate.setTime(expireDate.getTime() + (expiry* 60 * 1000));
	console.log("success "+response.data); 
console.log(expireDate); 
console.log(expiry);
//console.log(response.headers()['tokenexpiry']);
        
        
                       if (response.headers()['token']) {
                        
                      
 
                       $cookies.put('token',response.headers()['token'],{'expires': expireDate});
                       $cookies.put('UserId',response.headers()['userid'],{'expires': expireDate});
                       $cookies.put('UserName',response.headers()['username'],{'expires':expireDate});
                       $cookies.put('UserEmail',response.headers()['useremail'],{'expires': expireDate});
                       $cookies.put('UserRole',response.headers()['userrole'],{'expires': expireDate});
                        console.log($cookies.get('token'));
                        console.log($cookies.get('UserId'));
                       // $http.defaults.headers.common['token']=$cookies.get('token');
                     $scope.prograssing =false;
                        $window.location.href ='homepage.html';
                     
                    } else {
                        
                        alert("error");
                    }
	 
}, function (response) {
	console.log("failure "+response.status);
$scope.prograssing = false;
$scope.showPopup=true;
   // $scope.any = response.status;


});
}; 
$scope.close=function(){
$scope.showPopup=false;
};
$scope.check=function(){
console.log($cookies.get('token'));
if($cookies.get('token'))
return true;
else
return false;
};

});
app.directive("loginGroup", function($cookies) {
var innerData;
if($cookies.get('token')){
innerData=$cookies.get('UserName')+"<input type='button' value='signout' ng-click='signOut()'>";
}
else{
innerData="<input type='button' value='Admin Section' ng-click='openAdmin()'><a href='login.html'><input type='button' value='Login'></a><a href='signup.html'><input type='button' value='Sign up' ></a>"    
}
return {
        restrict : "C",
        template : innerData
     

       
    };
});

app.factory('httpRequestInterceptor', function ($cookies) {
  return {
   'request': function(config) {
           console.log("second "+$cookies.get('token'));
                //config.headers=config.headers || {};
               config.headers['token'] = $cookies.get('token');
                console.log("config " +config.headers.token);
          return config;
    }
  };
});

     app.config(['$httpProvider', function ($httpProvider) {
    //$httpProvider.defaults.headers.post['token'] = 'your_token';
    $httpProvider.interceptors.push('httpRequestInterceptor');
    
}]);

