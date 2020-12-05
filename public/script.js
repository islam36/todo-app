let togglerBtn = document.querySelector('#add-todo-toggler');
let addTodoDiv = document.querySelector('#add-todo-div');
let todoDivActive = false;

togglerBtn.onclick = () => {
    addTodoDiv.classList.toggle('active');
    todoDivActive = !todoDivActive;

    if (todoDivActive) {
        togglerBtn.innerHTML = 'Hide the form';
    } else {
        togglerBtn.innerHTML = 'add new TODO';
    }
};