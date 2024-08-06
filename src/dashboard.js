import page from '../node_modules/page/page.mjs';
import { html, render } from '../node_modules/lit-html/lit-html.js';



let dashboardTemplate = (catalog) => html`
<section id="catalog-page">
    <h1>All Games</h1>
    <!-- Display div: with information about every game (if any) -->
     ${catalog.length > 0 ? catalog.map(c => html`
    <div class="allGames">
        <div class="allGames-info">
            <img src="${c.imageUrl}">
            <h6>${c.category}</h6>
            <h2>${c.title}</h2>
            <a href="/details/${c._id}" class="details-button">Details</a>
        </div>

    </div>
   `) : html`
    <!-- Display paragraph: If there is no games  -->
    <h3 class="no-articles">No articles yet</h3>
      `}
</section>
</div>


     `

const getCatalog = () => {
    return fetch('http://localhost:3030/data/games?sortBy=_createdOn%20desc')
        .then(res => res.json())
        .then(data => Object.values(data))
}

export const catalogView = (ctx) =>
    getCatalog()
        .then(catalog => render(dashboardTemplate(catalog), document.querySelector('#main-content')))