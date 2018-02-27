document.addEventListener('DOMContentLoaded', () => {
  let serviceListEl = $('#service-list');

  $.ajax({
    url: 'http://localhost:8888',
    success: (response) => {
      const json = JSON.parse(response);
      let services = json.services;
      for (const [name, service] of Object.entries(services)) {
        serviceListEl.append(`<li>${name}</li>`);
      }
    },
    error: () => {
      serviceListEl.append(`<li>The FlyWeb server is down. :-(</li>`);
    }
  });
});
