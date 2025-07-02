//The HTTPClient.js implementation was taken from Day19 activity HTTPClient.js file
async function processJSONResponse(res) {
  const resObj = {
    data: res.json(),
    statusCode: res.status,
    statusText: res.statusText,
  }

  return resObj;
};

function handleError(err) {
  console.error('Error in fetch', err);
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
        'Accept': 'application/json',
        'X-Content-Type-Options': 'nosniff'
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
        'Accept': 'application/json',
        'X-Content-Type-Options': 'nosniff'
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
        'Accept': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      }
    })
      .then(processJSONResponse)
      .catch(handleError);

  },

  delete: (url) => {
    return fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'X-Content-Type-Options': 'nosniff'
      }
    })
      .then(processJSONResponse)
      .catch(handleError);
  },

};