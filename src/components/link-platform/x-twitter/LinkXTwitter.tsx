import React from 'react'
import CaptureXHandle from './children/CaptureXHandle';
import { Link } from "react-router-dom";
import PostTweetInstructions from './children/PostTweetInstructions';

export default function LinkXTwitter() {

  return (
    <div>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/'}>
          Home
        </Link>
        &nbsp;&nbsp;
        <Link to={'/about'}>
          About
        </Link>
      </div>
      <div style={{ color: 'green', fontWeight: 'bold' }}>
        Adding Twitter Handle to next.id DID
      </div>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/'}>
          Back
        </Link>
      </div>
      <CaptureXHandle />
      <br />
      <hr />
      <br />
      <PostTweetInstructions />
      <br />
      <br />
      <hr />
    </div>
  );
}