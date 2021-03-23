/* eslint-disable import/extensions */
// import _ from 'lodash';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
// import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import parseRss from './rssParser.js';
import view from './view.js';

const formatUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`;
const input = document.querySelector('input');

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
  rss: [],
  errors: {
    success: 'RSS был успешно загружен',
    networkProblems: 'Проблема с соединением',
    invalidUrl: 'Ссылка должна быть валидным URL',
    missingRss: 'Ресурс не содержит валидный RSS',
    alreadyAddedRss: 'RSS уже добавлен',
  },
};

// стало
const watchedState = view(state);

// было
// const watchedState = onChange(state, (path) => {
//   if (path === 'form.state.type') {
//     const { status, type } = watchedState.form.state;
//     const feedbackText = watchedState.errors[type];
//     // const { rss } = watchedState;
//     if (type === 'success') {
//       getFeeds(state);
//       getPosts(state);
//       // feedsEl.appendChild(ul);
//     }
//     getFeedback(status, feedbackText);
//   }
// });

// console.log(state);

const btn = document.getElementById('button');
btn.addEventListener('click', (e) => {
  e.preventDefault();
  const url = watchedState.form.value;
  //  URL validation
  console.log(state);
  watchedState.form.state.type = 'checking';
  schema.isValid(url).then((valid) => {
    if (valid) {
      if (watchedState.form.feedList.includes(url)) {
        watchedState.form.state.status = 'invalid';
        watchedState.form.state.type = 'alreadyAddedRss';
      } else {
        axios.get(formatUrl(url))
          .then((response) => {
            const rssContent = response.data.contents;
            const parsingResult = parseRss(rssContent);
            if (parsingResult === 'invalid') {
              watchedState.form.state.status = 'invalid';
              watchedState.form.state.type = 'missingRss';
            } else {
              const id = _.uniqueId();
              watchedState.form.feedList.unshift(url);
              watchedState.rss.unshift({ id, ...parsingResult });
              watchedState.form.state.status = 'valid';
              watchedState.form.state.type = 'success';
              console.log(state);
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
