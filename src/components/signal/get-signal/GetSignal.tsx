import { useEffect, useState } from "react";
import { useGlobalStateContext } from "../../../App";
import { utuTokenService } from "../../../services/utu/utuTokenService";
import { Link } from "react-router-dom";
import ShowNextId from "../../shared/show-next-id/ShowNextId";
import UTUTokenBalance from "../../shared/utu-token-balance/UTUTokenBalance";
import { UtuAuthData, utuSignalService } from "../../../services/utu/utuSignalService";
import { useAccount } from "wagmi";
import { nextIdHelper } from "../../../helpers/next.id/nextIdHelper";
import { access } from "fs";

export default function SignalFeedback(props: any) {
  const { address: connectedAddress, isConnected } = useAccount();
  const [utuTokenBalance, setUtuTokenBalance] = useState<number>(0);
  const [signalResponse, setSignalResponse] = useState<any>(null);

  const {
    idsItem,
    utuBearerToken,
    setUtuBearerToken
  } = useGlobalStateContext()

  const loginToUtu = async () => {
    const authData: UtuAuthData = await utuSignalService.loginToUtu()
    console.log('authData', authData);
    const accessToken = authData.data.access_token;
    console.log('accessToken', accessToken);
    return accessToken;
  }

  const getUttBalance = async () => {
    const _utuTokenBalance = await utuTokenService.getBalance();
    setUtuTokenBalance(_utuTokenBalance);
  }

  const getSignal = async (accessToken: string) => {

    console.log('getSignal idsItem', idsItem);

    if (!connectedAddress) {
      throw new Error('Not connected to wallet');
    }

    if (accessToken) {
      const nextId = idsItem?.avatar;

      if (!nextId) {
        throw new Error('idsItem missing');
      }

      const targetAddress: string = nextIdHelper.getEthereumAddress(nextId);

      try {
        const signalResponse =
          await utuSignalService.getSignal(accessToken, targetAddress, connectedAddress);
        setSignalResponse(signalResponse);
      }
      catch (error) {
        console.error('signalResponse error:', error);
      }
    }
  }

  const loginAndGetSignal = async () => {
    const accessToken = await loginToUtu();
    console.log('zzzz accessToken', accessToken);
    setUtuBearerToken(accessToken);
    await getSignal(accessToken);
  }

  const getSignalJSX = () => {

    console.log('yyyy idsItem', idsItem);
    if (!utuBearerToken) {
      return '';
    }

    if (signalResponse) {
      return (
        <div style={{ marginTop: '20px', color: 'maroon' }}>
          Signal Respone: {signalResponse}
        </div>
      );
    }
    else {
      return (
        <div style={{ marginTop: '20px', color: 'maroon' }}>
          No Signal
          <Link to={'/find-next-id-avatar'}> -
            Try Searching for another next DID
          </Link>
        </div>
      );
    }
  }

  const getLoginToUtuJSX = () => {
    if (!utuBearerToken) {
      return (
        <>
          <div>
            In order to get UTU Signal Feedback you need to login to UTU using your Wallet.
          </div>
          <div style={{ marginTop: '20px' }}>
            Click the button to login.  It will ask your wallet to sign some text.
          </div>
          <div style={{ marginTop: '20px' }}>
            <button onClick={loginAndGetSignal}>Login to UTU</button>
          </div>
        </>
      );
    }
    else {
      return '';
    }
  }

  useEffect(() => {
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
        <Link to={'/find-next-id-avatar'}>
          Back
        </Link>
      </div>
      <div style={{ color: 'green', fontWeight: 'bold', paddingTop: '20px' }}>
        See UTU Signal Feedback
      </div>
      <div style={{ marginTop: '20px' }}>
        This is the next.id / avatar you are seeing signal on:
        <ShowNextId idsItem={idsItem} />
      </div>
      <br /><hr /><br />
      <UTUTokenBalance utuTokenBalance={utuTokenBalance} />
      <br /><hr />
      {getLoginToUtuJSX()}
      {getSignalJSX()}
    </>
  );
}
