const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const helper = require('./helper.js');

const SkellieSearch = (props) => {
    return (
        <form id="skellieSearch"
            name='skellieSearch'
            action='/searchPersonalSkellies'
            method='GET'
            className='skellieSearch'
            enctype='application/json'
        >
            <label htmlFor='name'>Name: </label>
            <input id='skellieName' type='text' name='name' placeholder='Skellie Name' />
            <input className="formSubmit" type="submit" value="Search" />
        </form>
    );
};

const SkellieList = (props) => {
    const [skellies, setSkellies] = useState(props.skellies);

    useEffect(() => {
        const loadSkelliesFromServer = async () => {
            const response = await fetch('/getPersonalSkellies');
            const data = await response.json();
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
        return (
            <div key={ skellie._id } className='skellie'>
                <a href={`/skellie?id=${skellie._id}`} ><img  src={`data:${skellie.img.contentType};base64, ${Buffer.from(skellie.img.data)}`} alt='skellie face' className='skellieFace' /></a>
                <h3 className='skellieName'>Name: {skellie.name}</h3>
            </div>
        );
    });

    return skellieNodes;
};

const App = (props) => {
    const [reloadSkellies, setReloadSkellies] = useState(props.reloadSkellies);

    return (
        /* <div id='search'>
            <SkellieSearch triggerReload={() => setReloadSkellies(!reloadSkellies)} />
        </div> */
        <div id='skellies'>
            <SkellieList skellies={ [] } reloadSkellies={ reloadSkellies } />
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('skellieList'));
    root.render( <App /> );
};

window.onload = init;