/* eslint-disable import/extensions */
import i18next from 'i18next';
import app from './rssAgregator.js';
import ru from './locales/ru';

export default () => {
  i18next
    .init({
      lng: 'ru',
      debug: true,
      resources: {
        ru,
      },
    })
    .then((t) => {
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
      app(t, state);
    });
};
