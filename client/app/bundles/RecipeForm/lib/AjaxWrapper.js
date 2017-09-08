export default class Ajax {}


/*performs a GET req. Accepts an options object:
options = {
  url: 'http://api.example.com',
  data: {your_param: value, another_param: value},
  return: 'json', #specifies what data type to return. options are text, json, blob. defaults to text
  success: callback function,
  failure: callback function
}*/
Ajax.get = function(options) {
  fetch(generatePath(options))
  .then(response => {
    switch(options.return) {
      case 'json':
        return response.json();
      case 'text':
        return response.text();
      case 'blob':
        return response.blob();
      default:
        return response.text();
    }
  })
  .then(data => {
    options.success(data);
  })
  .catch(error => {
    options.failure(error);
  });
}

function generatePath(options) {
  let path = options.url;

  path += '?' + Object.keys(options.data).map(key => {
    return `${key}=${options.data[key]}`;
  }).join('&');

  return encodeURI(path);
}
