let username = document.querySelector('#username')
let email = document.querySelector('#email')
let password = document.querySelector('#password')
let confirmPassword = document.querySelector('#confirmPassword')
let btn = document.querySelector('main form button')
let valid = true;

btn.onclick = () => {
    if(username.value === "") {
        username.previousElementSibling.textContent = "invalid username"
        valid = false
    }

    if(! /\S+@\S+\.\S+/.test(email.value) ) {
        email.previousElementSibling.textContent = "invalid email"
        valid = false
    }

    if(password.value.length < 6) {
        password.previousElementSibling.textContent = "password must conatin at least 6 characters"
        valid = false
    }

    if(confirmPassword.value != password.value) {
        confirmPassword.previousElementSibling.textContent = "password confirmation different from password"
        valid = false
    }

    if(valid) {
        document.querySelector('main form').submit();
    }
}



