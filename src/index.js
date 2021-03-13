/* eslint-disable import/extensions */
// import _ from 'lodash';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import parseRss from './rssParser.js';

// btn.addEventListener('click', () => console.log('click'));
// <div class="feedback text-success text-danger">RSS уже существует</div>
const formatUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`;
const input = document.querySelector('input');
const form = document.getElementsByClassName('rss-form');

const getFeedback = (status, feedback) => {
  const div = document.querySelector('.feedback');
  if (status === 'invalid') {
    input.classList.add('is-invalid');
    div.classList.add('text-danger');
  } else {
    div.classList.remove('text-danger');
    input.classList.remove('is-invalid');
    div.classList.add('text-success');
    // reset form input if loaded successfully
    form[0].reset();
  }
  div.innerHTML = feedback;
};

const schema = yup.string().url();

const state = {
  form: {
    state: {
      status: 'invalid',
      type: 'initial',
    },
    value: '',
    feedList: [],
  },
  errors: {
    success: 'RSS был успешно загружен',
    networkProblems: 'Проблема с соединением',
    invalidUrl: 'Ссылка должна быть валидным URL',
    missingRss: 'Ресурс не содержит валидный RSS',
    alreadyAddedRss: 'RSS уже добавлен',
  },
};

console.log(state);

const watchedState = onChange(state, (path) => {
  if (path === 'form.state.type') {
    const { status, type } = watchedState.form.state;
    const feedbackText = watchedState.errors[type];
    getFeedback(status, feedbackText);
  }
});

// console.log(state);

const btn = document.getElementById('button');
btn.addEventListener('click', (e) => {
  e.preventDefault();
  const url = watchedState.form.value;
  //  URL validation
  console.log(state);
  schema.isValid(url).then((valid) => {
    if (valid) {
      if (watchedState.form.feedList.includes(url)) {
        watchedState.form.state.status = 'invalid';
        watchedState.form.state.type = 'alreadyAddedRss';
      } else {
        axios.get(formatUrl(url))
          .then((response) => {
            // console.log(response);
            // console.log(state);
            const rssContent = response.data.contents;
            if (parseRss(rssContent) === 'invalid') {
              console.log('parser:', parseRss(rssContent));
              watchedState.form.state.status = 'invalid';
              watchedState.form.state.type = 'missingRss';
            } else {
              watchedState.form.state.status = 'valid';
              watchedState.form.state.type = 'success';
              watchedState.form.feedList.push(url);
            }
          })
          .catch((error) => {
            console.log(error);
            watchedState.form.state.status = 'invalid';
            watchedState.form.state.type = 'networkProblems';
          });
      }
    } else {
      watchedState.form.state.status = 'invalid';
      watchedState.form.state.type = 'invalidUrl';
    }
  });
});

input.addEventListener('input', (e) => {
  watchedState.form.value = e.target.value;
});
