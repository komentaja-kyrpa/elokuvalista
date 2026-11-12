
// ==============================
// ASETUKSET
// ==============================

const API_URL = "http://localhost:3000/movies";

let movies = [];


// ==============================
// HAETAAN ELOKUVAT JSON SERVERISTÄ
// ==============================


async function getMovies() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Elokuvien hakeminen epäonnistui.");
        }

        movies = await response.json();

        displayMovies(movies);
        displayFavorites();
        displayMovieDetails();

    } catch (error) {

        console.error("Virhe elokuvien lataamisessa:", error);

        const grid = document.getElementById("movieGrid");

        if (grid) {
            grid.textContent = "Elokuvien lataaminen epäonnistui.";
        }

        const message = document.getElementById("favoritesMessage");

        if (message) {
            message.textContent = "Suosikkien lataaminen epäonnistui.";
        }

        const details = document.getElementById("movieDetails");

        if (details) {
            details.textContent = "Elokuvan tietojen lataaminen epäonnistui.";
        }

    }

}


// ==============================
// NÄYTETÄÄN ELOKUVAT
// ==============================

function displayMovies(movieList) {
    const grid = document.getElementById("movieGrid");

    if (!grid) return;

    grid.innerHTML = "";

    if (movieList.length === 0) {
        grid.innerHTML = "<p>Elokuvia ei löytynyt.</p>";
        return;
    }

    movieList.forEach(movie => {

        const article = document.createElement("article");

        article.className = "movie";

        article.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.year} · ${movie.genre}</p>
            <p>⭐ ${movie.rating}/10</p>
            <a class="button" href="movie.html?id=${movie.id}">
                Katso tiedot
            </a>
        `;

        grid.appendChild(article);
    });
}


// ==============================
// ELOKUVIEN HAKU
// ==============================

const searchInput = document.getElementById("searchMovie");

if (searchInput) {

    searchInput.addEventListener("input", () => {

        const searchValue = searchInput.value.toLowerCase();

        const filteredMovies = movies.filter(movie =>
            movie.title.toLowerCase().includes(searchValue)
        );

        displayMovies(filteredMovies);

    });

}


// ==============================
// GENREN SUODATUS
// ==============================

const genreFilter = document.getElementById("genreFilter");

if (genreFilter) {

    genreFilter.addEventListener("change", () => {

        const selectedGenre = genreFilter.value;

        let filteredMovies = movies;

        if (selectedGenre !== "all") {
            filteredMovies = movies.filter(movie =>
                movie.genre.toLowerCase().includes(
                    selectedGenre.toLowerCase()
                )
            );
        }

        if (searchInput) {
            const searchValue = searchInput.value.toLowerCase();

            filteredMovies = filteredMovies.filter(movie =>
                movie.title.toLowerCase().includes(searchValue)
            );
        }

        displayMovies(filteredMovies);

    });

}


// ==============================
// SUOSIKKIEN NÄYTTÄMINEN
// ==============================

function displayFavorites() {

    const grid = document.getElementById("favoritesGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const favorites = movies.filter(movie => movie.favorite);

    const message = document.getElementById("favoritesMessage");

    if (favorites.length === 0) {
        message.textContent = "Suosikkielokuvia ei ole vielä lisätty.";
        return;
    }

    message.textContent = "";

    favorites.forEach(movie => {

        const article = document.createElement("article");

        article.className = "movie";

        article.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.year} · ${movie.genre}</p>
            <a class="button" href="movie.html?id=${movie.id}">
                Katso tiedot
            </a>
        `;

        grid.appendChild(article);
    });
}


// ==============================
// YKSITTÄISEN ELOKUVAN TIEDOT
// ==============================

getMovies();

// ==============================
// UUDEN ELOKUVAN LISÄÄMINEN
// ==============================

const addMovieForm = document.getElementById("addMovieForm");

if (addMovieForm) {

    addMovieForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const newMovie = {
            title: document.getElementById("movieTitle").value.trim(),
            year: Number(document.getElementById("movieYear").value),
            genre: document.getElementById("movieGenre").value.trim(),
            rating: Number(document.getElementById("movieRating").value),
            image: document.getElementById("movieImage").value.trim(),
            description: document.getElementById("movieDescription").value.trim(),
            favorite: false
        };

        const message = document.getElementById("addMovieMessage");

        try {

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(newMovie)
            });

            if (!response.ok) {
                throw new Error("Elokuvan lisääminen epäonnistui.");
            }

            const savedMovie = await response.json();

            movies.push(savedMovie);

            displayMovies(movies);

            addMovieForm.reset();

            message.textContent = "Elokuva lisättiin onnistuneesti!";

        } catch (error) {

            console.error(error);

            message.textContent =
                "Elokuvan lisääminen epäonnistui. Yritä uudelleen.";

        }

    });

}

// ==============================
// ELOKUVAN POISTAMINEN (DELETE)
// ==============================

const deleteButton = document.getElementById("deleteMovieButton");

const deleteDialog = document.getElementById("deleteDialog");

