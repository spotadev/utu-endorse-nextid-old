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
      <div>
        Note that when you endorse someone you will be doing so with UTU Tokens which you can get
        for free.  The idea with the UTU trust network is that you earn UTU Tokens by linking
        the connections of your social media network with UTU.  UTU is about trusting the opinions
        of those in your network more than the opinions of those not in your network.
        <br /><br />
        Currently UTU supports Telegram.  More social connectors coming soon.  UTU pays bounty to
        the community to develop further connectors.
        <br /><br />
        <UTUTokenBalance />
      </div>
      <ShowNextId idsItem={idsItemToEndorse} />
      <TraitToEndorse setTraitFunction={setTrait} />
      <div>
        <button onClick={endorse}>Endorse / Comment on nextId DID</button>
      </div>
    </>
  );
}