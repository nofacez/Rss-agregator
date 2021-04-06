import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import parseRss from './rssParser';
import render from './view';

const formatUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}&disableCache=true`;

const getNewPosts = (state, renderPosts) => {
  const oldPostsLinks = state.rss.posts.map(({ link }) => link);
  state.form.feedList.forEach(async (url) => {
    const response = await axios.get(formatUrl(url));
    const rssContent = response.data.contents;
    const { posts } = parseRss(rssContent);
    const newPosts = posts.filter(({ link }) => !_.includes(oldPostsLinks, link));
    newPosts.forEach((post) => state.rss.posts.unshift(post));
    renderPosts(state);
  });
};

const timeoutCheckForNewPosts = (watchedState, renderPosts) => {
  setTimeout(() => {
    getNewPosts(watchedState, renderPosts);
    timeoutCheckForNewPosts(watchedState, renderPosts);
  }, 5000);
};

const start = (state) => {
  const form = document.querySelector('.rss-form');
  const schema = yup.string().url();

  const watchedState = onChange(state, (path) => (
    render(watchedState, path, timeoutCheckForNewPosts)
  ));

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = watchedState.form.value;
    watchedState.form.status = 'checking';
    if (watchedState.form.feedList.includes(url)) {
      watchedState.form.status = 'alreadyAddedRss';
      return;
    }
    try {
      await schema.validateSync(url);
      try {
        const response = await axios.get(formatUrl(url));
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
      } catch {
        watchedState.form.status = 'networkProblems';
      }
    } catch {
      watchedState.form.status = 'invalidUrl';
    }
  });

  form.addEventListener('input', (e) => {
    watchedState.form.value = e.target.value;
  });
};
export default start;
