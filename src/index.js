/* eslint-disable import/extensions */
// import _ from 'lodash';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import axios from 'axios';
import parseRss from './rssParser.js';

// btn.addEventListener('click', () => console.log('click'));

const formatUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`;

const state = {
  form: {
    state: 'initial',
    value: '',
  },
};

const watchedState = onChange(state, (path, value) => {
  if (path === 'state.form.state') {
    if (value === 'filled') {
      axios.get(value).then((data) => console.log(data));
    }
  }
  console.log(path, value);
});

// console.log(state);

const btn = document.getElementById('button');
btn.addEventListener('click', (e) => {
  e.preventDefault();
  const url = watchedState.form.value;
  console.log(url);
  axios.get(formatUrl(url))
    // .then((response) => console.log(domparser.parseFromString(response.data, 'text/html')))
    .then((response) => {
      console.log(response);
      const rssContet = response.data.contents;
      console.log(parseRss(rssContet));
    })
    .catch((error) => console.log(error));
  watchedState.form.state = 'filled';
});

const input = document.querySelector('input');
input.addEventListener('input', (e) => {
  watchedState.form.value = e.target.value;
});
