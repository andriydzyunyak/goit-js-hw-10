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

refs.input.addEventListener('input', onSearchCountry);

function onSearchCountry(event) {
  const name = event.currentTarget.value;
  fetchCountries(name.trim())
    .then(arrCountries => {
      renderCountriesList(arrCountries);
      if (arrCountries.length > 10) {
        refs.countryList.innerHTML = '';
        refs.countryInfo.innerHTML = '';
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (arrCountries.length === 1) {
        renderCountriesInfo(arrCountries);
      } else {
        refs.countryInfo.innerHTML = '';
      }
    })
    .catch(error => {
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = '';
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function renderCountriesList(arrCountries) {
  const markup = arrCountries
    .map(({ flags, name }) => {
      return `<li class='country-list'>
          <div class='country-shortinfo'>
          <img src = '${flags.svg}', alt = '${name.official}'></img>
          <p><b>${name.official}</b></p>
          </div>
          </li>
        `;
    })
    .join('');
  refs.countryList.innerHTML = markup;
}

function renderCountriesInfo(arrCountries) {
  const markup = arrCountries
    .map(({ capital, population, languages }) => {
      return `<li class='country-list'>
           <p><b>Capital:</b>${capital}</p>
          <p><b>Population:</b>${population}</p>
           <p><b>Languages:</b>${Object.values(languages)}</p>
           </li>
        `;
    })
    .join('');
  refs.countryInfo.innerHTML = markup;
}

// function renderCountries(countries) {
//   const markup = countries
//     .map(({ name, capital, population, flags, languages }) => {
//       return `<li>
//           <p><img>${flags.svg}</img><h2>${name.official}</h2></p>
//           <p><b>Capitel:</b>${capital}</p>
//           <p><b>Population:</b>${population}</p>
//           <p><b>Languages:</b>${Object.values(languages)}</p>
//           </li>
//         `;
//     })
//     .join('');
//   refs.countryList.innerHTML = markup;
// }

function emptyInput(event) {
  if (!event.currentTarget.value.trim()) {
    return (refs.countryList.innerHTML = '');
  }
}
