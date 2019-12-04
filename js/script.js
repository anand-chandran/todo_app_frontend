//import Axios from "axios";
var base_URL = "https://todo-backend-node.herokuapp.com/api"
axios.get(base_URL+"/tasks/show")
.then(res => {
    console.log(res.data)
    res.data.map((item)=>{
        createElement(item)
    })
});
var a = document.getElementById('btn');
a.addEventListener('click', function () {
    createNewTask()
})

//function to make axios request to backend
function createNewTask(){
    var difficulty = document.getElementById("label");
    difficulty = difficulty.options[difficulty.selectedIndex].value;
    console.log("Difficulty ",difficulty);
    var title = document.getElementById('sectionText').value;
    if(title != '' && difficulty != ''){
        var body = {
            "title" : title,
            "label" : difficulty,
            "status": "pending",
            "subtasks" : []
        }
        axios.post(base_URL+"/tasks/create",body).
            then(res => {
                    console.log("Create response",res)
                    //create element when successful
                    createElement(res.data)
                }).
                catch(err => console.log("ERROR",err))
    }
}
//create subtask on backend
function createNewSubTask(subTask){
    console.log("SDADA",subTask.parent_id)
    axios.post(base_URL+"/sub_tasks/create/"+subTask.parent_id,{title:subTask.title})
        .then(res => console.log("SUB TASK ",res))
        .catch(err => console.log("Error ",err))
}

function createElement(item){
    console.log("Creating new Item",item)
    var elementID = item.id;
    var pendingDiv = document.getElementById('pendingArea');
    var section = document.createElement('section');
    section.setAttribute('id', elementID);
    var checkbox = document.createElement('INPUT');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'checker');
        checkbox.addEventListener('change',(event)=>{
            if(event.target.checked){
                document.getElementById("completedArea").appendChild(event.target.parentElement)
            }
            else{
                document.getElementById("pendingArea").appendChild(event.target.parentElement)
            }
        })
        section.appendChild(checkbox);
        
    var h3 = document.createElement('p');
    h3.innerText = item.title +"\t | \t"+ item.label
    // h3.innerText = `${document.getElementById('sectionText').value} \t|\t ${document.getElementById('label').value} | ${  new Date(document.getElementById('due-date').value).toLocaleString()}`;
    section.appendChild(h3);
    console.log("SU TASK",item.subtasks)
    item.subtasks.map((item)=>{
        
    })
    var input = document.createElement('INPUT');
    input.setAttribute('type', 'text')
    section.appendChild(input);
    var btn = document.createElement('button');
    btn.innerText = 'New List Item'
    section.appendChild(btn);
    //var editBtn = document.createElement('button');
    var deleteBtn = document.createElement('button');
    //editBtn.innerText = 'Edit';
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click',function(){
        // deleteTask(this.closest("section").attributes.id.value)
        const taskId = this.parentElement.getAttribute("id");
        console.log(taskId)
        axios.delete(base_URL+"/tasks/delete/"+taskId)
				.then(res => {
        							console.log("Working")
    					        this.parentElement.remove();
    		});
    });
   
    //section.appendChild(editBtn);
    section.appendChild(deleteBtn);
    pendingDiv.appendChild(section)
    btn.addEventListener('click', function () {
        var div = document.createElement('div');
        div.setAttribute('class', 'listItem');
        var checkbox = document.createElement('INPUT');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'checker');
        div.appendChild(checkbox);
        var span = document.createElement('span')
        span.innerText = this.previousElementSibling.value;
        div.appendChild(span);
        input.parentNode.insertBefore(div, input);
        //use this.closest("section").attributes.id.value to get the id of the parent 
        var subTask ={
            title : this.previousElementSibling.value,
            parent_id: this.closest("section").attributes.id.value
        }

        createNewSubTask(subTask);
    }, false);
}
