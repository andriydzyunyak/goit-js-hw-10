import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry() {
  const name = refs.input.value.trim();

  if (name) {
    fetchCountries(name)
      .then(arrCountries => {
        if (arrCountries.length > 10) {
          refs.countryList.innerHTML = '';
          refs.countryInfo.innerHTML = '';
          Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        } else {
          renderCountriesList(arrCountries);
          if (arrCountries.length === 1) {
            refs.countryList.innerHTML = '';
            renderCountriesInfo(arrCountries);
          } else {
            refs.countryInfo.innerHTML = '';
          }
        }
      })
      .catch(error => {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        Notiflix.Notify.failure('Oops, there is no country with that name');
      });
  }
}

function renderCountriesList(arrCountries) {
  const markup = arrCountries
    .map(({ flags, name }) => {
      return `<li class='country-item'>
          <div class='country-shortinfo'>
          <img src = '${flags.svg}', alt = '${name.official}'></img>
          <p class="country-name">${name.official}</p>
          </div>
          </li>
        `;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function renderCountriesInfo(arrCountries) {
  const markup = arrCountries
    .map(({ capital, population, languages, flags, name }) => {
      return `<div class="country-shortinfo">
      <img src = '${flags.svg}', alt = '${name.official}'></img>
          <h2 class="country-title">${name.official}</h2></div>
           <p class="country-prop">Capital:<span class="country-prop-value">${capital}</span></p>
          <p class="country-prop">Population:<span class="country-prop-value">${population}</span></p>
           <p class="country-prop">Languages:<span class="country-prop-value">${Object.values(
             languages,
           )}</span></p>
        `;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}
