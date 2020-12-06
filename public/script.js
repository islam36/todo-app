let togglerBtn = document.querySelector('#add-todo-toggler');
let addTodoDiv = document.querySelector('#add-todo-div');
let table = document.querySelector('main table');
let todoDivActive = false;
const url = 'http://localhost:3000';

togglerBtn.onclick = () => {
    addTodoDiv.classList.toggle('active');
    todoDivActive = !todoDivActive;

    if (todoDivActive) {
        togglerBtn.innerHTML = 'Hide the form';
    } else {
        togglerBtn.innerHTML = 'add new TODO';
    }
};


function createTodo(todo) {
    if(todo != null) {
        let row = document.createElement('tr');
        row.id = todo._id.toString();
        row.innerHTML = `
            <td>${todo.title}</td>
            <td>${todo.description}</td>
            <td>${todo.deadline}</td>
            <td>${todo.priority}</td>
            <td>${todo.status}</td>
            <td><button class="delete btn btn-danger">&times;</button></td>
        `;
    
        return row;
    }

}

let addTodoForm = addTodoDiv.querySelector('form');
addTodoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let title = addTodoForm.querySelector('#title');
    let description = addTodoForm.querySelector('#description');
    let deadline = addTodoForm.querySelector('#deadline');
    let priority = addTodoForm.querySelector('#priority');
    let status = addTodoForm.querySelector('#status');

    let data = {
        title: title.value,
        description: description.value,
        deadline: deadline.value,
        priority: priority.value,
        status: status.value
    };

    title.value = "";
    description.value = "";


    fetch(url + '/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        if(response.ok) {
            return response.json();
        }
    })
    .then((todo) => {
        table.appendChild(createTodo(todo));
    })
    .catch(err => console.log(err));
});

document.querySelector('main table').addEventListener('click', (e) => {
    if(e.target.classList.contains('delete')) {
        let id = e.target.parentElement.parentElement.id;

        fetch(url + '/todos/' + id, {
            method: "DELETE"
        })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            document.getElementById(data.id).remove();
        })
        .catch(err => console.log(err));
    }
});