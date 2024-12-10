/* eslint-disable no-undef */
/* Takes in an error message. Sets the error message up in html, and
   displays it to the user. Will be hidden by other events that could
   end in an error.
*/
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('errorContainer').classList.remove('hidden');
  setTimeout(() => document.getElementById('errorContainer').classList.add('hidden'), 5000);
};

/* Sends post requests to the server using fetch. Will look for various
     entries in the response JSON object, and will handle them appropriately.
  */
const sendPost = async (contenttype, url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': contenttype,
    },
    body: contenttype === 'application/json' ? JSON.stringify(data) : data,
  });
  let result = response;
  if (result.headers['Content-Type'] === 'application/json' || 'application/json; charset=utf-8') { result = await result.json(); }
  document.getElementById('errorContainer').classList.add('hidden');

  if (result.redirect) {
    window.location.href = result.redirect;
  }

  if (result.error) {
    handleError(result.error);
  }

  if (handler) {
    handler(result);
  }
};

const hideError = () => {
  document.getElementById('errorContainer').classList.add('hidden');
};

module.exports = {
  handleError,
  sendPost,
  hideError,
};
