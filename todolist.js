// To Do List in pure javascript

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

const storedDataToDoList =localStorage.getItem('dataToDoList');  //getting task from local storage
const storedCompletedToDoList =localStorage.getItem('dataCompletedToDoList');  //getting completed task from local storage

let dataToDoList = (storedDataToDoList && storedDataToDoList.split(",")) || []; // checking the local storage array
let dataCompletedToDoList = (storedCompletedToDoList && storedCompletedToDoList.split(",")) || []; //checking for completed list array

// var database = firebase.database();

//New task template

const newTemplate = function(taskId) {
  let oneTask = document.createElement("li");
  let taskElement = document.createElement("p");
  let label = document.createElement("label");
  let editTask = document.createElement("input");
  let editBtn = document.createElement("img");
  let completeBtn = document.createElement("img");
  let clearTask = document.createElement("img");

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

    oneTask.appendChild(taskElement);
    oneTask.appendChild(label);
    oneTask.appendChild(editTask);
    oneTask.appendChild(editBtn);
    oneTask.appendChild(completeBtn);
    oneTask.appendChild(clearTask);

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
const editTask = function() {
  let oneTask = this.parentNode;
  let editTask = oneTask.querySelector("input[type=text]");
  let taskElement = oneTask.querySelector("p");
  let label = oneTask.querySelector("label");
  let editCondition = oneTask.classList.contains("editValue");
  if (editCondition) {
    taskElement.innerText = editTask.value;
    label.innerText = editTask.value;
    } else {
        editTask.value = taskElement.innerText;
        editTask.value = label.innerText;
    }
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
  //dataCompletedToDoList =dataCompletedToDoList.filter((item) => (item != value)); 
}

const removeCompleteTask = function(value){
  dataCompletedToDoList = dataCompletedToDoList.filter((item) => (item != value));
}

//Completed tasks in system
const taskCompleted = function() {
  let oneTask = this.parentNode;
  console.log(completedTasksList)
  completedTasksList.appendChild(oneTask);
  let label = oneTask.getElementsByTagName("label")[0].innerText;
  dataCompletedToDoList.push(label);
  console.log(oneTask);
  removeTask(label);
  console.log(label);
  storeTask();
  storeCompletedTask();
}

//Incomplete tasks in the list
// const taskIncomplete = function(e) {
//     let oneTask = this.parentNode;
//     toDoList.appendChild(oneTask);
//     bindTaskEvents(oneTask, taskCompleted);
// }

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
    editBtn.onclick = editTask;
    let completeBtn = taskList.querySelector("img.complete");
    completeBtn.onclick = taskCompleted;
    let clearTask = taskList.querySelector("img.clear");
    clearTask.onclick = taskClear;
}

function animateAddbutton(event){
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