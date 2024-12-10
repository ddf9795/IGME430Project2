const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');
const helper = require('./helper.js');

let mySkellies;

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

  const handleUserAdd = (e, onUserAdded) => {
    e.preventDefault();
    helper.hideError();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const user = e.target.querySelector('#whitelistUser').value;
  
    if (!user) {
      helper.handleError('All fields are required');
      return false;
    }
    helper.sendPost('application/json', e.target.action, { id, user }, onUserAdded);
    return false;
  };

  const handleComment = (e, onCommentAdded) => {
    e.preventDefault();
    helper.hideError();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const poster = e.target.querySelector('#posterSelect').value;
    const comment = e.target.querySelector('#comment').value;
  
    if (!poster || !comment) {
      helper.handleError('All fields are required');
      return false;
    }
    helper.sendPost('application/json', e.target.action, { id, poster, comment }, onCommentAdded);
    return false;
  };

  const handleDelete = (e, onDelete) => {
    e.preventDefault();
    helper.hideError();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    helper.sendPost('application/json', "/deleteSkellie", { id }, onDelete);
    // setTimeout(() => window.location.href = "/skellieList", 1000);
    return false;
  };

  const handleBioDelete = (e, onDelete) => {
    e.preventDefault();
    helper.hideError();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log(e.target.parentElement.attributes['name'].value)
    const name = e.target.parentElement.attributes['name'].value;

    helper.sendPost('application/json', "/deleteBio", { id, name }, onDelete);
    // setTimeout(() => window.location.reload(), 1000);
    return false;
  };

  const handleUserDelete = (e, onDelete) => {
    e.preventDefault();
    helper.hideError();

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log(e.target.parentElement.attributes['name'].value)
    const index = e.target.parentElement.attributes['name'].value;

    helper.sendPost('application/json', "/deleteWhitelistUser", { id, index }, onDelete);
    // setTimeout(() => window.location.reload(), 1000);
    return false;
  };

const Skellie = (props) => {
    const [skellies, setSkellies] = useState(props.skellies);

    useEffect(() => {
        const loadSkelliesFromServer = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const response = await fetch(`/getSkellie?id=${urlParams.get('id')}`);
            const data = await response.json();

            const ownerSkellies = await fetch('/getPersonalSkellies?name=')
            mySkellies = await ownerSkellies.json()

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
        const username = document.cookie.split('=')[1];

        const deleteBio = username === skellie.owner.username ? (
            <button class='deleteBio' onMouseUp={(e) => handleBioDelete(e, props.triggerReload)}>-</button>
        ) : null;

        const deleteUser = username === skellie.owner.username ? (
            <button class='deleteUser' onMouseUp={(e) => handleUserDelete(e, props.triggerReload)}>-</button>
        ) : null;

        const bioPoints = Object.entries(skellie.bio).map(t => <li name={t[0]}>{t[0]}: {t[1]} {deleteBio}</li>)

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

        const permittedUsers = Object.entries(skellie.permittedUsers).map(t => <li name={t[0]}>{t[1]} {deleteUser}</li>)

        const userForm = username === skellie.owner.username ? (
            <form id="userForm"
            onSubmit={(e) => handleUserAdd(e, props.triggerReload)}
            name='userForm'
            action='/addWhitelistUser'
            method='POST'
            className='userForm'
            enctype='application/json'
            >
                <input id='whitelistUser' type='text' name='whitelistUser' placeholder='User' required />
                <input className="formSubmit" type="submit" value="Add to Whitelist" />
            </form> 
        ) : null;

        const permittedUsersSection = username === skellie.owner.username && skellie.visibility === 'private' ? (
            <ul>
                <li>{username}</li>
                {permittedUsers}
                <li>{userForm}</li>
            </ul>
        ) : null;
        
        const deleteButton = username === skellie.owner.username ? (
            <button id='deleteButton' className='searchSubmit' type='submit' onMouseUp={(e) => handleDelete(e, props.triggerReload)}>Delete Skellie</button>
        ) : null;

        const commentSection = skellie.comments.map(t => (
            <div className='commentContainer'>
                <img src='https://placehold.co/250x250' hidden/>
                <h3 className='commentUsername'>{t.poster}</h3>
                <p className='commentContents'>{t.content}</p>
                <hr></hr>
            </div>
        ))

        console.log(mySkellies.skellies)

        const skellieSelect = mySkellies.skellies.map(t => <option value={t.name}>{t.name}</option>)

        const addComment = (
            <form id="commentForm"
            onSubmit={(e) => handleComment(e, props.triggerReload)}
            name='commentForm'
            action='/addComment'
            method='POST'
            className='commentForm'
            enctype='application/json'
            >
                <select name='poster' id='posterSelect' hidden>
                    <option value={username}>Myself ({username})</option>
                    {skellieSelect}
                </select>
                <textarea id='comment' rows='3'  name='comment' placeholder='Type something...' required />
                <input className="formSubmit" type="submit" value="Post" />
            </form> 
        )

        return (
            <div key={ skellie.id } className='skelliePageDisplay'>
                {/* Below image display code borrowed from: https://stackoverflow.com/questions/56769076/how-to-show-base64-image-in-react */}
                <img  src={`data:${skellie.img.contentType};base64, ${Buffer.from(skellie.img.data)}`} alt='skellie face' className='skellieImg' />
                <div id="skellieInfo">
                    <h3 className='skellieName'>Name: {skellie.name}</h3>
                    <h3 className='skellieOwner'>Created by: {skellie.owner.username}</h3>
                    <div className='bio'>
                        <h2 className='bioHeader'>About This Skellie</h2>
                        <ul>
                            {bioPoints}
                            <li>{bioForm}</li>
                        </ul>
                    </div>
                    <div className='whitelist'>
                        {permittedUsersSection}
                    </div>
                    <div className='commentsSection'>
                        <h2 className='commentsHeader'>Comments</h2>
                        {commentSection}
                        {addComment}
                    </div>
                    <div className='deleteDiv'>
                        {deleteButton}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className='skellieContainer'>
            {skellieNodes}
        </div>
    );
};

const App = () => {
    const [reloadSkellies, setReloadSkellies] = useState(false);

    return (
        <div>
            <div id='skelliePage'>
                <Skellie skellies={ [] } reloadSkellies={ reloadSkellies } triggerReload={() => setReloadSkellies(!reloadSkellies)} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('skellieDisplay'));
    root.render( <App /> );
};

window.onload = init;