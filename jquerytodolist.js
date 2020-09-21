gsap.from(".taskBlock", {opacity: 0.5, y:-10, duration: 2});
gsap.from(".headingBox" , {opacity: 0.5, x:-100, duration:2});
gsap.from(".alltasks" , {opacity: 0.5, y:-10, duration:2});

//Side Buttons
$addButton = $("#addicon");
$displayCompleted = $("#completedListBtn");
$displayAllList = $("#allTaskBtn");
$clearButton = $("#clear");

//wrapper
$toDoList = $("#todoTaskList");
$completedTasksList = $("#completedTaskList");

//Local Storage
$storedDataToDoList =localStorage.getItem('dataToDoList');  //getting task from local storage
$storedCompletedToDoList =localStorage.getItem('dataCompletedToDoList');  //getting completed task from local storage

$dataToDoList = (storedDataToDoList && storedDataToDoList.split(",")) || []; // checking the local storage array
$dataCompletedToDoList = (storedCompletedToDoList && storedCompletedToDoList.split(",")) || []; //checking for completed list array

// New task layout
const newTemplate = function(taskId) {

  let oneTask = document.createElement("li");
  let editBtn = document.createElement("img");
  let completeBtn = document.createElement("img");
  let clearTask = document.createElement("img");
  let taskElement = document.createElement("p");
  let label = document.createElement("label");
  let editTask = document.createElement("input");
  let taskDate = document.createElement("p");
  let date = new Date();

    oneTask.className = "taskListItem"
    taskElement.innerText = taskId;
    label.innerText =taskId;
    editTask.type = "text";
    editBtn.src = "./images/edit.svg";
    editBtn.className = "taskButton edit";
    completeBtn.src = "./images/complete.svg";
    completeBtn.className = "taskButton complete";
    clearTask.src = "./images/delete.svg";
    clearTask.className = "taskButton clear";
    taskDate.innerText = date.getUTCDate() + "-" + (date.getUTCMonth()+1) + "-" + date.getUTCFullYear();
    taskDate.className = "dateClass";

    oneTask.appendChild(taskElement);
    oneTask.appendChild(label);
    oneTask.appendChild(editTask);
    oneTask.appendChild(editBtn);
    oneTask.appendChild(completeBtn);
    oneTask.appendChild(clearTask);
    oneTask.appendChild(taskDate);

  return oneTask;
}

const storeTask = function () {
  window.localStorage.setItem("dataToDoList", dataToDoList);
  window.localStorage.setItem("dataCompletedToDoList", dataCompletedToDoList);
}

const storeCompletedTask = function() {
  window.localStorage.setItem("dataCompletedToDoList", dataCompletedToDoList);
}

//Create new task and add to local storage
const addTask = function (value, container, save) {
  let oneTask = newTemplate(value);
  container.appendChild(oneTask);
  bindTaskEvents(oneTask, taskCompleted);
  //toDoList.appendChild(oneTask);
  if(save) dataToDoList.push(value);
}


const buildGenericList = function (list, container) {
  list.map((item) => {
    addTask(item, container, false);
  })    
}

//Add new task to the list and local storage
const addTaskHandler = function(event){
  const value = title.value;
  if (value == "") {
    return;
  }
  addTask(value, toDoList, true);
  storeTask(value);
  title.value = "";
  gsap.from(".taskListItem" , {opacity: 0.9, y:-10, duration:0.3});
}

//Edit Task in list
const editTaskFun = function() {
  let oneTask = this.parentNode;
  let editTask = oneTask.querySelector("input[type=text]");
  let taskElement = oneTask.querySelector("p");
  let label = oneTask.querySelector("label");
  let labelstorage = oneTask.getElementsByTagName("label")[0].innerText;
  removeTask(labelstorage);
  storeTask(labelstorage);
  let editCondition = oneTask.classList.contains("editValue");
  if (editCondition) {
    taskElement.innerText = editTask.value;
    label.innerText = editTask.value;
    } else {
        editTask.value = taskElement.innerText;
        editTask.value = label.innerText;
  }
  dataToDoList.push(editTask.value);
  storeTask();
  oneTask.classList.toggle("editValue");
}

// Removing task from list
const taskClear = function(event) {
  let oneTask = this.parentNode;
  let label = oneTask.getElementsByTagName("label")[0].innerText;
  let ul = oneTask.parentNode;
  ul.removeChild(oneTask);
  removeTask(label);
  removeCompleteTask(label);
  storeTask();
}

//Removing deleted task from local storage
const removeTask = function (value) {
  dataToDoList = dataToDoList.filter((item) => (item != value));
}

const removeCompleteTask = function(value){
  dataCompletedToDoList = dataCompletedToDoList.filter((item) => (item != value));
}

//Completed tasks in system
const taskCompleted = function() {
  let oneTask = this.parentNode;
  completedTasksList.appendChild(oneTask);
  let label = oneTask.getElementsByTagName("label")[0].innerText;
  dataCompletedToDoList.push(label);
  removeTask(label);
  storeTask();
  storeCompletedTask();
}

//Incomplete tasks in the list
const taskIncomplete = function(e) {
    let oneTask = this.parentNode;
    toDoList.appendChild(oneTask);
    bindTaskEvents(oneTask, taskCompleted);
}

//Clear all the task from the list
const clear = function() {
    toDoList.innerHTML = "";
    completedTasksList.innerHTML = "";
    dataToDoList= [];
    dataCompletedToDoList =[];
    storeTask();
    storeCompletedTask();
}

//On click event handler
const bindTaskEvents = function(taskList, taskElementEventHandler) {
    let taskElement = taskList.querySelector('label'); 
    let editBtn = taskList.querySelector("img.edit");
    editBtn.onclick = editTaskFun;
    let completeBtn = taskList.querySelector("img.complete");
    completeBtn.onclick = taskCompleted;
    let clearTask = taskList.querySelector("img.clear");
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

function init() {

  //build stored list
  buildGenericList(dataToDoList, toDoList);
  buildGenericList(dataCompletedToDoList, completedTasksList);

  //handler
  addButton.addEventListener("mouseover",animateAddbutton);
  addButton.addEventListener("click", addTaskHandler);
  clearButton.addEventListener('click', clear);
  displayCompleted.addEventListener('click', displayComplete);
  displayAllList.addEventListener('click', displayAll);
}

init()