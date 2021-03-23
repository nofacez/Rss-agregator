/* eslint-disable import/extensions */
// import _ from 'lodash';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import parseRss from './rssParser.js';

// btn.addEventListener('click', () => console.log('click'));
// <div class="feedback text-success text-danger">RSS уже существует</div>
const formatUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?url=${encodeURIComponent(url)}`;
const input = document.querySelector('input');
const form = document.getElementsByClassName('rss-form');
const feedsEl = document.querySelector('.feeds');
const postsEl = document.querySelector('.posts');

const getFeedback = (status, feedback) => {
  const div = document.querySelector('.feedback');
  if (status === 'invalid') {
    input.classList.add('is-invalid');
    div.classList.add('text-danger');
  } else {
    form[0].reset();
    div.classList.remove('text-danger');
    input.classList.remove('is-invalid');
    div.classList.add('text-success');
    // reset form input if loaded successfully
  }
  div.innerHTML = feedback;
};

const getFeeds = ({ rss }) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  feedsEl.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.innerHTML = 'Фиды';
  feedsEl.appendChild(h2);
  rss.forEach(({ id, feed }) => {
    console.log('feed', feed);
    const { title, description } = feed;
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-id', id);
    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    h3.innerHTML = title;
    p.innerHTML = description;
    li.appendChild(h3);
    li.appendChild(p);
    ul.appendChild(li);
  });
  feedsEl.appendChild(ul);
};

const getPosts = ({ rss }) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  postsEl.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.innerHTML = 'Посты';
  postsEl.appendChild(h2);
  rss.forEach(({ id, posts }) => {
    posts.forEach(({ postTitle, link }) => {
      console.log(postTitle);
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.setAttribute('data-id', id);
      const aTag = document.createElement('a');
      aTag.setAttribute('href', link);
      const p = document.createElement('p');
      p.innerHTML = postTitle;
      aTag.appendChild(p);
      li.appendChild(aTag);
      ul.appendChild(li);
    });
    postsEl.appendChild(ul);
  });
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
  rss: [],
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
    // const { rss } = watchedState;
    if (type === 'success') {
      getFeeds(state);
      getPosts(state);
      // feedsEl.appendChild(ul);
    }
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
  watchedState.form.state.type = 'checking';
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
