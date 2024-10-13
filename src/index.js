// URL of the server where movie data is fetched from
let url = 'https://flatadango-3by5.onrender.com/films';

// Get the HTML element where the movie list will be displayed
const listHolder = document.getElementById('films');

// Run this function when the page content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	// Remove the first movie placeholder (if there's one in the HTML template)
	document.getElementsByClassName('film item')[0].remove();

	// Fetch the list of movies from the server
	fetchMovies(url);
});

// Function to fetch movies from the server
function fetchMovies(url) {
	// Use the fetch API to get movie data from the server
	fetch(url)
		.then((response) => response.json()) // Convert the response into JSON format
		.then((movies) => {
			// Loop through each movie in the response and display it
			movies.forEach((movie) => {
				displayMovie(movie); // Call a function to display the movie in the list
			});
		});
}

// Function to display each movie as a list item (li) in the movie list
function displayMovie(movie) {
	// Create a new list item (li) for the movie
	const li = document.createElement('li');

	// Make the list item clickable by adding a cursor pointer style
	li.style.cursor = 'pointer';

	// Set the text of the list item to the movie title in uppercase
	li.textContent = movie.title.toUpperCase();

	// Add the list item to the movie list (ul) in the HTML
	listHolder.appendChild(li);

	// Add a click event to each movie in the list
	addClickEvent();
}

// Function to add a click event to each movie in the list
function addClickEvent() {
	// Get all the list items (movies) from the movie list
	let children = listHolder.children;

	// Loop through each list item (movie)
	for (let i = 0; i < children.length; i++) {
		let child = children[i]; // Get the current movie list item

		// Add a click event listener to the movie
		child.addEventListener('click', () => {
			// When a movie is clicked, fetch detailed info about the movie from the server
			fetch(`${url}/${i + 0}`) // The movie's ID is used in the URL
				.then((res) => res.json()) // Convert the response into JSON
				.then((movie) => {
					// When movie details are fetched, update the UI
					document.getElementById('buy-ticket').textContent = 'Buy Ticket'; // Reset the "Buy Ticket" button text
					setUpMovieDetails(movie); // Call function to display the movie details
				});
		});
	}
}

// Function to display the detailed info of the clicked movie
function setUpMovieDetails(childMovie) {
	// Set the movie poster image
	const preview = document.getElementById('poster');
	preview.src = childMovie.poster;

	// Display the movie's title
	const movieTitle = document.querySelector('#title');
	movieTitle.textContent = childMovie.title;

	// Display the movie's runtime (in minutes)
	const movieTime = document.querySelector('#runtime');
	movieTime.textContent = `${childMovie.runtime} minutes`;

	// Display the movie's description
	const movieDescription = document.querySelector('#film-info');
	movieDescription.textContent = childMovie.description;

	// Display the showtime of the movie
	const showTime = document.querySelector('#showtime');
	showTime.textContent = childMovie.showtime;

	// Display the remaining tickets available for this movie
	const tickets = document.querySelector('#ticket-num');
	tickets.textContent = childMovie.capacity - childMovie.tickets_sold;
}

// Get the "Buy Ticket" button element
const btn = document.getElementById('buy-ticket');

// Add a click event listener to the "Buy Ticket" button
btn.addEventListener('click', function (e) {
	// Prevent the default behavior (e.g., page reload)
	e.preventDefault();

	// Get the number of remaining tickets
	let remTickets = document.querySelector('#ticket-num').textContent;

	// Check if there are tickets left
	if (remTickets > 0) {
		// Decrease the ticket count by 1 and update the display
		document.querySelector('#ticket-num').textContent = remTickets - 1;
	} else if (parseInt(remTickets, 10) === 0) {
		// If no tickets are left, change the button text to "Sold Out"
		btn.textContent = 'Sold Out';
	}
});
