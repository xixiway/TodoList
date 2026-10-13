//alert("JavaScript 运行成功！");
import {saveTasks,loadTasks} from "./storage.js";

const todoInput = document.getElementById("todoInput");
const addButton = document.getElementById("addButton");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const message = document.getElementById("message");

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
        span.classList.toggle("completed");
    });
    li.appendChild(span);

    if(task.completed === true){
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

function renderTasks() {  //更新todoList
    todoList.innerHTML = "";
    
    tasks.forEach(function (task) {
        const li = createTaskElement(task);
        const deleteButton = createDeleteButton(task);
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });

    const taskCount = document.createElement("p");
    const unfinished = tasks.filter(function (item) { //更新任务数量
        return item.completed === false;
    });
    taskCount.textContent = "剩余未完成：" + unfinished.length + "个";
    todoList.appendChild(taskCount);
}








renderTasks();
//Git 图像界面测试