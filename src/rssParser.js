export default (strXML) => {
  const domparser = new DOMParser();
  console.log(domparser.parseFromString(strXML, 'text/html'));
};
