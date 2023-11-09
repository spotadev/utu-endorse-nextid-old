import React from 'react'
import CheckForNextID from "./children/CheckForNextID";
import Web3ModalButtons from "./children/Web3ModalButtons";
import { Link } from 'react-router-dom';

export default function Home() {

  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/about'}>
          About
        </Link>
      </div>
      <Web3ModalButtons />
      <br />
      <hr />
      <br />
      <CheckForNextID />
      <br /><br />
      <hr />
    </>
  );
}