// import _ from 'lodash';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import onChange from 'on-change';
import axios from 'axios';

// btn.addEventListener('click', () => console.log('click'));

const state = {
  form: {
    state: 'initial',
    value: '',
  },
};

const watchedState = onChange(state, (path, value, prevValue, name) => {
  if (path === 'state.form.state') {
    if (value === 'filled') {
      axios.get(value).then((data) => console.log(data));
    }
  }
  console.log(path, value);
});

// console.log(state);

const btn = document.getElementById('button');
btn.addEventListener('click', (e) => {
  e.preventDefault();
  const url = state.form.value;
  console.log(url);
  watchedState.form.state = 'filled';
});

const input = document.querySelector('input');
input.addEventListener('input', (e) => {
  watchedState.form.value = e.target.value;
  // console.log(e.target.value);
  // console.log(state);
});
