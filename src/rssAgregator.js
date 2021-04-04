/* eslint-disable max-len */
/* eslint-disable import/extensions */
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import parseRss from './rssParser.js';
import render from './view.js';

const formatUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`;

const getNewPosts = (state, renderPosts, i18n) => {
  const oldPostsLinks = state.rss.posts.map(({ link }) => link);
  state.form.feedList.forEach((url) => {
    axios.get(formatUrl(url))
      .then((response) => {
        const rssContent = response.data.contents;
        const { posts } = parseRss(rssContent);
        const newPosts = posts
          .map((item) => ({ ...item }))
          .filter(({ link }) => !_.includes(oldPostsLinks, link));
        newPosts.forEach((post) => state.rss.posts.unshift(post));
        renderPosts(state, i18n);
      });
  });
};

const timeoutCheckForNewPosts = (watchedState, renderPosts, i18n) => {
  setTimeout(() => {
    getNewPosts(watchedState, renderPosts, i18n);
    timeoutCheckForNewPosts(watchedState, renderPosts, i18n);
  }, 5000);
};

const start = (t, state) => {
  // const state = {
  //   form: {
  //     status: 'initial',
  //     value: '',
  //     feedList: [],
  //   },
  //   rss: {
  //     feeds: [],
  //     posts: [],
  //     modal: {
  //       title: '',
  //       description: '',
  //       link: '',
  //     },
  //   },
  // };
  const input = document.querySelector('input');
  const addRssButton = document.querySelector('button[name=add]');
  const schema = yup.string().url();

  const watchedState = onChange(state, (path) => render(watchedState, path, t, timeoutCheckForNewPosts));

  addRssButton.addEventListener('click', (e) => {
    e.preventDefault();
    const url = watchedState.form.value;
    //  URL validation
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
              watchedState.form.feedList.unshift(url);
              watchedState.rss.feeds.push({ ...feed });
              const previousPosts = watchedState.rss.posts;
              watchedState.rss.posts = [...posts, ...previousPosts];
              watchedState.form.value = '';
            }
            watchedState.form.status = status;
          })
          .catch(() => {
            watchedState.form.status = 'networkProblems';
          });
      }
    })
      .catch(() => {
        watchedState.form.status = 'invalidUrl';
      });
  });

  input.addEventListener('input', (e) => {
    watchedState.form.value = e.target.value;
  });
};
export default start;
