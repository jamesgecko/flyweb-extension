var code = function() {
  navigator['publishServer'] = function(name) {
    return Promise.reject(JSON.stringify({ error: 'Not implemented' }));
  };
};
var script = document.createElement('script');
script.textContent = '(' + code + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);