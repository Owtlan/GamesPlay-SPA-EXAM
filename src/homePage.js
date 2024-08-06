
import { html, render } from '../node_modules/lit-html/lit-html.js';

let homePage = (catalog) => html`

        <section id="welcome-world">
            <div class="welcome-message">
                <h2>ALL new games are</h2>
                <h3>Only in GamesPlay</h3>
            </div>
            <img src="./images/four_slider_img01.png" alt="hero">
            <div id="home-page">
                <h1>Latest Games</h1>

                ${catalog.length > 0 ? catalog.map(c => html`
                <div class="game">
                    <div class="image-wrap">
                        <img src="${c.imageUrl}">
                    </div>
                    <h3>${c.title}</h3>
                    <div class="rating">
                        <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
                    </div>
                    <div class="data-buttons">
                        <a href="/details/${c._id}" class="btn details-btn">Details</a>
                    </div>
                </div>    
                    `) : html`
                    <p class="no-articles">No games yet</p>
                    `}
            </div>
        </section>
    `;

const getCatalog = async () => {

    try {
        const response = await fetch('http://localhost:3030/data/games?sortBy=_createdOn%20desc&distinct=category')
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log(data);
        return Object.values(data);
    } catch (error) {
        console.error('Error fetching catalog:', error);
        return [];
    }
}



export const homeView = async (ctx) => {
    const catalog = await getCatalog()
    render(homePage(catalog), document.querySelector('#main-content'))
}