import { useEffect, useState } from "react";
import { useGlobalStateContext } from "../../App";
import { utuTokenService } from "../../services/utu/utuTokenService";
import { Link } from "react-router-dom";
import ShowNextId from "../shared/show-next-id/ShowNextId";
import UTUTokenBalance from "../shared/utu-token-balance/UTUTokenBalance";




export default function SignalFeedback(props: any) {

  const [utuTokenBalance, setUtuTokenBalance] = useState<number>(0);

  const {
    idsItem
  } = useGlobalStateContext()

  useEffect(() => {
    const getUttBalance = async () => {
      const _utuTokenBalance = await utuTokenService.getBalance();
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
        See Signal
      </div>
      <div style={{ marginTop: '20px' }}>
        This is the next.id you are seeing signal on:
        <ShowNextId idsItem={idsItem} />
      </div>
      <br /><hr /><br />
      <UTUTokenBalance utuTokenBalance={utuTokenBalance} />
      <br /><hr /><br />
      <div style={{ marginTop: '20px' }}>

      </div>
    </>
  );
}
