var code = function() {
  navigator.publishServer = function(name) {
    console.log(name);
  };
};
var script = document.createElement('script');
script.textContent = '(' + code + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);