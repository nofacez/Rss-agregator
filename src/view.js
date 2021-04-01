// import onChange from 'on-change';
// import i18next from 'i18next';
// import ru from './locales/ru';

const form = document.getElementsByClassName('rss-form');
const feedsEl = document.querySelector('.feeds');
const postsEl = document.querySelector('.posts');
const input = document.querySelector('input');

const addRssButton = document.getElementById('button');

const getFeedback = (status, feedback) => {
  const div = document.querySelector('.feedback');
  // reset form input if loaded successfully
  if (status === 'success') {
    form[0].reset();
    div.classList.remove('text-danger');
    input.classList.remove('is-invalid');
    div.classList.add('text-success');
  } else {
    input.classList.add('is-invalid');
    div.classList.add('text-danger');
  }
  div.innerHTML = feedback;
};

const getPosts = (state, i18next) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  postsEl.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.innerHTML = i18next('content.postsHeader');
  postsEl.appendChild(h2);
  state.rss.posts.forEach(({ id, postTitle, link }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-id', id);
    const aTag = document.createElement('a');
    aTag.setAttribute('href', link);
    const p = document.createElement('p');
    p.innerHTML = postTitle;
    aTag.appendChild(p);
    li.appendChild(aTag);
    ul.prepend(li);
  });
  postsEl.appendChild(ul);
};

const getFeeds = (state, i18next) => {
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  feedsEl.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.innerHTML = i18next('content.feedHeader');
  feedsEl.appendChild(h2);
  state.rss.feeds.forEach(({ id, title, description }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-id', id);
    const h3 = document.createElement('h3');
    const p = document.createElement('p');
    h3.innerHTML = title;
    p.innerHTML = description;
    li.appendChild(h3);
    li.appendChild(p);
    ul.prepend(li);
  });
  feedsEl.appendChild(ul);
};

const renderRssContent = (state, i18next) => {
  getFeeds(state, i18next);
  getPosts(state, i18next);
};

const render = (state, path, i18next, updateRss) => {
  if (path === 'form.status') {
    const { status } = state.form;
    const feedbackText = i18next(`errors.${status}`);
    addRssButton.removeAttribute('disabled');
    switch (status) {
      case 'checking':
        addRssButton.setAttribute('disabled', true);
        break;
      case 'success':
        renderRssContent(state, i18next);
        updateRss(state, getPosts, i18next);
        getFeedback(status, feedbackText);
        break;
      default:
        getFeedback(status, feedbackText);
    }
  }
};

export default render;
