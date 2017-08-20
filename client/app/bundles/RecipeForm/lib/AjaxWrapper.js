export default {
  get: function(path, returnType, callback) {
    fetch(path)
    .then(response => {
      switch(returnType) {
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
      callback(data);
    })
    .catch(error => {
      console.log(error);
    });
  }
}
