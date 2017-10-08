var app=angular.module("myApp",['ngSanitize','ngCookies','angularSpinkit']);


app.controller("myCtrl",function($scope,$http,$cookies,exchangeData,$window){
var topicId=$cookies.get('topicId');
console.log(topicId);
console.log($cookies.get('UserId'));
console.log($cookies.get('topicAuthor'));

$scope.resNames=['Documentations','requirements','resources','faq','sourcecode'];

var topicListData;

$scope.prograssing=true;
var url="http://192.168.0.93:45455/api/Topic?id="+topicId;
$http.get(url)
    .then(function(response) {
   $scope.prograssing=false;
       topicListData=response.data;
       $scope.title=topicListData.Name;
       $scope.documentation=topicListData.Documentations;
       $scope.description=topicListData.Description;
       $scope.requirements=topicListData.Requirements;
       $scope.resources=topicListData.Resources;
       $scope.faq=topicListData.FAQ;
       $scope.samplecode=topicListData.SourceCode; 
       
     }, function(response) {
        console.log(response.status);
 $scope.prograssing=false;
$scope.msg="error connecting to server";
   $scope.showPopup=true;
    });
$scope.close=function(){
$scope.showPopup=false;
};
$scope.topicPost=function(x,y){
console.log("resource id",x.Id);
console.log("author ",x.Author);
$cookies.put('subTopicId',x.Id);
$cookies.put('subTopic',y);
$cookies.put('Author',x.Author);
$window.location.href ='specificTopicPage.html';
};
$scope.editBlog=function(){

$cookies.put('topicAuthor',topicListData.Added_by);
console.log("tauthor ",$cookies.get('topicAuthor'));
 $window.open('editTopic.html', '_blank');
};
$scope.openHome=function(){
$window.location.href="homepage.html";
};
   $scope.signOut=function(){
  $cookies.remove('token');
    $cookies.remove('UserName');
 $cookies.remove('UserId');
 $cookies.remove('UserRole');
 $cookies.remove('UserEmail');
  $window.location.href ='homepage.html';
};
$scope.openBlog=function(x){
$cookies.put('topicApi',x);

 $window.open('blogpage.html', '_blank');
 //$window.location.href="blogpage.html";
};
$scope.check=function(){
if($cookies.get('token'))
return true;
else
return false;
};

});




app.factory('httpRequestInterceptor', function ($cookies) {
  return {
   'request': function(config) {
          
                
               config.headers['token'] = $cookies.get('token');
                //console.log("config " +config.headers.token);
          return config;
    }
  };
});

     app.config(['$httpProvider', function ($httpProvider,$cookies) {
    //$httpProvider.defaults.headers.post['token'] =  $cookies.get('token');
    $httpProvider.interceptors.push('httpRequestInterceptor');
    
}]);

app.directive("loginGroup", function($cookies) {
var innerData;
if($cookies.get('token')){
innerData=$cookies.get('UserName')+"<input type='button' value='signout' ng-click='signOut()'>";
}
else{
innerData="<input type='button' value='Admin Section' ng-click='openAdmin()'><a href='login.html' style='text-decoration: none;'><input type='button' value='Login'></a><a href='signup.html' style='text-decoration: none;'><input type='button' value='Sign up' ></a>"    
}
return {
        restrict : "C",
        template : innerData
};
});
app.service('exchangeData',function(){
var s;
this.set=function(inData){
s=inData;
}
this.get=function(){
return s;
}
});




