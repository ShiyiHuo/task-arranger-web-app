//when page reloads
window.onload =function(){
    //tableArray=[];
    //var htmlTable;
    //need to call getData()
    
    getData(function(data) {
            document.getElementById("response").innerHTML=JSONToTable(data);
            });
    

    document.getElementById('start-button').onclick=function() {
        startTiming=new Date();
        alert('Timer has started.');
        
    }
    
    document.getElementById('stop-button').onclick=function() {
        //get data from server side
        getData(function(data) {
                document.getElementById("response").innerHTML=JSONToTable(data);
                });

        stopTiming=new Date();
        var addLabel="add";
        
        var taskNameToAdd=document.getElementById('task-name-textbox').value;
        var projectNameToAdd=document.getElementById('project-name-textbox').value;
        
        
        var startTimeHour=(startTiming.getHours()<10?'0':'')+startTiming.getHours();
        var startTimeMinute=(startTiming.getMinutes()<10?'0':'')+startTiming.getMinutes();
        var startTimeSecond=(startTiming.getSeconds()<10?'0':'')+startTiming.getSeconds();
        var stopTimeHour=(stopTiming.getHours()<10?'0':'')+stopTiming.getHours();
        var stopTimeMinute=(stopTiming.getMinutes()<10?'0':'')+stopTiming.getMinutes();
        var stopTimeSecond=(stopTiming.getSeconds()<10?'0':'')+stopTiming.getSeconds();
        
        //now time difference is in second
        var timeDiff=(stopTiming-startTiming)/1000;
        
        //get seconds and remove seconds from the date
        var second=Math.round(timeDiff%60);
        timeDiff=Math.floor(timeDiff/60);
        //get minutes and remove minutes from the date
        var minute=Math.round(timeDiff%60);
        timeDiff=Math.floor(timeDiff/60);
        //get hours and remove hours from the date
        var hour=Math.round(timeDiff%24);
        timeDiff=Math.floor(timeDiff/24);
        
        //set the format of hour,minute and second
        var hourElapsed=hour;
        var minuteElapsed=(minute<10?'0':'')+minute;
        var secondElapsed=(second<10?'0':'')+second;
    
        var timeSpentToAdd=hourElapsed+":"+minuteElapsed+":"+secondElapsed;
        var startTimeToAdd=startTimeHour+":"+startTimeMinute+":"+startTimeSecond;
        var completionTimeToAdd=stopTimeHour+":"+stopTimeMinute+":"+stopTimeSecond;
        
        var taskToAdd={taskN: taskNameToAdd, projectN: projectNameToAdd, timeS: timeSpentToAdd, startT: startTimeToAdd, completionT: completionTimeToAdd};

        
        //send add message to server and add task into tasklist on server side
        var xhrAdd=new XMLHttpRequest();
        xhrAdd.open("POST","/add",true);
        xhrAdd.setRequestHeader("Content-type", "application/json");
        xhrAdd.send(JSON.stringify(taskToAdd));
        
        //get data from server side
        getData(function(data) {
            document.getElementById("response").innerHTML=JSONToTable(data);
        });
        
        //clear text boxes
        document.getElementById('task-name-textbox').value="";
        document.getElementById('project-name-textbox').value="";
    }
    
    
    
    document.getElementById('remove-button').onclick=function(){
        //get data from server side
        getData(function(data) {
                document.getElementById("response").innerHTML=JSONToTable(data);
                });
        
        var removeLabel="remove";
        
        var tableBeforeRemoval=document.getElementById("HTML-table");
        var tasksToRemove=[];
        
        console.log(tableBeforeRemoval.innerHTML);
        
        for (j=0; j<tableBeforeRemoval.rows.length; j++) {
            var row=tableBeforeRemoval.rows[j];
            //chkbox=row.cells[5].childNodes[0]
            if (row.cells[5].childNodes[0].checked==true) {
                var taskNameToDelete=row.cells[0].innerHTML;
                var projectNameToDelete=row.cells[1].innerHTML;
                var timeSpentToDelete=row.cells[2].innerHTML;
                var startTimeToDelete=row.cells[3].innerHTML;
                var completionTimeToDelete=row.cells[4].innerHTML;
                
                var taskToRemove={taskN: taskNameToDelete, projectN: projectNameToDelete, timeS: timeSpentToDelete, startT: startTimeToDelete, completionT: completionTimeToDelete};
            }
            tasksToRemove.push(taskToRemove);
        }
        
        
        //send remove message to server and remove specific task on server side
        var xhrRemove=new XMLHttpRequest();
        xhrRemove.open("DELETE","/remove",true);
        xhrRemove.setRequestHeader("Content-type", "application/json");
        xhrRemove.send(JSON.stringify({removeLabel: tasksToRemove}));
        
        //get data from server side
        getData(function(data) {
                document.getElementById("response").innerHTML=JSONToTable(data);
                });
        
        
    }
    
    
    //return html string
    function JSONToTable(list) {
        t="<table id='HTML-table'>";
        for (i=0; i<list.length; i++) {
            var obj=list[i];
            var taN=obj.taskN;
            var prN=obj.projectN;
            var tiS=obj.timeS;
            var stT=obj.startT;
            var coT=obj.completionT;
            var checkbox="<input type='checkbox'>"
            //var button="<button type='button' id='remove-button>Remove</button>";
            
            t=t+"<tr><td>"+taN+"</td><td>"+prN+"</td><td>"+tiS+"</td><td>"+stT+"</td><td>"+coT+"</td><td>"+checkbox+"</td></tr>";
        }
        t=t+"</table>";
        return t;
    }
    
    
    function getData(callback){
        //make request to /data here.
        var xhrGetData=new XMLHttpRequest();
        xhrGetData.open("GET","/data",true);
        xhrGetData.send();
        
        xhrGetData.onreadystatechange=function() {
            if (xhrGetData.readyState==4 && xhrGetData.status==200) {
                //console.log(xhrGetData.responseText);
                //document.getElementById("response").innerHTML=xhrGetData.responseText;
                callback(JSON.parse(xhrGetData.responseText));
                
            }
        };
        
    }


    
}
