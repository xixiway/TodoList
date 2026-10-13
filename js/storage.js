export function saveTasks(tasks){  //存储
    localStorage.setItem("tasks",JSON.stringify(tasks));
}

export function loadTasks(){  //读取
    const saved = localStorage.getItem("tasks");
    if(saved){
        return JSON.parse(saved);
    }

    return[];
}

