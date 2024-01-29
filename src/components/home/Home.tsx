import React from 'react'
import CheckForNextID from "./children/CheckForNextID";
import Web3ModalButtons from "./children/Web3ModalButtons";
import { Link } from 'react-router-dom';

export default function Home() {

  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/find-next-id-avatar'}>
          "UTU Endorse / Give UTU Signal / Get UTU Signal"
        </Link>
        &nbsp; &nbsp;&nbsp; &nbsp;
        <Link to={'/about'}>
          About
        </Link>
      </div>
      <div style={{ color: 'green', fontWeight: 'bold', paddingTop: '20px' }}>
        Next.id avatar DID Management
      </div>
      <div style={{ paddingTop: '30px' }}>
        <Web3ModalButtons />
      </div>
      <br /><hr />
      <CheckForNextID />
      <br /><br /><hr />
    </>
  );
}