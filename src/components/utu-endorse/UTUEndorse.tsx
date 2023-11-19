import React, { useEffect, useState } from 'react'
import appStyle from '../../App.module.css';
import { Link } from 'react-router-dom';
import { useGlobalStateContext } from '../../App';
import ShowNextId from '../shared/show-next-id/ShowNextId';
import { useAccount } from 'wagmi';
import UTUTokenBalance from '../shared/utu-token-balance/UTUTokenBalance';
import { utuTokenService } from '../../services/utu/utuTokenService';

export default function UtuEndorse() {

  const [trait, setTrait] = useState<string | null>(null);
  const [utuTokenBalance, setUtuTokenBalance] = useState<number>(0);
  const [amountToEndorse, setAmountToEndorse] = useState<string>('');

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
      <br /><hr /><br />
      <div >
        <input
          disabled={utuTokenBalance === 0}
          style={{ width: '80%' }}
          className={appStyle.input}
          placeholder="Amount to Endorse"
          value={amountToEndorse} onChange={(event) => setAmountToEndorse(event.target.value)} />
      </div>
      <div style={{ paddingTop: '20px' }}>
        <button disabled={utuTokenBalance === 0 || !amountToEndorse}
          onClick={endorse}>Endorse nextId DID</button>
      </div >
    </>
  );
}