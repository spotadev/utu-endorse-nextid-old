import React, { useEffect, useState } from 'react'
import appStyle from '../../App.module.css';
import { Link } from 'react-router-dom';
import { useGlobalStateContext } from '../../App';
import ShowNextId from '../shared/show-next-id/ShowNextId';
import UTUTokenBalance from '../shared/utu-token-balance/UTUTokenBalance';
import { utuTokenService } from '../../services/utu/utuTokenService';
import { nextIdHelper } from '../../helpers/next.id/nextIdHelper';

export default function UtuEndorse() {

  const [transaction, setTransaction] = useState<any | null>(null);
  const [utuTokenBalance, setUtuTokenBalance] = useState<number>(0);
  const [amountToEndorse, setAmountToEndorse] = useState<string>('');
  const [endorseClicked, setEndorseClicked] = useState<boolean>(false);

  const {
    idsItemToEndorse
  } = useGlobalStateContext();

  const endorse = async () => {
    setEndorseClicked(true);
    const nextId = idsItemToEndorse?.avatar;

    if (!nextId) {
      throw new Error('idsItemToEndorse missing');
    }
    const targetAddress = nextIdHelper.getEthereumAddress(nextId);
    const transactionId = `{ nextId: ${nextId} }`;

    const transaction =
      await utuTokenService.endorse(targetAddress, Number(amountToEndorse), transactionId);

    setTransaction(transaction);
  }

  useEffect(() => {
    const getUttBalance = async () => {
      const _utuTokenBalance = await utuTokenService.getBalance();
      console.log('_utuTokenBalance', _utuTokenBalance);
      setUtuTokenBalance(_utuTokenBalance);
    }

    getUttBalance();
  }, []);

  const getTransactionJSX = () => {
    if (transaction) {
      return (
        <div style={{ paddingTop: '20px' }}>
          <div>
            Endorse Successful
          </div>
          <div style={{ paddingTop: '20px' }}>
            Transaction Details:
          </div>
          <div style={{ paddingTop: '20px' }}>
            {transaction}
          </div>
          <div style={{ paddingTop: '20px' }}>
            <Link to={'/findNextIdToEndorseOrComment'}>
              Back
            </Link>
          </div>
        </div>
      );
    }
    else {
      return '';
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
        &nbsp;&nbsp;
        <Link to={'/findNextIdToEndorseOrComment'}>
          Back
        </Link>
      </div>
      <div style={{ color: 'green', fontWeight: 'bold', paddingTop: '20px' }}>
        Endorse User
      </div>
      <div style={{ marginTop: '20px' }}>
        This is the next.id you are endorsing:
        <ShowNextId idsItem={idsItemToEndorse} />
      </div>
      <br /><hr /><br />
      <UTUTokenBalance utuTokenBalance={utuTokenBalance} />
      <br /><hr /><br />
      <div>
        <span>Add amount of UTT you want to Endorse: </span>
        <input
          disabled={utuTokenBalance === 0}
          style={{ width: '40%' }}
          className={appStyle.input}
          placeholder="Amount to Endorse"
          value={amountToEndorse} onChange={(event) => setAmountToEndorse(event.target.value)} />
      </div>
      <div style={{ paddingTop: '20px' }}>
        <button disabled={utuTokenBalance === 0 || !amountToEndorse || endorseClicked}
          onClick={endorse}>Endorse nextId DID</button>
      </div>
      {getTransactionJSX()}
    </>
  );
}