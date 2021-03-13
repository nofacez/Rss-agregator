export default (strXML) => {
  const domparser = new DOMParser();
  const newDocument = domparser.parseFromString(strXML, 'text/xml');
  return newDocument.firstChild.tagName === 'rss' ? 'valid' : 'invalid';
};
