//alert("JavaScript 运行成功！");
import { saveTasks, loadTasks } from "./storage.js";

const todoInput = document.getElementById("todoInput");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todoList");
const message = document.getElementById("message");
const allButton = document.getElementById("allButton");
const activeButton = document.getElementById("activeButton");
const completedButton = document.getElementById("completedButton");
const taskCount = document.getElementById("taskCount");

let tasks = loadTasks();

function addTodo() {
    const text = todoInput.value.trim();
    message.textContent = "";
    if (text === "") {
        message.textContent = "请输入任务";
        return;
    }

    const task = { //创建对象
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);//添加到数组
    saveTasks(tasks);//存储到浏览器
    renderTasks();//每次重新渲染页面

    todoInput.value = "";
    todoInput.focus();//让这个输入框获得焦点
}

function createTaskElement(task) {  //添加对应任务文本
    const li = document.createElement("li");//createElement(标签名)，创建元素
    const span = document.createElement("span");
    span.textContent = task.text;
    span.addEventListener("click", function () {//点击-completed更新
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks();
    });
    li.appendChild(span);

    if (task.completed === true) {
        span.classList.add("completed");
    }

    return li;
}

function createDeleteButton(task) {  //删除对应任务文本
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "删除";

    deleteButton.addEventListener("click", function () {
        const index = tasks.findIndex(function (item) {
            return item.id === task.id;
        });
        if (index !== -1) {
            tasks.splice(index, 1);
            saveTasks(tasks);
            renderTasks();
        }
    });

    return deleteButton;
}

addButton.addEventListener("click", function () {  //点击按钮-添加
    addTodo();
});
todoInput.addEventListener("keydown", function (event) {  //Enter键-添加
    if (event.key === "Enter") {
        addTodo();
    }
});

let currentFilter = "all";

allButton.addEventListener("click", function () { //全部-按钮
    currentFilter = "all";
    renderTasks();
});

activeButton.addEventListener("click", function () {//未完成
    currentFilter = "active";
    renderTasks();
});

completedButton.addEventListener("click", function () {//完成
    currentFilter = "completed";
    renderTasks();
});




function renderTasks() {  //更新todoList
    todoList.innerHTML = "";
    let filteredTasks = tasks;

    if(currentFilter === "all"){
        const unfinish = tasks.filter(function (item) { 
            return item.completed === false;
        });
        taskCount.textContent = "总计：" + filteredTasks.length + "个，未完成：" + 
        unfinish.length + "个";
    }

    if (currentFilter === "active") {
        filteredTasks = tasks.filter(function (item) { 
            return item.completed === false;
        });
        taskCount.textContent = "未完成：" + filteredTasks.length + "个";
    }

    if (currentFilter === "completed") {
        filteredTasks = tasks.filter(function (item) { 
            return item.completed === true;
        });
        taskCount.textContent = "完成：" + filteredTasks.length + "个";
    }

    filteredTasks.forEach(function (task) {
        const li = createTaskElement(task);
        const deleteButton = createDeleteButton(task);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });

    todoList.appendChild(taskCount);// 重新放到DOM树中
}




renderTasks();//进入网页刷新一次
