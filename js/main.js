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

function createTaskElement(task) {  //添加对应任务文本-按钮
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

function deleteTask(id) {  //删除任务
    const index = tasks.findIndex(function (item) {
        return item.id === id;
    });
    if (index !== -1) {
        tasks.splice(index, 1);
        saveTasks(tasks);
        renderTasks();
    }
}

function createDeleteButton(task) {  //创建删除按钮
    const deleteButton = document.createElement("button");

    deleteButton.textContent = "删除";
    deleteButton.classList.add("delete-btn"); //加类
    deleteButton.dataset.id = task.id;

    return deleteButton;
}

function editTask(id) {  //编辑文本
    const name = prompt("请输入任务名称");

    //如果这边true，右边不管。排除：NULL.trim()报错
    if (name === null ||name.trim() === "" ) {  
        return;
    }

    const index = tasks.findIndex(function(item){
        return item.id === id;
    })
    if(index != -1){
        if(tasks[index].text === name.trim()){return;}
    tasks[index].text = name.trim();
    saveTasks(tasks);
    renderTasks();
    }
}

function createEditButton(task) {  //创建编辑按钮
    const editButton = document.createElement("button");

    editButton.textContent = "编辑";
    editButton.classList.add("edit-btn");
    editButton.dataset.id = task.id;

    return editButton;
}






addButton.addEventListener("click", function () {  //添加按钮-添加
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

activeButton.addEventListener("click", function () {//未完成-按钮
    currentFilter = "active";
    renderTasks();
});

completedButton.addEventListener("click", function () {//完成-按钮
    currentFilter = "completed";
    renderTasks();
});


function renderTasks() {  //更新todoList
    todoList.innerHTML = "";
    let filteredTasks = tasks;

    if (currentFilter === "all") {
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
        const editButton = createEditButton(task);
        const deleteButton = createDeleteButton(task);

        li.appendChild(editButton);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });

    todoList.appendChild(taskCount);// 重新放到DOM树中
}

todoList.addEventListener("click", function (event) { //todoList加监控
    //如果被点击元素是类delete-btn
    if (event.target.classList.contains("delete-btn")) {
        //id是被点击元素的
        const id = Number(event.target.dataset.id);
        deleteTask(id);//执行函数，删除对应任务
    }

    if (event.target.classList.contains("edit-btn")) {
        const id = Number(event.target.dataset.id);
        editTask(id);
    }

});

















renderTasks();//进入网页刷新一次
