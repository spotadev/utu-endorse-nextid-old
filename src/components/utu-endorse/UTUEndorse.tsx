import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import appStyle from '../../App.module.css';
import { IdsItem } from '../../services/next-id/nextIdCheckAvatarService';

export default function UtuEndorse() {

  const [platform, setPlatform] = useState<string>("");
  let [handle, setHandle] = useState<string>("");
  const [idsItems, setIdsItems] = useState<IdsItem[] | null>(null);

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
        UTU Endorse next.id DID
      </div>
      <div style={{ paddingTop: '20px' }}>
      </div>
    </>
  );
}