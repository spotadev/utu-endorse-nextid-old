import { useEffect, useState } from "react";
import { useGlobalStateContext } from "../../App";
import { utuTokenService } from "../../services/utu/utuTokenService";
import { Link } from "react-router-dom";
import ShowNextId from "../shared/show-next-id/ShowNextId";
import UTUTokenBalance from "../shared/utu-token-balance/UTUTokenBalance";
import { UtuAuthData, utuSignalService } from "../../services/utu/utuSignalService";
import { useAccount } from "wagmi";
import { nextIdHelper } from "../../helpers/next.id/nextIdHelper";

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
    const authData: UtuAuthData = await utuSignalService.loginToUtu();
    const accessToken = authData.access_token
    return accessToken;
  }

  const getUttBalance = async () => {
    const _utuTokenBalance = await utuTokenService.getBalance();
    setUtuTokenBalance(_utuTokenBalance);
  }

  const getSignal = async () => {
    if (!connectedAddress) {
      throw new Error('Not connected to wallet');
    }

    let accessToken = utuBearerToken;
    console.log('accessToken', accessToken);

    if (accessToken) {
      const nextId = idsItem?.avatar;

      if (!nextId) {
        throw new Error('idsItem missing');
      }

      const targetAddress: string = nextIdHelper.getEthereumAddress(nextId);

      const signalResponse =
        await utuSignalService.getSignal(accessToken, targetAddress, connectedAddress);

      setSignalResponse(signalResponse);
    }
  }

  const loginAndGetSignal = async () => {
    await loginToUtu();
    await getSignal();
  }

  const getSignalJSX = () => {
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
          <Link to={'/findNextIdToEndorseOrComment'}> -
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
    getSignal();
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
        See UTU Signal Feedback
      </div>
      <div style={{ marginTop: '20px' }}>
        This is the next.id you are seeing signal on:
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
