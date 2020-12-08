let username = document.querySelector('#username')
let email = document.querySelector('#email')
let password = document.querySelector('#password')
let confirmPassword = document.querySelector('#confirmPassword')
let btn = document.querySelector('main form button')


btn.onclick = () => {
    let valid = true;

    if(username.value === "") {
        username.previousElementSibling.textContent = "invalid username"
        valid = false
    }

    if(! /\S+@\S+\.\S+/.test(email.value) ) {
        email.previousElementSibling.textContent = "invalid email"
        valid = false
    }

    if(password.value.length < 6) {
        password.previousElementSibling.textContent = "password must contain at least 6 characters"
        valid = false
    }

    if(confirmPassword.value != password.value) {
        confirmPassword.previousElementSibling.textContent = "password confirmation different from password"
        valid = false
    }

    if(valid) {
        fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                username: username.value,
                email: email.value,
                password: password.value
            })
        })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((res) => {
            if(!res.valid) {
                email.previousElementSibling.textContent = res.message;
            }
            else {
                document.querySelector('main .card').remove();
                let alert = document.createElement('div');
                alert.className = 'alert alert-success';
                alert.innerHTML = `
                <h3 class="text-center">You are successfully registered!</h3>
                <h4 class="text-center">click <a href="/login">here</a> to login</h4>
                `;
                document.querySelector('main .col').appendChild(alert);
            }
        })
        .catch(err => console.log(err));
    }
}



