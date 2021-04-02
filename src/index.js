/* eslint-disable max-len */
/* eslint-disable import/extensions */
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

const formatUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`;

const input = document.querySelector('input');
const addRssButton = document.getElementById('button');
// const previewButton = document.querySelector('button[data-toggle=modal]');
const schema = yup.string().url();

const getNewPosts = (state, renderPosts, i18n) => {
  const oldPostsLinks = state.rss.posts.map(({ link }) => link);
  state.form.feedList.forEach(({ id, url }) => {
    axios.get(formatUrl(url))
      .then((response) => {
        const rssContent = response.data.contents;
        const { posts } = parseRss(rssContent);
        const newPosts = posts
          .map((item) => ({ id, ...item }))
          .filter(({ link }) => !_.includes(oldPostsLinks, link));
        newPosts.forEach((post) => state.rss.posts.push(post));
        renderPosts(state, i18n);
      });
  });
};

const state = {
  form: {
    status: 'initial',
    value: '',
    feedList: [],
  },
  rss: {
    feeds: [],
    posts: [],
    modal: {
      title: '',
      description: '',
      link: '',
    },
  },
};

const timeoutCheckForNewPosts = (watchedState, renderPosts, i18n) => {
  setTimeout(() => {
    getNewPosts(watchedState, renderPosts, i18n);
    timeoutCheckForNewPosts(watchedState, renderPosts, i18n);
  }, 5000);
};

i18next
  .init({
    lng: 'ru',
    debug: true,
    resources: {
      ru,
    },
  })
  .then((translationFunction) => {
    const watchedState = onChange(state, (path) => render(watchedState, path, translationFunction, timeoutCheckForNewPosts));

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
              const { status, feed, posts } = parseRss(rssContent, url);
              if (status === 'success') {
                watchedState.form.feedList.unshift({ url });
                watchedState.rss.feeds.push({ ...feed });
                posts.forEach((post) => {
                  const id = _.uniqueId();
                  watchedState.rss.posts.push({ id, ...post, status: 'unread' });
                });
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
