import page from '../node_modules/page/page.mjs';
import { html, render } from '../node_modules/lit-html/lit-html.js';


const createTemplate = () => html`

<section id="create-page" class="auth">
    <form id="create" @submit=${addItem}>
        <div class="container">

            <h1>Create Game</h1>
            <label for="leg-title">Legendary title:</label>
            <input type="text" id="title" name="title" placeholder="Enter game title...">

            <label for="category">Category:</label>
            <input type="text" id="category" name="category" placeholder="Enter game category...">

            <label for="levels">MaxLevel:</label>
            <input type="number" id="maxLevel" name="maxLevel" min="1" placeholder="1">

            <label for="game-img">Image:</label>
            <input type="text" id="imageUrl" name="imageUrl" placeholder="Upload a photo...">

            <label for="summary">Summary:</label>
            <textarea name="summary" id="summary"></textarea>
            <input class="btn submit" type="submit" value="Create Game">
        </div>
    </form>
</section>
`

function addItem(e) {
    e.preventDefault()

    let title = document.getElementById('title').value
    let category = document.getElementById('category').value
    let maxLevel = document.getElementById('maxLevel').value
    let imageUrl = document.getElementById('imageUrl').value
    let summary = document.getElementById('summary').value

    if (title === '' || category === '' || maxLevel === '' || imageUrl === ''|| summary === '') {
        window.alert('you need to fill all fields')
        return
    }


    fetch('http://localhost:3030/data/games', {
        method: 'POST',
        headers: {
            'X-Authorization': localStorage.token
        },
        body: JSON.stringify({
            title,
            category,
            maxLevel,
            imageUrl,
            summary            
        })
    })
        .then(res => res.json())
        .then(data => {
            page.redirect('/dashboard')
        })
        .catch(error => alert(error.message))
}

export const createView = (ctx) =>
    render(createTemplate(), document.querySelector('#main-content'))