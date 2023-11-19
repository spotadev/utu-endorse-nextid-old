import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useGlobalStateContext } from '../../App';
import ShowNextId from '../shared/show-next-id/ShowNextId';
import { useAccount } from 'wagmi';
import UTUTokenBalance from '../shared/UTUTokenBalance';
import { utuTokenService } from '../../services/utu/utuTokenService';

export default function UtuEndorse() {

  const [trait, setTrait] = useState<string | null>(null);
  const [utuTokenBalance, setUtuTokenBalance] = useState<number>(0);

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
    const _utuTokenBalance = utuTokenService.getBalance();
    setUtuTokenBalance(_utuTokenBalance);
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
        &nbsp;&nbsp;
        <Link to={'/findNextIdToEndorseOrComment'}>
          Back
        </Link>
      </div>
      <div style={{ marginTop: '20px' }}>
        This is the next.id you are endorsing:
        <ShowNextId idsItem={idsItemToEndorse} />
      </div>
      <br /><hr /><br />
      <UTUTokenBalance utuTokenBalance={utuTokenBalance} />


      {/*
      <TraitToEndorse setTraitFunction={setTrait} />
      */}
      < div >
        <button onClick={endorse}>Endorse nextId DID</button>
      </div >
    </>
  );
}