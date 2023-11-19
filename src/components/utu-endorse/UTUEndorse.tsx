import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useGlobalStateContext } from '../../App';
import ShowNextId from '../shared/show-next-id/ShowNextId';
import TraitToEndorse from './children/TraitToEndorse';
import { useAccount } from 'wagmi';
import UTUTokenBalance from '../shared/UTUTokenBalance';

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

  useEffect(() => {
    // Get UTU token balance
    // setUtuTokenBalance();
    console.log('idsItemToEndorse', idsItemToEndorse);
  }, []);

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
        <Link to={'/findNextIdToEndorseOrComment'}>
          Back
        </Link>
      </div>
      <div style={{ marginTop: '20px' }}>
        The next.id you are endorsing:
        <ShowNextId idsItem={idsItemToEndorse} />
      </div>
      <br /><hr /><br />
      <UTUTokenBalance />


      {/*
      <TraitToEndorse setTraitFunction={setTrait} />
      */}
      < div >
        <button onClick={endorse}>Endorse nextId DID</button>
      </div >
    </>
  );
}