const confirmDeleteButton = document.getElementById("confirmDeleteButton");

const cancelDeleteButton = document.getElementById("cancelDeleteButton");


// AVATAAN POISTAMISEN VAHVISTUS

if (deleteButton) {

    deleteButton.addEventListener("click", () => {

        deleteDialog.showModal();

    });

}


// PERUUTETAAN POISTAMINEN

if (cancelDeleteButton) {

    cancelDeleteButton.addEventListener("click", () => {

        deleteDialog.close();

    });

}


// VAHVISTETAAN POISTAMINEN

if (confirmDeleteButton) {

    confirmDeleteButton.addEventListener("click", async () => {

        const params = new URLSearchParams(window.location.search);

        const id = params.get("id");

        try {

            const response = await fetch(`${API_URL}/${id}`, {

                method: "DELETE"

            });

            if (!response.ok) {
                throw new Error("Elokuvan poistaminen epäonnistui.");
            }

            // Poistetaan elokuva JavaScriptin taulukosta

            movies = movies.filter(movie => movie.id !== id);

            // Suljetaan dialogi

            deleteDialog.close();

            // Siirrytään takaisin elokuvalistaan

            window.location.href = "movies.html";

        } catch (error) {

            console.error(error);

            alert("Elokuvan poistaminen epäonnistui. Yritä uudelleen.");

        }

    });

}

function displayMovieDetails() {

    const details = document.getElementById("movieDetails");

    if (!details) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    const movie = movies.find(movie => String(movie.id) === id);

    if (!movie) {
        details.innerHTML = "<h2>Elokuvaa ei löytynyt.</h2>";
        return;
    }

    document.title = movie.title;

    details.innerHTML = `
        <img src="${movie.image}" alt="${movie.title}">

        <div class="info">
            <span class="tag">ELOKUVA</span>
            <h1>${movie.title}</h1>
            <p>${movie.year} · ${movie.genre}</p>
            <p>⭐ Arvosana: ${movie.rating}/10</p>
            <p>${movie.description}</p>
        </div>
    `;
}

// ==============================
// ELOKUVAN MUOKKAAMINEN
// ==============================

const editButton = document.getElementById("editMovieButton");
const editDialog = document.getElementById("editDialog");
const editForm = document.getElementById("editMovieForm");
const closeDialogButton = document.getElementById("closeDialogButton");

if (editButton && editDialog && editForm) {

    editButton.addEventListener("click", () => {

        const id = new URLSearchParams(location.search).get("id");

        const movie = movies.find(m => String(m.id) === id);

        if (!movie) return;

        document.getElementById("editTitle").value = movie.title;
        document.getElementById("editYear").value = movie.year;
        document.getElementById("editGenre").value = movie.genre;
        document.getElementById("editRating").value = movie.rating;
        document.getElementById("editDescription").value = movie.description;

        editDialog.showModal();

    });

    closeDialogButton.addEventListener("click", () => {
        editDialog.close();
    });

    editForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const id = new URLSearchParams(location.search).get("id");

        const updatedMovie = {
            title: document.getElementById("editTitle").value.trim(),
            year: Number(document.getElementById("editYear").value),
            genre: document.getElementById("editGenre").value.trim(),
            rating: Number(document.getElementById("editRating").value),
            description: document.getElementById("editDescription").value.trim()
        };

        try {

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedMovie)
            });

            if (!response.ok) {
                throw new Error("Muokkaaminen epäonnistui.");
            }

            const savedMovie = await response.json();

            const index = movies.findIndex(m => String(m.id) === id);

            if (index !== -1) {
                movies[index] = savedMovie;
            }

            displayMovieDetails();

            editDialog.close();

            alert("Elokuva päivitettiin!");

        } catch (error) {

            console.error(error);
            alert("Elokuvan muokkaaminen epäonnistui.");

        }

    });

}

 // ==============================
 // SUOSIKKEIHIN LISÄÄMINEN
 // ==============================

const favoriteButton = document.getElementById("favoriteButton");

if (favoriteButton) {

    favoriteButton.addEventListener("click", async () => {

        const id = new URLSearchParams(location.search).get("id");

        const movie = movies.find(m => String(m.id) === id);

        if (!movie) {
            alert("Elokuvaa ei löytynyt.");
            return;
        }

        try {

            const response = await fetch(`${API_URL}/${id}`, {
                method: "PATCH",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    favorite: !movie.favorite
                })
            });

            if (!response.ok) {
                throw new Error("Suosikin päivittäminen epäonnistui.");
            }

            const updatedMovie = await response.json();

            const index = movies.findIndex(m => String(m.id) === id);

            movies[index] = updatedMovie;

            favoriteButton.textContent = updatedMovie.favorite
                ? "Poista suosikeista"
                : "Lisää suosikkeihin";

            displayFavorites();

            alert(updatedMovie.favorite
                ? "Elokuva lisättiin suosikkeihin!"
                : "Elokuva poistettiin suosikeista!");

        } catch (error) {

            console.error(error);
            alert("Suosikin päivittäminen epäonnistui.");

        }

    });

}
