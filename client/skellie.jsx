const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const helper = require('./helper.js');

const handleBio = (e, onBioAdded) => {
    e.preventDefault();
    helper.hideError();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const topic = e.target.querySelector('#bioTopic').value;
    const desc = e.target.querySelector('#bioDesc').value;
  
    if (!topic || !desc) {
      helper.handleError('All fields are required');
      return false;
    }
    helper.sendPost('application/json', e.target.action, { id, topic, desc }, onBioAdded);
    return false;
  };

  const handleDelete = (e, onDelete) => {
    e.preventDefault();
    helper.hideError();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    helper.sendPost('application/json', "/deleteSkellie", { id }, onDelete);
    setTimeout(() => window.location.href = "/skellieList", 1000);
    return false;
  };

const Skellie = (props) => {
    const [skellies, setSkellies] = useState(props.skellies);

    useEffect(() => {
        const loadSkelliesFromServer = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const response = await fetch(`/getSkellie?id=${urlParams.get('id')}`);
            const data = await response.json();
            console.log(data);
            setSkellies(data.skellies);
        };
        loadSkelliesFromServer();
    }, [props.reloadSkellies]);

    if (skellies.length === 0) {
        return (
            <div className='skellieList'>
                <h3 className='emptySkellie'>No Skellies Yet!</h3>
            </div>
        );
    };

    const skellieNodes = skellies.map(skellie => {
        const bioPoints = Object.entries(skellie.bio).map(t => <li>{t[0]}: {t[1]}</li>)

        const username = document.cookie.split('=')[1];

        const bioForm = username === skellie.owner.username ? (
            <form id="bioForm"
            onSubmit={(e) => handleBio(e, props.triggerReload)}
            name='bioForm'
            action='/addBio'
            method='POST'
            className='bioForm'
            enctype='application/json'
            >
                <input id='bioTopic' type='text' name='topic' placeholder='Topic' required />
                <textarea id='bioDesc' rows='3'  name='desc' placeholder='Description' required />
                <input className="formSubmit" type="submit" value="Add to Bio" />
            </form> 
        ) : null;
        
        const deleteButton = username === skellie.owner.username ? (
            <button id='deleteButton' type='submit' onMouseUp={(e) => handleDelete(e, props.triggerReload)}>Delete Skellie</button>
        ) : null;

        return (
            <div key={ skellie.id } className='skellie'>
                <img  src={`data:${skellie.img.contentType};base64, ${Buffer.from(skellie.img.data)}`} alt='skellie face' className='skellieImg' />
                <h3 className='skellieName'>Name: {skellie.name}</h3>
                <h3 className='skellieOwner'>Created by: {skellie.owner.username}</h3>
                <div className='bio'>
                    <ul>
                        {bioPoints}
                        {bioForm}
                    </ul>
                </div>
                {deleteButton}
            </div>
        );
    });

    return (
        <div className='skellie'>
            {skellieNodes}
        </div>
    );
};

const App = () => {
    const [reloadSkellies, setReloadSkellies] = useState(false);

    return (
        <div>
            <div id='skellie'>
                <Skellie skellies={ [] } reloadSkellies={ reloadSkellies } />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('skellie'));
    root.render( <App /> );
};

window.onload = init;