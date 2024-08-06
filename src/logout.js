import { updateInfo } from '../app.js'
import { homeView } from '../src/homePage.js';


export const logout = (e) => {

    e.preventDefault()

    fetch('http://localhost:3030/users/logout', {
        'method': 'GET',
        'headers': {
            'X-Authorization': localStorage.token
        }
    })

    localStorage.clear()
    homeView()
    updateInfo()
}