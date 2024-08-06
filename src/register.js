import page from '../node_modules/page/page.mjs';
import { html, render } from '../node_modules/lit-html/lit-html.js';
import { updateInfo } from '../app.js'
import { homeView } from '../src/homePage.js';



let registerTemplate = () => html`
  <section id="register-page" class="content auth">
    <form id="register" @submit=${onSubmitForm}>
        <div class="container">
            <div class="brand-logo"></div>
            <h1>Register</h1>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" placeholder="maria@email.com">

            <label for="pass">Password:</label>
            <input type="password" name="password" id="register-password">

            <label for="con-pass">Confirm Password:</label>
            <input type="password" name="confirm-password" id="confirm-password">

            <input class="btn submit" type="submit" value="Register">

            <p class="field">
                <span>If you already have profile click <a href="#">here</a></span>
            </p>
        </div>
    </form>
</section>

`


function onSubmitForm(e) {
    e.preventDefault()
    let formData = new FormData(e.currentTarget)
    console.log(formData);
  
    let email = formData.get('email')
    let password = formData.get('password')
    let repeatPassword = formData.get('confirm-password')

    if (password === '' || repeatPassword === '' || email === '') {
        window.alert('fields are empty')
        return
      }

      if (password !== repeatPassword) {
        window.alert('passwords missmatch !')
        return
      }

      fetch('http://localhost:3030/users/register',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email,password})
      })
      .then(res => {
        if (!res.ok) {
            return res.json().then(error => { throw new Error(error.message) });
        }
        return res.json();
      })
      .then(data =>{
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('ownerId', data._id)
        updateInfo()
        homeView()
      })
      .catch(error =>  window.alert(error.message))
}

export const registerView = (ctx) => render(registerTemplate(), document.querySelector('#main-content'))