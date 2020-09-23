// To Do List using JQuery for selection

gsap.from(".taskBlock", {opacity: 0.5, y:-10, duration: 2});
gsap.from(".headingBox" , {opacity: 0.5, x:-100, duration:2});
gsap.from(".alltasks" , {opacity: 0.5, y:-10, duration:2});

//Side Buttons
const addButton = $("#addicon");
const displayCompleted = $("#completedListBtn");
const displayAllList = $("#allTaskBtn");
const clearButton = $("#clear");
const taskTitle = $("#title");

//wrapper
const toDoList = $("#todoTaskList");
const completedTasksList = $("#completedTaskList");

//Local Storage
const storedDataToDoList =localStorage.getItem('dataToDoList');  //getting task from local storage
const storedCompletedToDoList =localStorage.getItem('dataCompletedToDoList');  //getting completed task from local storage

const dataToDoList = (storedDataToDoList && JSON.parse(storedDataToDoList.split(","))) || []; // checking the local storage array
const dataCompletedToDoList = (storedCompletedToDoList && JSON.parse(storedCompletedToDoList.split(","))) || []; //checking for completed list array

// New task layout
const newTemplate = function(taskObj) {
  let oneTask = document.createElement("li");
  let editBtn = document.createElement("img");
  let completeBtn = document.createElement("img");
  let clearTask = document.createElement("img");
  let taskElement = document.createElement("p");
  let label = document.createElement("label");
  let editTask = document.createElement("input");
  let taskDate = document.createElement("p");

    oneTask.className = "taskListItem"
    taskElement.innerText = taskObj.title;
    label.innerText = taskObj.title;
    editTask.type = "text";
    editBtn.src = "./images/edit.svg";
    editBtn.className = "taskButton edit";
    completeBtn.src = "./images/complete.svg";
    completeBtn.className = "taskButton complete";
    clearTask.src = "./images/delete.svg";
    clearTask.className = "taskButton clear";
    taskDate.innerText = taskObj.date;
    taskDate.className = "dateClass";

    oneTask.append(taskElement);
    oneTask.append(label);
    oneTask.append(editTask);
    oneTask.append(editBtn);
    oneTask.append(completeBtn);
    oneTask.append(clearTask);
    oneTask.append(taskDate);

  return oneTask;
}

const storeTask = function () {
  window.localStorage.setItem("dataToDoList", JSON.stringify(dataToDoList));
  window.localStorage.setItem("dataCompletedToDoList", JSON.stringify(dataCompletedToDoList));
}

//Create new task and add to local storage
const addTask = function (taskItem, container, save) {   
  let oneTask = newTemplate(taskItem);
  container.append(oneTask);
  // bindTaskEvents(oneTask, taskCompleted);
  if(save) dataToDoList.push(taskItem);
}

//clean list
const buildGenericList = function (list, container) {
  container.innerHTML='';
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

  let date = new Date()
  date = date.getUTCDate() + "-" + (date.getUTCMonth()+1) + "-" + date.getUTCFullYear(); 
  let taskItem= {
    'title':value, 
    'date' : date
  }

  addTask(taskItem, toDoList, true);
  storeTask();
  title.value = "";
  gsap.from(".taskListItem" , {opacity: 0.9, y:-10, duration:0.3});
}

//Edit Task in list
// const editTaskFun = function() {
//   let oneTask = this.parentNode;
//   let listTask =oneTask.parentNode;
//   let pos =[...listTask.children].indexOf(oneTask);
//   let editTask = oneTask.querySelector("input[type=text]");
//   let taskElement = oneTask.querySelector("p");
//   let label = oneTask.querySelector("label");

//   let editCondition = oneTask.classList.contains("editValue");
//   if (editCondition) {
//     taskElement.innerText = editTask.value;
//     label.innerText = editTask.value;
//     } else {
//         editTask.value = taskElement.innerText;
//         editTask.value = label.innerText;       
//   }

//   dataToDoList[pos].title = editTask.value;
//   storeTask();
//   oneTask.classList.toggle("editValue");
// }

// Removing task from list
// const taskClear = function(event) {
//   let oneTask = this.parentNode;
//   let listTask =oneTask.parentNode;
//   let pos =[...listTask.children].indexOf(oneTask);

//   if (listTask.getAttribute('id') ==='completedTaskList') {
//     dataCompletedToDoList.splice(pos,1);
//   } else {
//     dataToDoList.splice(pos,1);
//   }
//   render();    //render list again
//   storeTask();   //save to local storage
// }

//Completed tasks in system
// const taskCompleted = function() {

//   let oneTask = this.parentNode;
//   let pos =[...oneTask.parentNode.children].indexOf(oneTask);

//   //data array manipultaion
//   let obj = dataToDoList[pos];
//   dataCompletedToDoList.push(obj);
//   dataToDoList.splice(pos,1);
//   render();    //render list again
//   storeTask();    //save to local storage
// }

//Incomplete tasks in the list
// const taskIncomplete = function(e) {
//     let oneTask = this.parentNode;
//     toDoList.append(oneTask);
//     bindTaskEvents(oneTask, taskCompleted);
// }

//Clear all the task from the list
// const clear = function() {
//     toDoList.innerHTML = "";
//     completedTasksList.innerHTML = "";
//     dataToDoList= [];
//     dataCompletedToDoList =[];
//     storeTask();
// }

// On click event handler
const bindTaskEvents = function(taskList) {
    let editBtn = taskList.querySelector("img.edit");
    editBtn.onclick = editTaskFun;
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
  $("#displayCompleted").css("display","block");
  $("#displayToDo").css("display","none");
  $("#taskTemplate").css("display","none");
}

function displayAll(){
  $("#displayCompleted").css("display","block");
  $("#displayToDo").css("display","block");
  $("#taskTemplate").css("display","block");
}

//event handler
function init() {
  render();
  addButton.on("mouseover",animateAddbutton);
  addButton.on("click", addTaskHandler);
  taskTitle.on("keyup", function (event) { 
    if (event.keyCode == 13) { 
        addTaskHandler(); 
    } 
  }); 
  clearButton.on('click', clear);
  displayCompleted.on('click', displayComplete);
  displayAllList.on('click', displayAll);
}

//build stored list
function render () {
  buildGenericList(dataToDoList, toDoList);
  buildGenericList(dataCompletedToDoList, completedTasksList);
}

init()