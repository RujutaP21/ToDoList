//Firebase configuration

gsap.from(".taskBlock", {opacity: 0.5, y:-10, duration: 2});
gsap.from(".headingBox" , {opacity: 0.5, x:-100, duration:2});
gsap.from(".alltasks" , {opacity: 0.5, y:-10, duration:2});

const taskTitle = document.getElementById("title");
const addButton = document.getElementById("addicon");
const displayCompleted = document.getElementById("completedListBtn");
const displayAllList = document.getElementById("allTaskBtn");
const clearButton = document.getElementById("clear");

//wrapper
const toDoList = document.getElementById("todoTaskList");
const completedTasksList = document.getElementById("completedTaskList");

function addTask() {
  const value = title.value;
  if (value == "") {
    return;
  }
  
  let date = new Date()
  date = date.getUTCDate() + "-" + (date.getUTCMonth()+1) + "-" + date.getUTCFullYear() + ":" + date.getTime(); 

  let datatodo = firebase.database().ref("dataToDoList/");
  let taskKey = datatodo.push().key
  datatodo.child(taskKey).set({
    'key' : taskKey,
    'title':value, 
    'date' : date,
  });

  title.value = "";
  // gsap.from(".taskListItem" , {opacity: 0.9, y:-10, duration:0.3});
}

//Edit Task in list
function editTask() {

  let oneTask = this.parentNode;
  let datatodo = firebase.database().ref("dataToDoList/");
  let editTask = oneTask.querySelector("input[type=text]");
  let taskElement = oneTask.querySelector("p");
  let editCondition = oneTask.classList.contains("editValue");
  let key= oneTask.getAttribute('key')
  let date = new Date()
  date = date.getUTCDate() + "-" + (date.getUTCMonth()+1) + "-" + date.getUTCFullYear(); 

  if (editCondition) {
    taskElement.innerText = editTask.value;
    datatodo.child(key).update({
      'title':editTask.value, 
      'date' : date
    });
    } else {
       editTask.value = taskElement.innerText;      
  }
  oneTask.classList.toggle("editValue");
}

// Removing task from list
function taskClear() {
  let oneTask = this.parentNode;
  let key= oneTask.getAttribute('key');
  let datatodo = firebase.database().ref("dataToDoList/");
  let datacompletetodo = firebase.database().ref("dataCompletedToDoList/");
  datatodo.child(key).remove();
  datacompletetodo.child(key).remove();
}

//Completed tasks in system
function taskCompleted() {
  let oneTask = this.parentNode;
  let datatodo = firebase.database().ref("dataToDoList/");
  let key= oneTask.getAttribute('key');
  let taskElement = oneTask.querySelector("p");
  let date = new Date()
  date = date.getUTCDate() + "-" + (date.getUTCMonth()+1) + "-" + date.getUTCFullYear(); 

  const completedData = {
    'title' : taskElement.innerText,
    'date' :date
  }
  let updates = {}
  updates['/dataCompletedToDoList/' + key] = completedData;
  updates['/dataToDoList/' + key ] = "";
  firebase.database().ref().update(updates);
  renderInit(completedTasksList,datacompletetodo);
  datatodo.child(key).remove();
}

// //Clear all the task from the list
const clear = function() {
  toDoList.innerHTML = "";
  completedTasksList.innerHTML = "";
  let datatodo = firebase.database().ref("dataToDoList/");
  let datacompletetodo = firebase.database().ref("dataCompletedToDoList/");
  datacompletetodo.remove();
  datatodo.remove();
}

//On click event handler
const bindTaskEvents = function(oneTask) {
  let editBtn = oneTask.querySelector("img.edit");
  editBtn.onclick = editTask;
  let completeBtn = oneTask.querySelector("img.complete");
  completeBtn.onclick = taskCompleted;
  let clearTask = oneTask.querySelector("img.clear");
  clearTask.onclick = taskClear;
}

function animateAddbutton(){
  gsap.to('#add',0.1,{rotate:10, yoyo:true, repeat:2, duration:1});
  gsap.from('#add',0.1,{rotate:-10, yoyo:true, repeat:2, duration:1});
}

function displayComplete(){
  document.getElementById("displayCompleted").style.display = "block";
  document.getElementById("displayToDo").style.display = "none";
  document.getElementById("taskTemplate").style.display = "none";
}

function displayAll(){
  document.getElementById("displayCompleted").style.display = "block";
  document.getElementById("displayToDo").style.display = "block";
  document.getElementById("taskTemplate").style.display = "block";
}

//event handler
function init() {
  addButton.addEventListener("mouseover",animateAddbutton);
  addButton.addEventListener("click", addTask);
  taskTitle.addEventListener("keyup", function (event) { 
    if (event.keyCode == 13) { 
        addTask(); 
    } 
  }); 
  clearButton.addEventListener('click', clear);
  displayCompleted.addEventListener('click', displayComplete);
  displayAllList.addEventListener('click', displayAll);
  renderInit(toDoList,datatodo);
  renderInit(completedTasksList,datacompletetodo);
}

let datatodo = firebase.database().ref("dataToDoList/");
let datacompletetodo = firebase.database().ref("dataCompletedToDoList/");

//New task template
function renderInit(container,datastore) {
  //draw all the list
  datastore.on('value',function (snapshot) {
    container.innerHTML = "";

    snapshot.forEach(function(childSnapshot){

      let oneTask = document.createElement("li");
      let editBtn = document.createElement("img");
      let completeBtn = document.createElement("img");
      let clearTask = document.createElement("img");
      let taskElement = document.createElement("p");
      let editTask = document.createElement("input");
      let taskDate = document.createElement("p");

        oneTask.className = "taskListItem"
        oneTask.setAttribute('key', childSnapshot.val().key)
        taskElement.innerText = childSnapshot.val().title;
        taskDate.innerText = childSnapshot.val().date;
        taskDate.className = "dateClass";
        editTask.type = "text";
        editBtn.src = "./images/edit.svg";
        editBtn.className = "taskButton edit";
        completeBtn.src = "./images/complete.svg";
        completeBtn.className = "taskButton complete";
        clearTask.src = "./images/delete.svg";
        clearTask.className = "taskButton clear";

      container.appendChild(oneTask);
      oneTask.appendChild(taskElement);
      oneTask.appendChild(editTask);
      oneTask.appendChild(editBtn);
      oneTask.appendChild(completeBtn);
      oneTask.appendChild(clearTask);
      oneTask.appendChild(taskDate);

      bindTaskEvents(oneTask);
    });
  });
}

init()