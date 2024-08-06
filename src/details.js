import page from '../node_modules/page/page.mjs';
import { html, render } from '../node_modules/lit-html/lit-html.js';




const detailsTemplate = (items, isOwner, onDelete, comments) => html`
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
        
          <!-- Bonus ( for Guests and Users ) -->
        <div class="details-comments">
            <h2>Comments:</h2>
            <ul>
                <!-- list all comments for current game (If any) -->
                ${comments.length > 0 ? comments.map(comment => html`
                       <li class="comment">
                    <p>Content: ${comment.comment}</p>
                </li>`) : html` <p class="no-comment">No comments.</p>`}
            </ul>
        </div>

        ${!isOwner && localStorage.length > 0 ? html`
              <article class="create-comment">
        <label>Add new comment:</label>
        <form class="form" @submit=${(e) => postComment(e, items._id)}>
            <textarea name="comment" placeholder="Comment......"></textarea>
            <input class="btn submit" type="submit" value="Add Comment">
        </form>
    </article>
            `: ''}

    </div>

</section>

`;

const comments = async (gameId) => {
    console.log(gameId);

    const response = await fetch(`http://localhost:3030/data/comments?where=gameId%3D%22${gameId}%22`)
    const data = await response.json()
    return data

}


async function postComment(event, gameId) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const comment = formData.get('comment').trim();

    if (comment === '') {
        return alert('Comment cannot be empty!');
    }

    try {
        const response = await fetch(`http://localhost:3030/data/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ gameId, comment })
        })

        if (!response.ok) {
            throw new Error(await response.json());
        }
        event.target.reset();

        page.redirect(`/details/${gameId}`);
    } catch (error) {
        alert(error.message);
    }

}



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
    const gameId = ctx.params.detailsId;

    Promise.all([
        getDetails(gameId),
        comments(gameId)
    ])
        .then(([items, comments]) => {
            const isOwner = localStorage.ownerId === items._ownerId;

            const onDelete = () => {
                if (confirm('Are you sure you want to delete this album?')) {
                    deleteAlbum(gameId)
                        .then(() => {
                            page.redirect('/dashboard');
                        })
                        .catch(err => {
                            alert('Failed to delete album: ' + err.message);
                        });
                }
            };

            render(detailsTemplate(items, isOwner, onDelete, comments), document.querySelector('#main-content'));
        });
};
