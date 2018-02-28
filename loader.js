var code = function() {
  navigator['publishServer'] = function(name) {
    return new Promise((resolve, reject) => {
      let data = { type: 'FlyWebExt-PublishServer', name };
      window.postMessage(data, '*');
      const listener = (event) => {
        if (event.source !== window) { return; }
        if (event.data.type && event.data.type === 'FlyWebExt-PublishServer-Success') {
          window.removeEventListener('message', listener);
          resolve(event.data.response);
        } else if (event.data.type && event.data.type === 'FlyWebExt-PublishServer-Error') {
          window.removeEventListener('message', listener);
          reject(event.data.error);
        }
      };
      window.addEventListener('message', listener);
    });
  };
};
var script = document.createElement('script');
script.textContent = '(' + code + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

// ---

window.addEventListener('message', (event) => {
  if (event.source !== window) { return; }
  if (event.data.type && event.data.type === 'FlyWebExt-PublishServer') {
    event.stopPropagation();
    $.ajax({
      type: 'GET',
      url: 'http://localhost:8888/publishServer',
      success: (json) => {
        const data = {
          type: 'FlyWebExt-PublishServer-Success',
          response: {
            name: 'a name!', // TODO: Get this from MDNS server
            uiUrl: undefined,
            close: undefined, // () => {},
            onclose: undefined,
            onfetch: undefined,
            onwebsocket: undefined
          }
        };
        window.postMessage(data, '*'); // TODO: use event.origin?
      },
      error: (xhr, type) => {
        window.postMessage({
          type: 'FlyWebExt-PublishServer-Error',
          error:  type
        }, '*');
      }
    });
  }
});
