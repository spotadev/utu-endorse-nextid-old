import React from 'react'
import CheckForNextID from "./children/CheckForNextID";
import Web3ModalButtons from "./children/Web3ModalButtons";
import { Link } from 'react-router-dom';

export default function Home() {

  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/about'}>
          UTU Trust - Endorse Others
        </Link>
        &nbsp; &nbsp;
        <Link to={'/about'}>
          About
        </Link>
      </div>
      <div style={{ paddingTop: '20px' }}>
        <Web3ModalButtons />
      </div>
      <br />
      <hr />
      <br />
      <CheckForNextID />
      <br /><br />
      <hr />
    </>
  );
}