/* eslint-disable import/extensions */
import i18next from 'i18next';
import app from './rssAgregator.js';
import ru from './locales/ru';

export default async () => {
  await i18next
    .init({
      lng: 'ru',
      debug: true,
      resources: {
        ru,
      },
    });

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
  app(state);
};
