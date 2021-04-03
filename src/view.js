/* eslint-disable no-param-reassign */
/* eslint-disable object-curly-newline */
// import onChange from 'on-change';
// import i18next from 'i18next';
// import ru from './locales/ru';
import _ from 'lodash';

const renderFeedback = (status, feedback) => {
  const form = document.getElementsByClassName('rss-form');
  const input = document.querySelector('input');
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

const updateModal = (state) => {
  const modalTitle = document.querySelector('#modalTitle');
  const modalBody = document.querySelector('.modal-body');
  const modalLink = document.querySelector('.full-article');
  modalTitle.innerHTML = '';
  modalBody.innerHTML = '';
  modalTitle.textContent = state.rss.modal.title;
  const modalDesctiption = document.createElement('p');
  modalDesctiption.innerHTML = state.rss.modal.description;
  modalLink.setAttribute('href', state.rss.modal.link);
  modalBody.appendChild(modalDesctiption);
};

const renderPosts = (state, i18next) => {
  const postsEl = document.querySelector('.posts');
  const ul = document.createElement('ul');
  ul.classList.add('list-group');
  postsEl.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.innerHTML = i18next('content.postsHeader');
  postsEl.appendChild(h2);
  state.rss.posts.forEach(({ id, postTitle, link, postDescription, status }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'justify-content-between', 'aligh-items-start', 'd-flex');
    const aTag = document.createElement('a');
    const previewButton = document.createElement('button');
    previewButton.textContent = i18next('buttons.previewButton');
    previewButton.setAttribute('type', 'button');
    previewButton.setAttribute('data-toggle', 'modal');
    previewButton.setAttribute('data-target', '#modal');
    previewButton.setAttribute('data-id', id);
    previewButton.classList.add('btn', 'btn-primary', 'btn-sm');
    previewButton.addEventListener('click', (e) => {
      e.preventDefault();
      // const currentPost = _.find(state.rss.posts, ['id', id]);
      const currentPostIndex = _.findIndex(state.rss.posts, ['id', id]);
      state.form.status = 'openedModal';
      state.rss.posts[currentPostIndex].status = 'read';
      state.rss.modal.title = postTitle;
      state.rss.modal.description = postDescription;
      state.rss.modal.link = link;
      updateModal(state);
      renderPosts(state, i18next);
    });
    aTag.setAttribute('href', link);
    aTag.setAttribute('data-id', id);
    const postTextWeight = status === 'read' ? 'font-weight-normal' : 'font-weight-bold';
    aTag.classList.add(postTextWeight);
    const p = document.createElement('p');
    p.innerHTML = postTitle;
    aTag.appendChild(p);
    li.appendChild(aTag);
    li.appendChild(previewButton);
    ul.appendChild(li);
  });
  postsEl.appendChild(ul);
};

const renderFeeds = (state, i18next) => {
  const feedsEl = document.querySelector('.feeds');
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'mb-5');
  feedsEl.innerHTML = '';
  const h2 = document.createElement('h2');
  h2.innerHTML = i18next('content.feedHeader');
  feedsEl.appendChild(h2);
  state.rss.feeds.forEach(({ title, description }) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
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
  renderFeeds(state, i18next);
  renderPosts(state, i18next);
};

const render = (state, path, i18next, updateRss) => {
  const input = document.querySelector('input');
  const addRssButton = document.querySelector('button[name=add]');
  if (path === 'form.status') {
    const { status } = state.form;
    const feedbackText = i18next(`errors.${status}`);
    addRssButton.removeAttribute('disabled');
    input.removeAttribute('readonly');
    switch (status) {
      case 'checking':
        input.setAttribute('readonly', true);
        addRssButton.setAttribute('disabled', true);
        break;
      case 'success':
        renderRssContent(state, i18next);
        updateRss(state, renderPosts, i18next);
        renderFeedback(status, feedbackText);
        break;
      case 'openedModal':
        break;
      default:
        renderFeedback(status, feedbackText);
    }
  }
};

export default render;
