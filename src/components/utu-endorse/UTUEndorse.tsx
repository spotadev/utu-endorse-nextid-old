import React from 'react'
import { Link } from 'react-router-dom';

export default function UtuEndorse() {

  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/'}>
          Back
        </Link>
      </div>
      <div style={{ color: 'green', fontWeight: 'bold', paddingTop: '20px' }}>
        UTU Endorse
      </div>
      <div style={{ paddingTop: '20px' }}>

      </div>
    </>
  );
}