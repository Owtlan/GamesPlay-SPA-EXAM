import page from '../node_modules/page/page.mjs';
import { html, render } from '../node_modules/lit-html/lit-html.js';


const editTemplate = (album, onSubmit) => html`
  <section id="edit-page" class="auth">
    <form id="edit" @submit=${onSubmit}>
        <div class="container">

            <h1>Edit Game</h1>
            <label for="leg-title">Legendary title:</label>
            <input type="text" id="title" name="title" .value=${album.title} >

            <label for="category">Category:</label>
            <input type="text" id="category" name="category" .value=${album.category} >

            <label for="levels">MaxLevel:</label>
            <input type="number" id="maxLevel" name="maxLevel" min="1" .value=${album.maxLevel} >

            <label for="game-img">Image:</label>
            <input type="text" id="imageUrl" name="imageUrl" .value=${album.imageUrl} >

            <label for="summary">Summary:</label>
            <textarea name="summary" id="summary">${album.summary}</textarea>
            <input class="btn submit" type="submit" value="Edit Game">

        </div>
    </form>
</section>
`

const getAlbumDetails = (id) => {

    return fetch(`http://localhost:3030/data/games/${id}`)
        .then(res => res.json())
};

const editAlbum = (id, album) => {
    return fetch(`http://localhost:3030/data/games/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(album)
    })
        .then(res => res.json())
};


export const editView = (ctx) => {
    const albumId = ctx.params.albumId
    console.log(albumId);
    getAlbumDetails(albumId)
        .then(album => {
            const onSubmit = (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);


                let title = document.getElementById('title').value
                let category = document.getElementById('category').value
                let maxLevel = document.getElementById('maxLevel').value
                let imageUrl = document.getElementById('imageUrl').value
                let summary = document.getElementById('summary').value

                if (title === '' || category === '' || maxLevel === '' || imageUrl === '' || summary === '') {
                    window.alert('you need to fill all fields')
                    return
                }


                const editedAlbum = {
                    title,
                    category,
                    maxLevel,
                    imageUrl,
                    summary
                };
                if (Object.values(editedAlbum).some(field => field.trim() === '')) {
                    return alert('All fields are required!');
                }

                editAlbum(albumId, editedAlbum)
                    .then(() => {
                        page.redirect(`/details/${albumId}`);
                    });
            }
            render(editTemplate(album, onSubmit), document.querySelector('#main-content'))
        })
}