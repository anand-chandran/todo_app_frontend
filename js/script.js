var base_URL = "https://todo-backend-app.herokuapp.com/api";
// var base_URL = "http://localhost:3000/api";
$(".ui.dropdown").dropdown();

function showNewTaskForm() {
  $("#new-task-form").modal("show");
}

function hideNewTaskForm() {
  $("#new-task-form").modal("hide");
}

axios.get(base_URL + "/tasks/show").then(res => {
  console.log(res.data);
  res.data.map(item => {
    createElement(item);
  });
});

var a = document.getElementById("btn");
a.addEventListener("click", function(event) {
  event.preventDefault();
  createNewTask();
  hideNewTaskForm();
});

//function to make axios request to backend
function createNewTask() {
  var difficulty = document.getElementById("label");
  let dueDate = document.getElementById("due-date").value;
  difficulty = difficulty.options[difficulty.selectedIndex].value;
  console.log("Difficulty ", difficulty);
  console.log("due date: ", dueDate);
  var title = document.getElementById("sectionText").value;
  if (title != "" && difficulty != "") {
    var body = {
      title: title,
      label: difficulty,
      status: "pending",
      subtasks: [],
      date: dueDate
    };
    axios
      .post(base_URL + "/tasks/create", body)
      .then(res => {
        console.log("Create response", res);
        //create element when successful
        createElement(res.data);
      })
      .catch(err => console.log("ERROR", err));
  }
}
//create subtask on backend
function createNewSubTask(subTask) {
  console.log("SDADA", subTask);
  axios
    .post(base_URL + "/sub_tasks/create/" + subTask.parent_id, {
      title: subTask.title
    })
    .then(res => console.log("SUB TASK ", res))
    .catch(err => console.log("Error ", err));
}

function appendSubTask(title, input) {
  var div = document.createElement("div");
  div.setAttribute("class", "listItem");
  var checkbox = document.createElement("INPUT");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", "checker");
  div.appendChild(checkbox);
  var span = document.createElement("span");
  span.innerText = title;
  div.appendChild(span);
  input.parentNode.insertBefore(div, input);
}

function createElement(item) {
  console.log("Creating new Item", item);
  var elementID = item._id;
  console.log(elementID);
  var pendingDiv = document.getElementById("pendingArea");
  var section = document.createElement("section");
  section.setAttribute("class", "item");
  section.setAttribute("id", elementID);
  console.log("this is item", elementID);
  var checkbox = document.createElement("INPUT");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", "checker");
  checkbox.addEventListener("change", event => {
    if (event.target.checked) {
      document
        .getElementById("completedArea")
        .appendChild(event.target.parentElement);
    } else {
      document
        .getElementById("pendingArea")
        .appendChild(event.target.parentElement);
    }
  });

  section.appendChild(checkbox);

  var h3 = document.createElement("h3");
  var editBtn = document.createElement("button");
  editBtn.setAttribute("class", "ui button blue mini basic");
  editBtn.innerHTML = `<i class="edit icon"></i>Edit`;
  h3.innerText = item.title + "\t | \t" + item.label;
  section.appendChild(editBtn);

  var deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("class", "ui button red mini basic");
  deleteBtn.innerText = "Delete";
  deleteBtn.addEventListener("click", function() {
    const taskId = this.parentElement.getAttribute("id");
    console.log(taskId);
    axios.delete(base_URL + "/tasks/delete/" + taskId).then(res => {
      console.log("Working");
      this.parentElement.remove();
    });
  });
  section.appendChild(deleteBtn);
  section.appendChild(h3);
  console.log("SU TASK", item.subtasks);
  let textInputWrapper = document.createElement("div");
  textInputWrapper.setAttribute("class", "ui input mini pad-properly");
  var input = document.createElement("input");
  input.setAttribute("type", "text");

  textInputWrapper.appendChild(input);
  section.appendChild(textInputWrapper);

  var btn = document.createElement("button");
  btn.setAttribute("class", "ui button primary mini ");
  btn.innerText = "New sub todo";
  section.appendChild(btn);

  let hiddentDivider = document.createElement("div");
  hiddentDivider.setAttribute("class", "ui section divider");
  section.appendChild(hiddentDivider);

  pendingDiv.appendChild(section);
  btn.addEventListener(
    "click",
    function() {
      appendSubTask(input.value, textInputWrapper);
      var subTask = {
        title: input.value,
        parent_id: this.closest("section").attributes.id.value
      };
      createNewSubTask(subTask);
      input.setAttribute("value", "");
    },
    false
  );

  item.subtasks.map(item => {
    appendSubTask(item.title, textInputWrapper);
  });

  editBtn.addEventListener("click", function() {
    let todoId = this.parentElement.id;
    let todoTitleNode = this.nextElementSibling.nextSibling;
    let title = this.nextElementSibling.nextSibling.innerText;
    todoTitleNode.setAttribute("id", `edit-title-${todoId}`);
    let prevVal = todoTitleNode.innerHTML;
    todoTitleNode.innerHTML = `<input id="edit-${todoId}" type="text" value=${title} />
        <button class="ui button mini blue" onclick="updateTodo('edit-${todoId}')">Save</button>
        <button class="ui button mini" onclick="cancelUpdate('edit-title-${todoId}', '${prevVal}')">Cancel</button>
      `;
    // console.log(this.parentElement.id);
  });
}

function updateTodo(id) {
  console.log(id);
  let title = document.getElementById(id).value;
  let toCallId = id.substring(5, id.length);
  let requestBody = {
    title: title
  };
  axios.put(
    base_URL + "/tasks/update/" + toCallId, // this s not working look at line 170
    // base_URL + "/tasks/update/" + "5df27fb2d0d93e0a61e5cc2b", // this s working
    requestBody
  );
  console.log(requestBody);
}

function cancelUpdate(id, value) {
  console.log(value);
  document.getElementById(id).innerHTML = value;
}

function searchByTitle() {
  let searchTerm = document.getElementById("search-bar").value;
  let requestBody = {
    title: searchTerm
  };
  axios.post(base_URL + "/tasks/search", requestBody.title).then(res => {
    console.log("Working");
    // alert();
  });

  console.log(requestBody);
}
