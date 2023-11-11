import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import appStyle from '../../App.module.css';

export default function UtuEndorse() {

  const [platform, setPlatform] = useState<string>("");
  const [handle, setHandle] = useState<string>("");
  const [searchResults, setSearchResults] = useState<string>("No Search Results");

  const search = () => {

  }

  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/about'}>
          About
        </Link>
        &nbsp;&nbsp;
        <Link to={'/'}>
          Back
        </Link>
      </div>
      <div style={{ color: 'green', fontWeight: 'bold', paddingTop: '20px' }}>
        UTU Endorse
      </div>
      <div style={{ paddingTop: '20px' }}>
        To Endorse a next.id DID as having a certain skill you need to first of all find the DID.
        <br /><br />
        To find the DID:
        <ul>
          <li>Select the platform you want to search in from the dropdown</li>
          <li>Type the handle in the box</li>
        </ul>
        Note if the person does not have a next.id DID you will not find them.
      </div>
      <br />
      <hr />
      <div style={{ paddingTop: '20px' }}>
        Select Platform:
        &nbsp;&nbsp;
        <select id="selectPlatform"
          value={platform}
          onChange={(event) => { setPlatform(event.target.value) }}
          className={appStyle.input}
        >
          <option value="">Select...</option>
          <option value="ethereum">Ethereum Wallet Address</option>
          <option value="github">Github Handle</option>
          <option value="twitter">X Handle</option>
        </select>
      </div>
      <div style={{ paddingTop: '20px' }}>
        Handle:
        &nbsp;&nbsp;
        <input
          type="text"
          id="yourTextBox"
          value={handle}
          onChange={(event) => { setHandle(event.target.value) }}
          className={appStyle.input}
          style={{ width: '400px' }}
        />
        &nbsp;&nbsp;
        <button onClick={search}>Search</button>
      </div>
      <br />
      <hr />
      <br />
      {searchResults}
      <br /><br />
      <hr />
    </>
  );
}