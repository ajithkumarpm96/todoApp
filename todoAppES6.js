const inputForm = document.getElementById('input_form');
const inputText = document.getElementById('text_area');
const todoList = document.getElementById('todo_list');

const onSubmitForm = event => {
    event.preventDefault();
    const task = inputText.value.trim();
    //if input is there pass the value to addTask() else show error.
    task ? (addTask(task), inputText.classList.remove('input-error')) : inputText.classList.add('input-error');
    inputText.value = '';
};

//  adding the task names and checkbox values to the localStorage
const addTask = (task, isCompleted = false) => { //use default parameter check whether the isCompleted has value . if no value => false
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []; // retrieving the array which all the tasks stored from localdata. if no array, return empty array.
    tasks.push({
        task,
        isCompleted
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
};

//to display and add the li elements as the user enters tasks, li element is added to its parent element which is todoList
const displayTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    todoList.innerHTML = tasks.map(item =>
        `
            <li>
                <div class="taskName-wrapper">
                    <input type="checkbox" ${item.isCompleted ? 'checked' : ''} onchange="toggleTaskStatus('${item.task}')"> 
                    <span class="task-name${item.isCompleted ? ' completed-task' : ''}" 
                        onclick="editTask(this, '${item.task}')" onblur="saveTask(this, '${item.task}')" contenteditable="false">${item.task}</span> 
                </div>
                <button onclick="deleteTask('${item.task}')">Delete</button>
            </li>
        `
    ).join(''); //this combines the array of HTML strings into a single HTML string.
};

//To set the status of checkbox and save to localStorage
const toggleTaskStatus = task => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].task === task) {
            tasks[i].isCompleted = !tasks[i].isCompleted;
            break; // Exit the loop once the task is found and updated
        }
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

// to make the taskName editable
const editTask = element => {
    element.contentEditable = true;
    element.focus();
}

// passes the value of new edited task and old name and store in the localStorage.
const saveTask = (element, oldTask) => {
    let newTask = element.textContent.trim();
    // Return early if the new task is empty or same as old
    if (!newTask || newTask === oldTask) {
        element.textContent = oldTask;
        return;
    }

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    // Update the task name
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].task === oldTask) {
            tasks[i].task = newTask;
            break; // Exit the loop once the task is found and updated
        }
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
    element.contentEditable = false;
    displayTasks();
}

//to delete the task and update the localData.
const deleteTask = task => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(item => item.task !== task) //filter through the array and returns whichever not equal to the task, which is the one user wants to delete. 
    localStorage.setItem('tasks', JSON.stringify(tasks)); //save the tasks which are note 'task'.
    displayTasks();
}

// to clear all the completed tasks.
const clearCompletedTasks = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(item => !item.isCompleted); // filter through the tasks having isCompleted not true and rest of the tasks are omitted.
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

displayTasks();