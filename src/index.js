// Constants: These are values that don't change throughout the script
const API_URL = 'https://flatadango-3by5.onrender.com/films';
const listHolder = document.getElementById('films');
const buyTicketBtn = document.getElementById('buy-ticket');

// Event listeners: These set up functions to run when certain events happen
document.addEventListener('DOMContentLoaded', initializeApp);
buyTicketBtn.addEventListener('click', handleTicketPurchase);

// Main functions: These are the core functionalities of our app

async function initializeApp() {
	removeFirstMoviePlaceholder();
	const movies = await fetchMovies();
	displayMovies(movies);
	addClickEventToMovies();
}

async function fetchMovies() {
	try {
		const response = await fetch(API_URL);
		return await response.json();
	} catch (error) {
		console.error('Error fetching movies:', error);
		return [];
	}
}

function displayMovies(movies) {
	const movieList = movies.map((movie) => createMovieListItem(movie));
	listHolder.append(...movieList);
}

function addClickEventToMovies() {
	listHolder.addEventListener('click', async (event) => {
		if (event.target.tagName === 'LI') {
			const movieId = event.target.dataset.id;
			const movie = await fetchMovieDetails(movieId);
			setUpMovieDetails(movie);
		}
	});
}

async function fetchMovieDetails(movieId) {
	try {
		const response = await fetch(`${API_URL}/${movieId}`);
		return await response.json();
	} catch (error) {
		console.error('Error fetching movie details:', error);
	}
}

// Helper functions: These are smaller functions that support our main functions

function removeFirstMoviePlaceholder() {
	const firstMovie = document.querySelector('.film.item');
	if (firstMovie) firstMovie.remove();
}

function createMovieListItem(movie) {
	const li = document.createElement('li');
	li.textContent = movie.title.toUpperCase();
	li.style.cursor = 'pointer';
	li.dataset.id = movie.id;
	return li;
}

function setUpMovieDetails(movie) {
	if (!movie) return;

	// Update various HTML elements with the movie's details
	document.getElementById('poster').src = movie.poster;
	document.querySelector('#title').textContent = movie.title;
	document.querySelector('#runtime').textContent = `${movie.runtime} minutes`;
	document.querySelector('#film-info').textContent = movie.description;
	document.querySelector('#showtime').textContent = movie.showtime;

	// Calculate remaining tickets
	const remainingTickets = movie.capacity - movie.tickets_sold;
	document.querySelector('#ticket-num').textContent = remainingTickets;

	// Reset and update the buy ticket button
	resetBuyTicketButton(remainingTickets);
}

// New function to reset and update the buy ticket button
function resetBuyTicketButton(remainingTickets) {
	if (remainingTickets > 0) {
		buyTicketBtn.textContent = 'Buy Ticket';
		buyTicketBtn.disabled = false;
	} else {
		buyTicketBtn.textContent = 'Sold Out';
		buyTicketBtn.disabled = true;
	}
}

function handleTicketPurchase(e) {
	e.preventDefault();
	const ticketNum = document.querySelector('#ticket-num');
	let remainingTickets = parseInt(ticketNum.textContent, 10);

	if (remainingTickets > 0) {
		remainingTickets--;
		ticketNum.textContent = remainingTickets;
		resetBuyTicketButton(remainingTickets);
	}
}
