import { useEffect, useState } from "react";
import { useGlobalStateContext } from "../../../App";
import { utuTokenService } from "../../../services/utu/utuTokenService";
import { Link } from "react-router-dom";
import ShowNextId from "../../shared/show-next-id/ShowNextId";
import UTUTokenBalance from "../../shared/utu-token-balance/UTUTokenBalance";
import { IEndorsement, IEndorsements, IEntity, IFeedback, IReview, UtuAuthData, utuSignalService } from "../../../services/utu/utuSignalService";
import { useAccount } from "wagmi";
import { nextIdHelper } from "../../../helpers/next.id/nextIdHelper";
import { access } from "fs";

export default function SignalFeedback(props: any) {
  const { address: connectedAddress, isConnected } = useAccount();
  const [utuTokenBalance, setUtuTokenBalance] = useState<number>(0);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [endorsements, setEndorsements] = useState<IEndorsements[]>([]);

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
    // console.log('getSignal idsItem', idsItem);

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
        const feedback: IFeedback =
          await utuSignalService.getSignal(accessToken, targetAddress, connectedAddress);

        console.log('feedback', feedback);
        const reviews: IReview[] = feedback.reviews;
        console.log('reviews', reviews);
        const endorsements: IEndorsements[] | undefined = feedback.endorsements;
        console.log('endorsements', endorsements);
        setReviews(reviews);
        setEndorsements(endorsements ? endorsements : []);
      }
      catch (error) {
        console.error('getSignal error:', error);
      }
    }
  }

  const loginAndGetSignal = async () => {
    let accessToken = utuBearerToken;

    if (!accessToken) {
      accessToken = await loginToUtu();
      // console.log('zzzz accessToken', accessToken);
      setUtuBearerToken(accessToken);
    }

    await getSignal(accessToken);
  }

  const getReviewJSX = (review: IReview) => {
    return (
      <div>
        <div>
          <span style={{ display: 'inline-block', width: '150px' }}>
            Content:
          </span>
          <span>{review.content}</span>
        </div>
        <div>
          <span style={{ display: 'inline-block', width: '150px' }}>
            Date:
          </span>
          <span>{new Date(review.date).toString()}</span>
        </div>
        <div>
          <span style={{ display: 'inline-block', width: '150px' }}>
            Summary:
          </span>
          <span>{review.summary}</span>
        </div>
      </div >
    );
  }

  const getReviewsJSX = () => {
    if (reviews.length > 0) {
      return (
        <div>
          <h3>Reviews</h3>
          {
            reviews.map(
              (review) => {
                return getReviewJSX(review);
              }
            )
          }
        </div>
      );
    }
    else {
      return (
        <div>
          No Reviews
        </div>
      );
    }
  }

  const getEntityPropertiesJSX = (properties: Record<string, unknown>) => {
    return (
      Object.keys(properties).map((key) => {
        let value = String(properties[key]);
        return (
          <div key={key}>
            Property {key}: {value}
          </div>
        );
      })
    );
  }

  const getEntityJSX = (entity: IEntity) => {
    return (
      <>
        <div>
          <span style={{ display: 'inline-block', width: '150px' }}>
            Entity Name:
          </span>
          <span>{entity.name}</span>
        </div>
        <div>
          <span style={{ display: 'inline-block', width: '150px' }}>
            Entity Uuid:
          </span>
          <span>{entity.uuid}</span>
        </div>
        <div>
          <span style={{ display: 'inline-block', width: '150px' }}>
            Entity Image:
          </span>
          <span>{entity.image}</span>
        </div>
        <div>
          <span style={{ display: 'inline-block', width: '150px' }}>
            Entity Type:
          </span>
          <span>{entity.type}</span>
        </div>
        {
          getEntityPropertiesJSX(entity.properties)
        }
      </>
    );
  }

  const getEndorsementJSX = (_endorsements: IEndorsements) => {
    const endorsement: IEndorsement = _endorsements.endorsement;
    const entity: IEntity = _endorsements.source;
    return (
      <div>
        {
          getEntityJSX(entity)
        }
        <div>
          <span style={{ display: 'inline-block', width: '150px' }}>
            Endorsement Value:
          </span>
          <span>{endorsement.value}</span>
        </div>
        <div>
          <span style={{ display: 'inline-block', width: '150px' }}>
            Endorsement Block Number:
          </span>
          <span>{endorsement.blockNumber}</span>
        </div>
      </div>
    );
  }

  const getEndorsementsJSX = () => {
    if (endorsements && endorsements?.length > 0) {
      return (
        <div>
          <h3>Endorsements</h3>
          {
            endorsements.map(
              (_endorsements) => {
                return getEndorsementJSX(_endorsements);
              }
            )
          }
        </div>
      );
    }
    return (
      <div>
        No Endorsements
      </div>
    );
  }

  const getSignalJSX = () => {
    //console.log('yyyy idsItem', idsItem);
    if (!utuBearerToken) {
      return '';
    }

    return (
      <div style={{ marginTop: '20px', color: 'maroon' }}>
        {getReviewsJSX()}
        {getEndorsementsJSX()}
      </div>
    );
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
