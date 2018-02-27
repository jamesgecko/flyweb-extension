document.addEventListener('DOMContentLoaded', () => {
  let serviceListEl = $('#service-list');

  $.ajax({
    url: 'http://localhost:8888',
    success: (response) => {
      const json = JSON.parse(response);
      let services = json.services;
      for (const [name, service] of Object.entries(services)) {
        serviceListEl.append(`<li><a href="http://${service.host}:${service.port}" target="_blank">${name}</a></li>`);
      }
    },
    error: () => {
      serviceListEl.append(`<li>The FlyWeb server is down. :-(</li>`);
    }
  });
});
