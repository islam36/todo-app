let togglerBtn = document.querySelector('#add-todo-toggler');
let addTodoDiv = document.querySelector('#add-todo-div');
let table = document.querySelector('main table');
let todoDivActive = false;


togglerBtn.onclick = () => {
    addTodoDiv.classList.toggle('active');
    togglerBtn.classList.toggle('btn-primary');
    togglerBtn.classList.toggle('btn-danger');
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


    fetch('/todos', {
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
        window.scrollBy(0, document.body.scrollHeight);
    })
    .catch(err => console.log(err));
});

document.querySelector('main table').addEventListener('click', (e) => {
    if(e.target.classList.contains('delete')) {
        let id = e.target.parentElement.parentElement.id;

        fetch('/todos/' + id, {
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



document.querySelector('main table').addEventListener('click', (e) => {
    if(e.target.tagName == 'TD') {
        let modal = document.querySelector('.modal');
        let titleEdit = modal.querySelector('#titleEdit')
        let descriptionEdit = modal.querySelector('#descriptionEdit')
        let deadlineEdit = modal.querySelector('#deadlineEdit')
        let priorityEdit = modal.querySelector('#priorityEdit')
        let statusEdit = modal.querySelector('#statusEdit')

        let row = e.target.parentElement;

        titleEdit.value = row.children[0].textContent;
        descriptionEdit.value = row.children[1].textContent;
        deadlineEdit.value = row.children[2].textContent;
        priorityEdit.value = row.children[3].textContent;
        statusEdit.value = row.children[4].textContent;

        modal.classList.toggle('active');

        //hide modal when user clicks on 'X'
        modal.querySelector('.card-header span').onclick = () => {
            modal.classList.toggle('active');
        }

        //hide modal when user clicks on button 'close'
        modal.querySelector('.card-footer .btn-secondary').onclick = () => {
            modal.classList.toggle('active');
        }

        modal.querySelector('.card-footer .btn-success').onclick = () => {
            if(titleEdit.value != '' && descriptionEdit.value != '') {
                modal.classList.toggle('active');

                fetch('/todos', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: row.id,
                        title: titleEdit.value,
                        description: descriptionEdit.value,
                        deadline: deadlineEdit.value,
                        priority: priorityEdit.value,
                        status: statusEdit.value
                    })
                })
                .then((response) => {
                    if(response.ok) {
                        return response.json();
                    }
                })
                .then((data) => {
                    row.children[0].textContent = data.title;
                    row.children[1].textContent = data.description;
                    row.children[2].textContent = data.deadline;
                    row.children[3].textContent = data.priority;
                    row.children[4].textContent = data.status;
                })
            }
        }
    }
});