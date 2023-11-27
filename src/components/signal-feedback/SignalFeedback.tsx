import { useEffect, useState } from "react";
import { useGlobalStateContext } from "../../App";
import { utuTokenService } from "../../services/utu/utuTokenService";
import { Link } from "react-router-dom";
import ShowNextId from "../shared/show-next-id/ShowNextId";
import UTUTokenBalance from "../shared/utu-token-balance/UTUTokenBalance";
import { utuSignalService } from "../../services/utu/utuSignalService";




export default function SignalFeedback(props: any) {

  const [utuTokenBalance, setUtuTokenBalance] = useState<number>(0);

  const {
    idsItem
  } = useGlobalStateContext()

  const getSignalJSX = () => {
    return (
      <div style={{ marginTop: '20px', color: 'maroon' }}>
        No Signal
        <Link to={'/findNextIdToEndorseOrComment'}> -
          Try Searching for another next DID
        </Link>
      </div>
    );
  }

  const getUttBalance = async () => {
    const _utuTokenBalance = await utuTokenService.getBalance();
    setUtuTokenBalance(_utuTokenBalance);
  }

  const getSignal = async () => {
    const utuBearerToken = '';
    const targetAddress = '';
    const connectedAddress = '';
    // const response = await utuSignalService.getSignal(utuBearerToken, targetAddress, connectedAddress);
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
        See Signal Feedback
      </div>
      <div style={{ marginTop: '20px' }}>
        This is the next.id you are seeing signal on:
        <ShowNextId idsItem={idsItem} />
      </div>
      <br /><hr /><br />
      <UTUTokenBalance utuTokenBalance={utuTokenBalance} />
      <br /><hr />
      {getSignalJSX()}
    </>
  );
}
