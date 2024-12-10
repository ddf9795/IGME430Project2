const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const helper = require('./helper.js');

const handleSearch = (e, onSearch) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#skellieName').value;
    const params = new URLSearchParams()
    // window.location.href =
    return false;
  };

const SkellieSearch = (props) => {
    return (
        <form id="skellieSearch"
            // onSubmit={(e) => handleSearch(e, props.triggerReload)}
            name='skellieSearch'
            action='/skellieList'
            method='GET'
            className='skellieSearch'
            enctype='application/x-www-form-urlencoded'
        >
            <label htmlFor='name'>Name: </label>
            <input id='skellieName' type='text' name='name' placeholder='Skellie Name' />
            <input className="searchSubmit" type="submit" value="Search" />
        </form>
    );
};

const SkellieList = (props) => {
    const [skellies, setSkellies] = useState(props.skellies);

    useEffect(() => {
        const loadSkelliesFromServer = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('name') === null) urlParams.append('name', '');
            const response = await fetch(`/getPersonalSkellies?name=${urlParams.get('name')}`);
            const data = await response.json();
            console.log(data);
            setSkellies(data.skellies);
        };
        loadSkelliesFromServer();
    }, [props.skellies]);

    if (skellies.length === 0) {
        return (
            <div className='skellieList'>
                <h3 className='emptySkellie'>No Skellies Yet!</h3>
            </div>
        );
    };

    const skellieNodes = skellies.map(skellie => {
        return (
            <a href={`/skellie?id=${skellie._id}`} >
                <div key={ skellie._id } className='skellie'>
                    {/* Below image display code borrowed from: https://stackoverflow.com/questions/56769076/how-to-show-base64-image-in-react */}
                    <img  src={`data:${skellie.img.contentType};base64, ${Buffer.from(skellie.img.data)}`} alt='skellie face' className='skellieFace' />
                    <h3 className='skellieName'>{skellie.name}</h3>
                    <h3 className='skellieOwner'>Created by: {skellie.owner.username}</h3>
                </div>
            </a>
        );
    });

    return skellieNodes;
};

const App = (props) => {
    const [reloadSkellies, setReloadSkellies] = useState(props.reloadSkellies);

    return (
        <div>
            <div id='search'>
                <SkellieSearch triggerReload={() => setReloadSkellies(!reloadSkellies)} />
            </div>
            <div id='skellies'>
                <SkellieList skellies={ [] } reloadSkellies={ reloadSkellies } />
            </div>
        </div>

    );
};

const init = () => {
    const root = createRoot(document.getElementById('skellieList'));
    root.render( <App /> );
};

window.onload = init;