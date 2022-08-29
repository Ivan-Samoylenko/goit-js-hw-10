// imports
import './css/styles.css';
import { fetchCountries } from './fetchCountries';
const debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

// variables
const DEBOUNCE_DELAY = 300;

// references
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

// event listeners
refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

// event functions
function onInput(event) {
  const countryQuery = event.target.value;
  if (countryQuery) {
    fetchCountries(countryQuery).then(checkCountries).catch(errorEvent);
  } else {
    resetAll();
  }
}

// functions
function checkCountries(countries) {
  if (countries.length > 10) {
    resetAll();
  } else if (countries.length <= 10 && countries.length > 1) {
    resetCountrieInfo();
    const markup = countries.reduce(getCountriesMarkup, '');
    renderCountriesList(markup);
  } else {
    resetCountriesList();
    const markup = getCountrieMarkup(countries[0]);
    renderCountrieInfo(markup);
  }
}

function errorEvent() {
  resetCountriesList();
  resetCountrieInfo();
  errorMessage();
}

// functions helpers
function getCountriesMarkup(acc, { name: { official: name }, flags: { svg: flag } }) {
  return acc + `<li><img src="${flag}" alt="${name}" /><p>${name}</p></li>`;
}

function getCountrieMarkup({
  name: { official: name },
  flags: { svg: flag },
  population,
  capital,
  languages,
}) {
  const languagesText = Object.keys(languages)
    .map(key => {
      return languages[key];
    })
    .join(', ');

  return `<div class="warper">
        <img src="${flag}" alt="${name}" />
        <span class="name">${name}</span>
      </div>
      <p><span class="bold-text">Capital: </span>${capital}</p>
      <p><span class="bold-text">Population: </span>${population}</p>
      <p><span class="bold-text">Languages: </span>${languagesText}</p>`;
}

function resetCountriesList() {
  refs.countryList.innerHTML = '';
}

function renderCountriesList(markup) {
  refs.countryList.innerHTML = markup;
}

function resetCountrieInfo() {
  refs.countryInfo.innerHTML = '';
}

function renderCountrieInfo(markup) {
  refs.countryInfo.innerHTML = markup;
}

function errorMessage() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}

function notifyMessage() {
  Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
}

function resetAll() {
  resetCountriesList();
  resetCountrieInfo();
  notifyMessage();
}
