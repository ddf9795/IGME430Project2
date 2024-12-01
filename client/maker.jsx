const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const helper = require('./helper.js');

const handleSkellie = (e, onSkellieAdded) => {
//   e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#skellieName').value;
  const img = e.target.querySelector('#skellieIcon').files[0];
  const vis = e.target.querySelector('#visSelect').value;

  if (!name || !img || !vis) {
    helper.handleError('All fields are required');
    return false;
  }
//   helper.sendPost(e.target.enctype, e.target.action, data, onSkellieAdded);
  return false;
};

const SkellieForm = (props) => {
    return (
        <form id="skellieForm"
            onSubmit={(e) => handleSkellie(e, props.triggerReload)}
            name='skellieForm'
            action='/maker'
            method='POST'
            className='skellieForm'
            enctype='multipart/form-data'
        >
            <label htmlFor='name'>Name: </label>
            <input id='skellieName' type='text' name='name' placeholder='Skellie Name' required />
            <label htmlFor='img'>Skellie Icon: </label>
            <input id='skellieIcon' type='file' name='img' required />
            <label htmlFor='vis'>Visibility: </label>
            <select id='visSelect' name='vis'>
                <option value='public'>Public</option>
                <option value='private' selected>Private</option>
            </select>
            <input className="formSubmit" type="submit" value="Make Skellie" />
        </form>
    );
};

const App = () => {
    const [reloadSkellies, setReloadSkellies] = useState(false);

    return (
        <div>
            <div id='makeSkellie'>
                <SkellieForm triggerReload={() => setReloadSkellies(!reloadSkellies)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;