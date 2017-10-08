var app=angular.module("myApp",['ngCookies','angularjs-dropdown-multiselect','angularSpinkit']);

app.controller("myCtrl2",function($scope,$cookies,$http,exchangeData,$window){
$scope.userRole=$cookies.get('UserRole');
$scope.firstPage=0;
$scope.pageSize=5;
console.log($scope.userRole);
if($scope.userRole==2){
$scope.prograssing=true;
$http.get("http://192.168.0.93:45455/api/task")
.then(function (response) {
	$scope.prograssing=false;
	console.log("success "+response.data);
	 $scope.record=response.data;

}, function (response) {
$scope.prograssing=false;
$scope.msg="error connecting to server";
$scope.showPopup=true;
	console.log("failure "+response.status);
   
});}
else{
$scope.prograssing=true;
var url="http://192.168.0.93:45455/api/UserTask/getTaskInUser?id="+$cookies.get('UserId');
$http.get(url)
    .then(function(response) {
       $scope.prograssing=false;
	console.log("success "+response.data);
	 $scope.record=response.data;
    
     }, function(response) {
       $scope.prograssing=false;
$scope.msg="error connecting to server";
$scope.showPopup=true;
	console.log("failure "+response.status);
    }); 
}
if($scope.userRole==2){
$http.get("http://192.168.0.93:45455/api/mentorTrainee")
.then(function (response) {
	
	console.log("success "+response.data);
	 $scope.traineeRecord=response.data;
 $scope.start=1;
        if($scope.traineeRecord.length%$scope.pageSize){$scope.end=parseInt($scope.traineeRecord.length/$scope.pageSize)+1}
        else{$scope.end=parseInt($scope.traineeRecord.length/$scope.pageSize)}

}, function (response) {
	console.log("failure "+response.status);
   
});
}

$scope.forward=function(){
$scope.firstPage=$scope.firstPage+$scope.pageSize;
$scope.start=$scope.start+1;

};
$scope.previous=function(){
$scope.firstPage=$scope.firstPage-$scope.pageSize;
$scope.start=$scope.start-1;


};
$scope.openHome=function(){
$window.location.href="homepage.html";
};
$scope.close=function(){
$scope.showPopup=false;
};
$scope.deleteTask=function(x){
console.log(x);
$http.delete("http://192.168.0.93:45455/api/task?id="+x)
.then(function (response) {
	
	console.log("success "+response.data);

	$http.get("http://192.168.0.93:45455/api/task")
.then(function (response) {
	
	console.log("success "+response.data);
	 $scope.record=response.data;

}, function (response) {
	console.log("failure "+response.status);
   
});

}, function (response) {

	console.log("failure "+response.statusText);
   
});
};
$scope.taskList=function(x){
//console.log(x.Id);
$cookies.put('taskId',x.Id);
if($scope.userRole==2)
$window.location.href ='topicTask.html';
else if($scope.userRole==3)
$window.location.href ='taskPage.html';
};
$scope.createTask=function(){
 $window.location.href="taskBlog.html";
};
$scope.traineeList=function(x){
$cookies.put('traineeId',x.Id);
$window.location.href ='traineeTask.html';
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



app.controller("topictask",function($scope,$http,$cookies,$window,$timeout){
var taskId=$cookies.get('taskId');
$scope.prograssing=true;
$http.get("http://192.168.0.93:45455/api/task")
.then(function (response) {
	$scope.prograssing=false;
	console.log("success "+response.data);
	for(var i=0;i<response.data.length;i++)
{
if(response.data[i].Id==taskId)
{
console.log(response.data[i].Name);
$scope.taskTitle=response.data[i].Name;
$scope.Description=response.data[i].Description;
}
}

}, function (response) {
	console.log("failure "+response.status);
   $scope.prograssing=false;
   $scope.msg="Error connecting to server";
   $scope.showPopup=true;
   
});

$http.get("http://192.168.0.93:45455/api/integrated/getByTaskId?id="+taskId)
.then(function(response){
console.log("successIntegrted "+response.data);
$scope.integrated=response.data;
},function(response){
console.log("failureIntegrted "+response.status);
});

$scope.deleteIntegrated=function(id){
$http.delete("http://192.168.0.93:45455/api/integrated?id="+id)
.then(function(response){
$http.get("http://192.168.0.93:45455/api/integrated/getByTaskId?id="+taskId)
.then(function(response){
console.log("successIntegrted "+response.data);
$scope.integrated=response.data;
},function(response){
console.log("failureIntegrted "+response.status);
});

},function(response){

});

};

$scope.setAccordian=function(x){
if($scope.accordian==x.Id)
$scope.accordian="";
else
$scope.accordian=x.Id;
};

$scope.addIntegrated=function(){
 $window.open('integratedSubmit.html', '_blank');
};
$scope.openHome=function(){
$window.location.href="homepage.html";
};

$scope.close=function(){
$scope.showPopup=false;
};
      
var url="http://192.168.0.93:45455/api/task_topic/getTopicNotInTask?id="+taskId; 
$http.get(url)
.then(function (response) {
	
	console.log("success "+response.data);
	$scope.resultsWithInfo=response.data;
}, function (response) {
     
	console.log("failure "+response.status);
   
});
      $scope.selected_Topics = [];
      $scope.selected_Topics_settings = {
        idProp:'Id',      	
        displayProp: 'Name',
        searchField: 'Name',
        enableSearch: true,
        scrollableHeight: '200px',
	scrollable: true,
        selectedToTop: true 
      };
      
      $scope.selected_Topics_customTexts = {buttonDefaultText: 'Add Topics'};



$scope.addTopic=function(){
var addTopic=[taskId];

console.log(addTopic[0]);
//var topics=[{"name":"Alt1","id":"something_unique2","idx":2,"eui":90},{"name":"Alt2","id":"something_unique3","idx":3,"eui":80}] ;

for(var i=0;i<$scope.selected_Topics.length;i++)
{

addTopic.push($scope.selected_Topics[i].id);
console.log(addTopic[i+1]);
}
$http.post("http://192.168.0.93:45455/api/task_topic",addTopic)
    .then(function(response) {
        console.log(response.data);
 $scope.selected_Topics=[];
        var url="http://192.168.0.93:45455/api/task_topic/getTopicNotInTask?id="+taskId; 
$http.get(url)
.then(function (response) {
	
	console.log("success "+response.data);
$scope.resultsWithInfo=response.data;
	
}, function (response) {
     
	console.log("failure "+response.status);
   
});
   
var url="http://192.168.0.93:45455/api/task_topic/getTopicInTask?id="+taskId;
$http.get(url)
    .then(function(response) {
        $scope.record=response.data;
       
     }, function(response) {
        console.log(response.status);
    });
    
  },function(response){
        
   
    });

};

var url="http://192.168.0.93:45455/api/task_topic/getTopicInTask?id="+taskId;
$http.get(url)
    .then(function(response) {
        $scope.record=response.data;
       
     }, function(response) {
        console.log(response.status);
    });


$scope.deleteTopic=function(Id){
console.log("id",Id);
var url="http://192.168.0.93:45455/api/task_topic?id="+Id;
$http.delete(url)
    .then(function(response) {
 console.log(response.status);

 var url="http://192.168.0.93:45455/api/task_topic/getTopicNotInTask?id="+taskId; 
$http.get(url)
.then(function (response) {
	
	console.log("success "+response.data);
$scope.resultsWithInfo=response.data;
	
}, function (response) {
     
	console.log("failure "+response.status);
   
});
   
var url="http://192.168.0.93:45455/api/task_topic/getTopicInTask?id="+taskId;
$http.get(url)
    .then(function(response) {
        $scope.record=response.data;
       
     }, function(response) {
        console.log(response.status);
    });
    
  
    },
function(response){
console.log(response.status);
});


};

$scope.editTask=function(){
console.log("submiss");
var data={
"Name":$scope.taskTitle,
"Description":$scope.Description

};
$scope.prograssing=true;
$http.put("http://192.168.0.93:45455/api/task?id="+taskId,data)
.then( function(response)
{

console.log("success "+response.data);
$scope.prograssing=false;
$scope.msg="Task edited";
$scope.showPopup=true;
},function(response){

console.log("failure "+response.status);
$scope.prograssing=false;
$scope.msg="Unable to complete submission  Try again...";
$scope.showPopup=true;

});
};
$scope.topicInfo=function(x){
$cookies.put('topicId',x.Topic.Id);
    $window.location.href ='TopicPage.html';
};


   $scope.signOut=function(){
  $cookies.remove('token');
    $cookies.remove('UserName');
 $cookies.remove('UserId');
 $cookies.remove('UserRole');
 $cookies.remove('UserEmail');
  $window.location.href ='homepage.html';
};
$scope.check=function(){
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


app.controller("topicCtrl",function($scope,$http,$cookies,$window){
var taskId=$cookies.get('taskId');
console.log(taskId);
$scope.prograssing=true;
var url="http://192.168.0.93:45455/api/UserSubmission/getByTaskId?id="+taskId;
$http.get(url)
    .then(function(response) {
        $scope.submissionRecord=response.data;
console.log("success");
   $scope.prograssing=false;
     }, function(response) {
        console.log("failure",response.status);
$scope.prograssing=false;
    });


$scope.prograssing=true;

$http.get("http://192.168.0.93:45455/api/UserTask/getTaskInUser?id="+$cookies.get('UserId'))
.then(function (response) {
	$scope.prograssing=false;
	console.log("success "+response.data);
for(var i=0;i<response.data.length;i++)
{	
if(taskId==response.data[i].Task.Id)
{
$scope.taskData=response.data[i];
	console.log("user task "+ $scope.taskData.Id);
$http.get("http://192.168.0.93:45455/api/UserTask/GetToggle?id="+$scope.taskData.Id)
.then(function(response){
console.log("successtoggle "+response.data);

},function(response){
console.log("failuretoggle "+response.status);
});
}
}

}, function (response) {
        scope.prograssing=false;
	console.log("failure "+response.status);
$scope.msg="Error connecting to server";   
$scope.showPopup=true;
});

$http.get("http://192.168.0.93:45455/api/integrated/getByTaskId?id="+taskId)
.then(function(response){
console.log("successIntegrted "+response.data);
$scope.integrated=response.data;
},function(response){
console.log("failureIntegrted "+response.status);
});


$scope.setAccordian=function(x){
if($scope.accordian==x.Id)
$scope.accordian="";
else
$scope.accordian=x.Id;
};




$scope.openHome=function(){
$window.location.href="homepage.html";
};
$scope.close=function(){
$scope.showPopup=false;
};
var url="http://192.168.0.93:45455/api/task_topic/getTopicInTask?id="+taskId;
$http.get(url)
    .then(function(response) {
        $scope.record=response.data;
       
     }, function(response) {
        console.log(response.status);
    });
$scope.removeSubmission=function(x){
	$http.delete("http://192.168.0.93:45455/api/UserSubmission?id="+x.Id)
    .then(function(response) {
    	 console.log(response.status);
$scope.prograssing=true;
var url="http://192.168.0.93:45455/api/UserSubmission/getByTaskId?id="+taskId;
$http.get(url)
    .then(function(response) {
        $scope.submissionRecord=response.data;
console.log("success submission");
   $scope.prograssing=false;
     }, function(response) {
        console.log("failure",response.status);
$scope.prograssing=false;
    });
     }, function(response) {
        console.log(response.status);
    });
};
$scope.topicInfo=function(x){
$cookies.put('topicId',x.Topic.Id);
    $window.location.href ='TopicPage.html';
};
$scope.addSubmission=function(){
 $window.open('taskSubmit.html', '_blank');
};
$scope.showSubmission=function(x){
  $cookies.put('submissionId',x.Id)
  $window.location.href ='traineeSubmissionShow.html';
};
$scope.check=function(){
if($cookies.get('token'))
return true;
else
return false;
};

  $scope.signOut=function(){
  $cookies.remove('token');
    $cookies.remove('UserName');
 $cookies.remove('UserId');
 $cookies.remove('UserRole');
 $cookies.remove('UserEmail');
  $window.location.href ='homepage.html';
};

});


app.controller("traineeSubmissionCtrl",function($scope,$http,$cookies,$window){
var taskId=$cookies.get('taskId');
var submissionId=$cookies.get('submissionId');
console.log(submissionId);
console.log(taskId);
$scope.prograssing=true;
$http.get("http://192.168.0.93:45455/api/task?id="+taskId)
.then(function (response) {
	$scope.prograssing=false;
	console.log("success "+response.data);
	
console.log(response.data.UserSubmission[0].Id);
for(var i=0;i<response.data.UserSubmission.length;i++){

if(submissionId==response.data.UserSubmission[i].Id)
$scope.responseData=response.data.UserSubmission[i];

}

}, function (response) {
	console.log("failure "+response.status);
   $scope.prograssing=false;
   $scope.msg="Problem Connecting to server";
  $scope.showPopup=true;
});
$scope.editSubmission=function(){
console.log("submiss");
var data={
"Post":$scope.responseData.Post,
"Head":$scope.responseData.Head,
"Type":'1'
};
$scope.prograssing=true;
$http.put("http://192.168.0.93:45455/api/UserSubmission?id="+submissionId,data)
.then( function(response)
{

console.log("success "+response.data);
$scope.prograssing=false;
$scope.msg="Submission edited";
$scope.showPopup=true;
},function(response){

console.log("failure "+response.status);
$scope.prograssing=false;
$scope.msg="Unable to complete submission  Try again...";
$scope.showPopup=true;

});
};
$scope.close=function(){
$scope.showPopup=false;

};

$scope.openHome=function(){
$window.location.href="homepage.html";
};
$scope.check=function(){
if($cookies.get('token'))
return true;
else
return false;
};

  $scope.signOut=function(){
  $cookies.remove('token');
    $cookies.remove('UserName');
 $cookies.remove('UserId');
 $cookies.remove('UserRole');
 $cookies.remove('UserEmail');
  $window.location.href ='homepage.html';
};
});


app.controller("submissionCtrl",function($scope,$http,$cookies,$window){
var traineeId=$cookies.get('traineeId');

var submissionId=$cookies.get('submissionId');


$scope.prograssing=true;

$http.get("http://192.168.0.93:45455/api/UserSubmission/getToggle?id="+submissionId)
.then (function(response){
console.log(response.data);
},function(response){
console.log(response.status);
});







var url="http://192.168.0.93:45455/api/UserSubmission/getByuserId?id="+traineeId;
$http.get(url)
    .then(function(response) {
 $scope.prograssing=false;
      // $scope.submissionRecord=response.data;
    for(var i=0;i<response.data.length;i++)
{
if(submissionId==response.data[i].Id){
$scope.submissionRecord=response.data[i];
$scope.commentList=response.data[i].MentorResponse;
}}
     }, function(response) {
$scope.prograssing=false;
$scope.msg="error connecting to server";
$scope.showPopup=true;
        console.log(response.status);
    }); 

$scope.openHome=function(){
$window.location.href="homepage.html";
};
$scope.close=function(){
$scope.showPopup=false;
};
$scope.postComment=function(){
var commentData={
"Comments":$scope.comment,
"Submission_Id":submissionId

};

$http.post("http://192.168.0.93:45455/api/MentorResponse",commentData)
.then(function(response){
console.log("success  ",response.data);
var url="http://192.168.0.93:45455/api/UserSubmission/getByuserId?id="+traineeId;
$http.get(url)
    .then(function(response) {
       // $scope.submissionRecord=response.data;
    for(var i=0;i<response.data.length;i++)
{
if(submissionId==response.data[i].Id){
$scope.submissionRecord=response.data[i];
$scope.commentList=response.data[i].MentorResponse;}
}
     }, function(response) {
        console.log(response.status);
    }); 

$scope.comment=[];
},function(response){
console.log("failure  ",response.status);
});
};
$scope.check=function(){
if($cookies.get('token'))
return true;
else
return false;
};
});



app.controller("traineeTaskCtrl",function($scope,$http,$cookies,$window,$timeout){
var traineeId=$cookies.get('traineeId');
 
$scope.addTask=function(){

var url="http://192.168.0.93:45455/api/UserTask";
var data={
"Deadline":$scope.deadline,
"User_Id":traineeId,
"Task_Id":$scope.selected_Topics[0].id
};
$http.post(url,data)
    .then(function(response) {
      
        console.log(response.status);
$scope.selected_Topics=[]
$scope.deadline="";
var url="http://192.168.0.93:45455/api/UserTask/getTaskInUser?id="+traineeId;
$http.get(url)
    .then(function(response) {
        $scope.record=response.data;
    
     }, function(response) {
        console.log(response.status);
    }); 

var url="http://192.168.0.93:45455/api/UserTask/getTaskNotInUser?id="+traineeId; 
$http.get(url)
.then(function(response) {
        $scope.resultsWithInfo=response.data;
       	//console.log("success "+response.data[0].Id);
     }, function(response) {
        console.log(response.status);
    });
    
     }, function(response) {
        console.log(response.status);
    }); 

};
$scope.deleteTopic=function(taskId){

var url="http://192.168.0.93:45455/api/UserTask?id="+taskId;
$http.delete(url)
    .then(function(response) {
       console.log(response.data);
    
var url="http://192.168.0.93:45455/api/UserTask/getTaskInUser?id="+traineeId;
$http.get(url)
    .then(function(response) {
        $scope.record=response.data;
    
     }, function(response) {
        console.log(response.status);
    }); 

var url="http://192.168.0.93:45455/api/UserTask/getTaskNotInUser?id="+traineeId; 
$http.get(url)
.then(function(response) {
        $scope.resultsWithInfo=response.data;
       	//console.log("success "+response.data[0].Id);
     }, function(response) {
        console.log(response.status);
    });    

     }, function(response) {
        console.log(response.status);
    }); 

};
   //$scope.prograssing=true; 
var url="http://192.168.0.93:45455/api/UserTask/getTaskInUser?id="+traineeId;
$http.get(url)
    .then(function(response) {
       //Sscope.prograssing=false;
        $scope.record=response.data;
    
     }, function(response) {
 console.log(response.status);
         //$scope.prograssing=false;
        $scope.msg="problem connecting to server"
 $scope.showPopup=true;   
   
    }); 
$scope.openHome=function(){
$window.location.href="homepage.html";
};
$scope.close=function(){
$scope.showPopup=false;
};

var url="http://192.168.0.93:45455/api/UserTask/getTaskNotInUser?id="+traineeId; 
$http.get(url)
.then(function(response) {
        $scope.resultsWithInfo=response.data;
       	//console.log("success "+response.data[0].Id);
     }, function(response) {
        console.log(response.status);
    });
$scope.prograssing=true;
var url="http://192.168.0.93:45455/api/UserSubmission/getByuserId?id="+traineeId;
$http.get(url)
    .then(function(response) {
        $scope.submissionRecord=response.data;
console.log("success");
   $scope.prograssing=false;
     }, function(response) {
        console.log("failure",response.status);
$scope.prograssing=false;
    }); 



//$scope.resultsWithInfo=[{"Id":"1","Name":"rishabh"},{"Id":"2","Name":"ashu"}];
      $scope.selected_Topics = [];
      $scope.selected_Topics_settings = {
        idProp:'Id',      	
        displayProp: 'Name',
        searchField: 'Name',
        enableSearch: true,
        scrollableHeight: '200px',
	scrollable: true,
       selectionLimit: 1,
        selectedToTop: true 
      };
      
      $scope.selected_Topics_customTexts = {buttonDefaultText: 'Add Task'};

$scope.check=function(){
if($cookies.get('token'))
return true;
else
return false;
};

  $scope.signOut=function(){
  $cookies.remove('token');
    $cookies.remove('UserName');
 $cookies.remove('UserId');
 $cookies.remove('UserRole');
 $cookies.remove('UserEmail');
  $window.location.href ='homepage.html';
};

$scope.viewSubmission=function(x){
  $cookies.put('submissionId',x.Id);
  $window.location.href ='submissionShow.html';
};
});







app.factory('httpRequestInterceptor', function ($cookies) {
  return {
   'request': function(config) {
           //console.log("second "+$cookies.get('token'));
                
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



