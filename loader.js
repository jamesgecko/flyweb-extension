var code = function() {
  function postMessageToContentScript(type, data) {
    return new Promise((resolve, reject) => {
      data['type'] = type;
      window.postMessage(data, '*');
      const listener = (event) => {
        if (event.source !== window || !event.data.type) { return; }
        if (event.data.type === `${type}-Success`) {
          window.removeEventListener('message', listener);
          resolve(event.data.response);
        } else if (event.data.type === `${type}-Error`) {
          window.removeEventListener('message', listener);
          reject(event.data.error);
        }
      };
      window.addEventListener('message', listener);
    });
  }

  function initServer(object) {
    object.close = () => postMessageToContentScript('FlyWebExt-Close', {});
    return object;
  }

  navigator['publishServer'] = function(name) {
    return postMessageToContentScript('FlyWebExt-PublishServer', { name })
      .then((response) => initServer(response));
  };
};
var script = document.createElement('script');
script.textContent = '(' + code + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);

// ---

function publishServer(data) {
  $.ajax({
    type: 'POST',
    url: 'http://localhost:8888/publishServer',
    data: data,
    success: (json) => {
      const data = {
        type: 'FlyWebExt-PublishServer-Success',
        response: Object.assign(json, {
          close: undefined, // () => {},
          onclose: undefined, // event
          onfetch: undefined, // event
          onwebsocket: undefined // event
        })
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

function close() {
  console.log('close called (content)');
}

window.addEventListener('message', (event) => {
  if (event.source !== window || !event.data.type) { return; }
  switch (event.data.type) {
    case 'FlyWebExt-PublishServer':
      event.stopPropagation();
      publishServer(event.data);
      break;
    case 'FlyWebExt-Close':
      event.stopPropagation();
      close();
      break;
  }
});
