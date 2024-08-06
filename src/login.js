import { html, render } from '../node_modules/lit-html/lit-html.js';
import { updateInfo } from '../app.js'
import { homeView } from '../src/homePage.js';

let loginTemplate = () => html`
      <section id="login-page" class="auth">
    <form id="login" @submit=${onsubmit}>

        <div class="container">
            <div class="brand-logo"></div>
            <h1>Login</h1>
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="Sokka@gmail.com">

            <label for="login-pass">Password:</label>
            <input type="password" id="login-password" name="password">
            <input type="submit" class="btn submit" value="Login">
            <p class="field">
                <span>If you don't have profile click <a href="#">here</a></span>
            </p>
        </div>
    </form>
</section>
`

function onsubmit(e) {
    e.preventDefault()

    let formData = new FormData(e.currentTarget)
    let email = formData.get('email')
    let password = formData.get('password')
    if (email === '' || password === '') {
        alert('fields are empty')
        return
    }

    fetch('http://localhost:3030/users/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    })
        .then(res => {
            if (!res.ok) {
                throw new Error('Invalid email/password')
            }
            return res.json()
        })
        .then(data => {
            localStorage.setItem('token', data.accessToken)
            localStorage.setItem('ownerId', data._id)
            updateInfo()
            homeView()
        })
        .catch(error => alert(error.message))
}
export const loginView = (ctx) =>
    render(loginTemplate(), document.querySelector('#main-content'))