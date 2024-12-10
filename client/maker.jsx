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

const handleCheckSize = (e) => {
    // File size check code borrowed from https://stackoverflow.com/questions/5697605/limit-the-size-of-a-file-upload-html-input-element
    if (e.target.files[0].size > 5242880) {
        helper.handleError('Provided image is too large! Please choose an image that is smaller than 5 MB.');
        e.target.value = "";

        document.querySelector('.skelliePreview').file = file
    }
    else {
        // Preview code adapted from official documentation 
        // https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications#example_showing_thumbnails_of_user-selected_images
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            document.querySelector('.skelliePreview').src = e.target.result;
        }
        reader.readAsDataURL(file);
    }
}

const SkellieForm = (props) => {
    return (
        <form id="skellieForm"
            onSubmit={(e) => handleSkellie(e, props.triggerReload)}
            name='skellieForm'
            action='/maker'
            method='POST'
            className='mainForm'
            enctype='multipart/form-data'
        >
            <label htmlFor='name'>Name: </label>
            <input id='skellieName' type='text' name='name' placeholder='Skellie Name' required />
            <label htmlFor='img'>Skellie Icon: </label>
            <input id='skellieIcon' type='file' accept='image/png, image/jpg, image/gif' name='img' onChange={handleCheckSize} required />
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
                <img  src='' className='skelliePreview' />
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