
const movies = [
  {
    id: 1,
    title: "Interstellar",
    year: 2014,
    genre: "Sci-Fi",
    rating: "8.7/10",
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    description: "Kun maapallon tulevaisuus näyttää synkältä, joukko tutkijoita lähtee vaaralliselle matkalle avaruuden halki etsimään ihmiskunnalle uutta kotia."
  },
  {
    id: 2,
    title: "Inception",
    year: 2010,
    genre: "Sci-Fi / Trilleri",
    rating: "8.8/10",
    image: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    description: "Dom Cobb pystyy varastamaan salaisuuksia ihmisten unista. Nyt hän saa tehtävän, joka voi muuttaa kaiken."
  },
  {
    id: 3,
    title: "The Dark Knight",
    year: 2008,
    genre: "Toiminta",
    rating: "9.0/10",
    image: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    description: "Batman kohtaa Jokerin, jonka kaaos uhkaa koko Gotham Cityä."
  },
  {
    id: 4,
    title: "Avatar",
    year: 2009,
    genre: "Seikkailu",
    rating: "7.9/10",
    image: "https://image.tmdb.org/t/p/w500/kyeqWdyUXW608qlYkRqosgbbJyK.jpg",
    description: "Jake Sully saapuu Pandora-planeetalle ja löytää maailman, joka muuttaa hänen elämänsä."
  },
  {
    id: 5,
    title: "Joker",
    year: 2019,
    genre: "Draama",
    rating: "8.3/10",
    image: "https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
    description: "Arthur Fleckin elämä ajautuu synkkään suuntaan yhteiskunnan ja henkilökohtaisten vaikeuksien keskellä."
  },
  {
    id: 6,
    title: "Dune",
    year: 2021,
    genre: "Sci-Fi",
    rating: "8.0/10",
    image: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    description: "Paul Atreides matkustaa vaaralliselle Arrakis-planeetalle, jonka hallinnasta käydään suurta taistelua."
  }
];

const grid = document.getElementById("movieGrid");

if (grid) {
  movies.forEach(movie => {
    grid.innerHTML += `
      <div class="movie" onclick="openMovie(${movie.id})">
        <img src="${movie.image}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>${movie.year} · ${movie.genre}</p>
      </div>
    `;
  });
}

function openMovie(id) {
  window.location.href = `movie.html?id=${id}`;
}