app.controller("myCtrl2",function($scope,$cookies,$http,$window){
$scope.prograssing=true;
$scope.firstPage=0;
$scope.pageSize=6;
$window.onclick = function() {
   console.log("clicked");


 $scope.$apply(function () {
      $scope.searchList=[];
    });
}
$http.get("http://192.168.0.93:45455/api/Topic")
.then(function (response) {
	
	//console.log("success "+response.data);
       $scope.prograssing=false;
	 $scope.record=response.data;
 


       $scope.start=1;
        if($scope.record.length%$scope.pageSize){$scope.end=parseInt($scope.record.length/$scope.pageSize)+1}
        else{$scope.end=parseInt($scope.record.length/$scope.pageSize)}

}, function (response) {
	console.log("failure "+response.status);
   $scope.prograssing=false;
    $scope.msg="error connecting to server";
   $scope.showPopup=true;
});

$scope.forward=function(){
$scope.firstPage=$scope.firstPage+$scope.pageSize;
$scope.start=$scope.start+1;

};
$scope.previous=function(){
$scope.firstPage=$scope.firstPage-$scope.pageSize;
$scope.start=$scope.start-1;


};

$scope.openTopic=function(x){
$cookies.put('topicId',x.Id);

$window.location.href="TopicPage.html";
};

$scope.callSearch=function(){
console.log($scope.searchList);
if($scope.searchList.length){
$http.get("http://192.168.0.93:45455/api/search?value="+$scope.searchList)
.then(function (response) {
	
	console.log("success "+response.data);
     $scope.searchRecords=response.data;

}, function (response) {
	console.log("failure "+response.status);

});
}

};
$scope.openSearchPage=function(){
if($scope.searchList.length){
$cookies.put('searchTerm',$scope.searchList);
$window.location.href="searchResult.html";
}
};

$scope.addTopic=function(){
$window.location.href="addTopic.html";
};
$scope.openHome=function(){
$window.location.href="homepage.html";
};
$scope.close=function(){
$scope.showPopup=false;
};
$scope.topicList=function(x){
//console.log(x.Id);
$cookies.put('topicId',x.Id);

$cookies.put('topicAuthor',x.Added_by);
$window.location.href ='TopicPage.html';
};
   $scope.signOut=function(){
  $cookies.remove('token');
    $cookies.remove('UserName');
 $cookies.remove('UserId');
 $cookies.remove('UserRole');
 $cookies.remove('UserEmail');
  $window.location.href ='topiclistpage.html';
};
$scope.check=function(){
if($cookies.get('token'))
return true;
else
return false;
};

});







app.controller("myCtrl3",function($scope,$http,$cookies,exchangeData,$window){
//$scope.BlogTitle="TBD";
//$scope.BlogContent="Watch This Space";
var url="http://192.168.0.93:45455/api/"+$cookies.get('subTopic')+"?id="+$cookies.get('subTopicId');
$scope.prograssing=true;
$http.get(url)
.then(function (response) {
	$scope.prograssing=false;
	console.log("success "+response.data);
	$scope.BlogTitle=response.data.Head;
        $scope.BlogContent=response.data.Post;

}, function (response) {
	console.log("failure "+response.status);
   $scope.prograssing=false;
$scope.msg="error connecting to server";
$scope.showPopup=true;
});

   $scope.signOut=function(){
  $cookies.remove('token');
    $cookies.remove('UserName');
 $cookies.remove('UserId');
 $cookies.remove('UserRole');
 $cookies.remove('UserEmail');
  $window.location.href ='specificTopicPage.html';
};
$scope.openHome=function(){
$window.location.href="homepage.html";
};
$scope.close=function(){
$scope.showPopup=false;
};
$scope.check=function(){
if($cookies.get('token'))
return true;
else
return false;
};
$scope.openBlog=function(){
//$window.location.href="editpage.html"; 
$window.open('editpage.html', '_blank');
};
});

app.directive("buttonGroupTwo", function($cookies) {
var innerData;


if($cookies.get('token')&&($cookies.get('UserId')==$cookies.get('Author'))){
innerData="<button ng-click='openBlog()'>Edit Blog</button>";
}
else{
innerData="";    
}
return {
        restrict : "C",
        template : innerData
  };
});
app.directive("buttonGroupThree", function($cookies) {
var innerData;


if($cookies.get('token')&&($cookies.get('UserId')==$cookies.get('topicAuthor'))){
innerData="<button ng-click='editBlog()'>Edit Description</button>";
}
else{
innerData="";    
}
return {
        restrict : "C",
        template : innerData
  };
});
