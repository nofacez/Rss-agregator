/* eslint-disable import/extensions */
// import _ from 'lodash';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import i18next from 'i18next';
import parseRss from './rssParser.js';
import ru from './locales/ru';
import render from './view.js';

const formatUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`;

const input = document.querySelector('input');
const addRssButton = document.getElementById('button');
const schema = yup.string().url();

const state = {
  form: {
    status: 'initial',
    value: '',
    feedList: [],
  },
  rss: [],
};

i18next
  .init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
  .then((t) => {
    const watchedState = onChange(state, (path) => render(watchedState, path, t));

    addRssButton.addEventListener('click', (e) => {
      e.preventDefault();
      const url = watchedState.form.value;
      //  URL validation
      console.log(state);
      watchedState.form.status = 'checking';
      schema.validate(url).then(() => {
        if (watchedState.form.feedList.includes(url)) {
          watchedState.form.status = 'alreadyAddedRss';
        } else if (watchedState.form.value.length === 0) {
          watchedState.form.status = 'unfilled';
        } else {
          axios.get(formatUrl(url))
            .then((response) => {
              const rssContent = response.data.contents;
              const { status, result } = parseRss(rssContent);
              if (status === 'success') {
                const id = _.uniqueId();
                watchedState.form.feedList.unshift(url);
                watchedState.rss.unshift({ id, ...result });
                watchedState.form.value = '';
              }
              watchedState.form.status = status;
            })
            .catch((error) => {
              console.log(error);
              watchedState.form.status = 'networkProblems';
            });
        }
      })
        .catch((err) => {
          watchedState.form.status = 'invalidUrl';
          console.log('HERE', err);
        });
    });

    input.addEventListener('input', (e) => {
      watchedState.form.value = e.target.value;
    });
  });
