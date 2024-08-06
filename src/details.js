import page from '../node_modules/page/page.mjs';
import { html, render } from '../node_modules/lit-html/lit-html.js';




const detailsTemplate = (items, isOwner, onDelete) => html`
<section id="game-details">
    <h1>Game Details</h1>
    <div class="info-section">

        <div class="game-header">
            <img class="game-img" src="${items.imageUrl}" />
            <h1>${items.title}</h1>
            <span class="levels">MaxLevel: ${items.maxLevel}</span>
            <p class="type">${items.category}</p>
        </div>

        <p class="text">${items.summary}</p>
        <!-- Edit/Delete buttons ( Only for creator of this game )  -->
            ${isOwner ? html`
        <div class="buttons">
            <a href="/edit/${items._id}" class="button">Edit</a>
            <a href="javascript:void(0)" class="button" @click=${onDelete}>Delete</a>
        </div>`
        : ''}
    </div>

</section>

`;

const getDetails = (detailsId) => {
    return fetch(`http://localhost:3030/data/games/${detailsId}`)
        .then(res => res.json())

}

const deleteAlbum = (id) => {
    return fetch(`http://localhost:3030/data/games/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': localStorage.getItem('token')
        }
    })
        .then(res => res.json());
}

export const detailsView = (ctx) => {
    getDetails(ctx.params.detailsId)
        .then(items => {
            const isOwner = localStorage.ownerId === items._ownerId;

            const onDelete = () => {
                if (confirm('Are you sure you want to delete this album?')) {
                    deleteAlbum(ctx.params.detailsId)
                        .then(() => {
                            page.redirect('/dashboard');
                        })
                        .catch(err => {
                            alert('Failed to delete album: ' + err.message);
                        });
                }
            };
            render(detailsTemplate(items, isOwner, onDelete), document.querySelector('main'));
        })
}