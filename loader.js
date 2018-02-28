var code = function() {
  navigator['publishServer'] = function(name) {
    return new Promise((resolve, reject) => {
      let data = { type: 'FlyWebExt-PublishServer', name };
      window.postMessage(data, '*');
      window.addEventListener('message',
        (event) => {
          if (event.source !== window) { return; }
          if (event.data.type && event.data.type === 'FlyWebExt-PublishServer-Success') {
            resolve(event.data.response);
          } else if (event.data.type && event.data.type === 'FlyWebExt-PublishServer-Error') {
            reject(event.data.error);
          }
        },
        { once: true }
      );
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
    $.ajax({
      type: 'GET',
      url: 'http://localhost:8888/publishServer',
      success: (json) => {
        window.postMessage({
          type: 'FlyWebExt-PublishServer-Success',
          response: {
            name: 'a name!', // TODO: Get this from MDNS server
            uiUrl: undefined,
            close: undefined, // () => {},
            onclose: undefined,
            onfetch: undefined,
            onwebsocket: undefined
          }
        }, '*');
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
