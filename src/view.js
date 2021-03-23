import onChange from 'on-change';

const form = document.getElementsByClassName('rss-form');
const feedsEl = document.querySelector('.feeds');
const postsEl = document.querySelector('.posts');
const input = document.querySelector('input');

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

const view = (state) => onChange(state, (path) => {
  if (path === 'form.state.type') {
    const { status, type } = state.form.state;
    const feedbackText = state.errors[type];
    if (type === 'checking') return;
    if (type === 'success') {
      getFeeds(state);
      getPosts(state);
    }
    getFeedback(status, feedbackText);
  }
});

export default view;
