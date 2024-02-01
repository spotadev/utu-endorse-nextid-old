import React from 'react'
import { Link } from 'react-router-dom';
import CaptureGithubHandle from './children/CaptureGithubHandle';
import GenerateJsonFileForGist from './children/GenerateJsonFileForGist';

export default function LinkGithub() {

  return (
    <div>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/'}>
          Back
        </Link>
        &nbsp;&nbsp;
        <Link to={'/about'}>
          About
        </Link>
      </div>
      <div style={{ color: 'green', fontWeight: 'bold', paddingTop: '20px' }}>
        Adding Github Handle to next.id DID
      </div>
      <CaptureGithubHandle />
      <br />
      <hr />
      <br />
      <GenerateJsonFileForGist />
      <br />
      <br />
      <hr />
    </div>
  );
}