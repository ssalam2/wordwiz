//The HTTPClient.js implementation was taken from Day19 activity HTTPClient.js file
async function processJSONResponse(res) {
  return res.json();
};

function handleError(err) {
  console.error('Error in fetch', err);
  throw err;
};

export default {
  get: (url) => {
    return fetch(url)
      .then(processJSONResponse)
      .catch(handleError);
  },

  post: (url, data) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(processJSONResponse)
      .catch(handleError);
  },

  put: (url, data) => {
    return fetch(url, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(processJSONResponse)
      .catch(handleError);

  },

  patch: (url, data) => {
    return fetch(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(processJSONResponse)
      .catch(handleError);

  },

  delete: (url) => {
    return fetch(url, {
      method: 'DELETE',
      headers: {
      }
    })
      .then(processJSONResponse)
      .catch(handleError);
  },

};