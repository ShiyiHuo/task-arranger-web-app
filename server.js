
var express=require("express");
var bodyParser=require("body-parser");
var app=express();

//use the parse to get JSON objects out of the request
app.use(bodyParser.json());

//server static files from the public/ directory
app.use(express.static('public'));

var taskList=[];

//server get table after task addition

app.post("/add", function(req,res) {
    taskList.push(req.body);
});

app.get("/data", function(req,res) {
    //console.log("/getdata");
    res.json(taskList);
});


//remove selected tasks
app.delete("/remove", function(req,res) {
    //taskToRemove list
    var tasksToRemove=req.body.removeLabel;

    for (i=0; i<taskList.length; i++) {
        for (j=0; j<tasksToRemove.length; j++) {
            var currentTaskToRemove=tasksToRemove[j];
            var taskNameRemove=currentTaskToRemove.taskN;
            var taskProjectRemove=currentTaskToRemove.projectN;
           
            if (taskList[i].taskN==taskNameRemove &&
                taskList[i].projectN==taskProjectRemove) {
                //starting at index position i, remove one element
                taskList.splice(i,1);
            }
        }
    }
         
});

app.listen(3000,function() {
    console.log("Listening on port 3000");
});

