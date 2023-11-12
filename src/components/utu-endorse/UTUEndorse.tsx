import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useGlobalStateContext } from '../../App';
import ShowNextId from './children/ShowNextId';
import TraitToEndorse from './children/TraitToEndorse';
import { useAccount } from 'wagmi';

export default function UtuEndorse() {

  const [trait, setTrait] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  const {
    idsItemToEndorse
  } = useGlobalStateContext();

  const getEthereumHash = (nextId: string): string | null => {

    return null;
  }

  const endorse = () => {
    const nextId = idsItemToEndorse?.avatar;

    if (nextId) {
      const targetType = 'nextid_trait';
      const transactionId = `{ nextId: ${nextId}, trait: ${trait}}`;
      const targetUuid = getEthereumHash(nextId);
      const sourceUuid = address;
      const targetHumanReadable = JSON.parse(transactionId);
    }
  }

  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/about'}>
          About
        </Link>
        &nbsp;&nbsp;
        <Link to={'/'}>
          Home
        </Link>
        <Link to={'/findNextIdToEndorse'}>
          Back
        </Link>
      </div>
      <ShowNextId />
      <TraitToEndorse setTraitFunction={setTrait} />
      <div>
        <button onClick={endorse}></button>
      </div>
    </>
  );
}