import React, { useEffect, useState } from 'react'
import appStyle from '../../App.module.css'
import { Link } from 'react-router-dom';
import ShowNextId from '../shared/show-next-id/ShowNextId';
import { useGlobalStateContext } from '../../App';
import UTUTokenBalance from '../shared/utu-token-balance/UTUTokenBalance';
import { utuTokenService } from '../../services/utu/utuTokenService';
import { utuSignalService } from '../../services/utu/utuSignalService';
import { nextIdHelper } from '../../helpers/next.id/nextIdHelper';
import { useAccount } from 'wagmi';
import { access } from 'fs';

export default function UtuComment() {

  const { address, isConnected } = useAccount();

  const [comment, setComment] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [utuTokenBalance, setUtuTokenBalance] = useState<number>(0);
  const [signalResponse, setSignalResponse] = useState<any | null>(null);
  const [saveCommentClicked, setSaveCommentClicked] = useState<boolean>(false);

  const {
    idsItemToComment
  } = useGlobalStateContext()

  const loginToUtu = () => {
    return '';
  }

  const initEntity = async (
    targetAddress: string,
    targetType: string,
    accessToken: string
  ) => {

    const initEntityResponse =
      await utuSignalService.initEntity(targetAddress, targetType, accessToken);

    console.log('initEntityResponse', initEntityResponse);
  }

  const giveSignal = async (
    accessToken: string,
    targetAddress: string,
    connectedAddress: string,
    transactionId: string,
    stars: number
  ) => {
    const signalResponse = await utuSignalService.giveSignal(
      accessToken, targetAddress, connectedAddress, transactionId, comment, stars);

    console.log('getSignal Response', signalResponse);
    setSignalResponse(signalResponse);
  }

  const saveComment = async () => {
    setSaveCommentClicked(true);
    const nextId = idsItemToComment?.avatar;

    if (!nextId) {
      throw new Error('idsItemToEndorse missing');
    }

    if (!address) {
      throw new Error('Not connected to wallet');
    }

    // First Network Call
    const accessToken = await loginToUtu();

    const targetAddress: string = nextIdHelper.getEthereumAddress(nextId);
    const targetType: string = 'next-did';
    const transactionId = `{ nextId: ${nextId} }`;

    // Second Network Call
    await initEntity(targetAddress, targetType, accessToken);

    const connectedAddress = address;
    const stars = parseInt(rating, 10);

    // Third Network Call
    await giveSignal(accessToken, targetAddress, connectedAddress, transactionId, stars);
  }

  const getSignalResponseJSX = () => {

    if (signalResponse) {

      return (
        <div style={{ paddingTop: '20px' }}>
          <div>
            Giving Signal Successful
          </div>
          <div style={{ paddingTop: '20px' }}>
            Response Details:
          </div>
          <div style={{ paddingTop: '20px' }}>
            {signalResponse}
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

  useEffect(() => {
    const getUttBalance = async () => {
      const _utuTokenBalance = await utuTokenService.getBalance();
      console.log('_utuTokenBalance', _utuTokenBalance);
      setUtuTokenBalance(_utuTokenBalance);
    }

    getUttBalance();
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
      <div style={{ color: 'green', fontWeight: 'bold', paddingTop: '20px' }}>
        Comment on and rate User
      </div>
      <div style={{ marginTop: '20px' }}>
        This is the next.id you are commenting on:
        <ShowNextId idsItem={idsItemToComment} />
      </div>
      <br /><hr /><br />
      <UTUTokenBalance utuTokenBalance={utuTokenBalance} />
      <br /><hr /><br />
      <div>
        Add your comment for the above DID.  Note that only people in your networks will be able
        to see your comment.
      </div>
      <div style={{ paddingTop: '20px' }}>
        <textarea
          id="comment"
          name="comment"
          value={comment}
          onChange={(event) => { setComment(event.target.value) }}
          rows={4}
          cols={50}
        />
      </div>
      <div style={{ paddingTop: '20px' }}>
        <span>Select Rating:</span>
        &nbsp;&nbsp;
        <select id="rating"
          value={rating}
          onChange={(event) => { setRating(event.target.value) }}
          className={appStyle.input}
        >
          <option value="">Select...</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div style={{ paddingTop: '20px' }}>(1 = Rated, 5 = Extremely Rated)</div>
      <br /><hr /><br />
      <div style={{ paddingTop: '20px' }}>
        <button disabled={comment.length === 0 || rating !== '' || saveCommentClicked}
          onClick={saveComment}>Save Comment</button>
      </div >
      {getSignalResponseJSX()}
    </>
  );
}