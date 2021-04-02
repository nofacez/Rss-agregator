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
    .then((t) => app(t));
};
