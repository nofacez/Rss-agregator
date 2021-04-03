/* eslint-disable object-curly-newline */
import { uniqueId } from 'lodash';

export default (strXML, url) => {
  const domparser = new DOMParser();
  const newDocument = domparser.parseFromString(strXML, 'text/xml');
  const titleEl = newDocument.querySelector('title');
  if (newDocument.firstChild.tagName !== 'rss') {
    return { status: 'missingRss' };
  }
  const descriptionEl = newDocument.querySelector('description');
  const title = titleEl.textContent;
  const description = descriptionEl.textContent;
  const postsList = newDocument.querySelectorAll('item');
  const postsArr = Array.from(postsList);
  const posts = postsArr.map((post) => {
    const id = uniqueId();
    const postTitle = post.querySelector('title').textContent;
    const link = post.querySelector('link').textContent;
    const postDescription = post.querySelector('description').textContent;
    return { id, postTitle, link, postDescription, url, status: 'unread' };
  });
  return { status: 'success', feed: { title, description, url }, posts };
};
