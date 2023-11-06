import appStyle from '../../../../App.module.css';
import { useEffect, useState } from "react";
import { useGlobalStateContext } from "../../../../App";
import { useSignMessage } from "wagmi";
import { PostContent } from "../../../../services/next-id/nextIdProofService";
import { nextIdVerifyService } from "../../../../services/next-id/nextIdVerifyService";

export default function GetNextIdProofPayload() {

  const {
    xHandle,
    proofPayloadResponse,
    publicKey,
    avatarStatusResponse,
    xProofVerified,
    setXProofVerified
  } = useGlobalStateContext();

  const [tweet, setTweet] = useState<string>();
  const [tweetUrl, setTweetUrl] = useState<string>();

  // const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
  //    message: signPayload,
  // })

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();

  const getNumberAtEndTweetUrl = (tweetUrl: string) => {
    const pathParts = tweetUrl.split("/");
    const number = pathParts[pathParts.length - 1];
    return number;
  }

  const createTweet = (postContentEnUS: string, signedMessage: string) => {
    const lastLine = 'Next.ID YOUR DIGITAL IDENTITIES IN ONE PLACE';
    const _tweet = postContentEnUS + signedMessage + '\n\n' + lastLine;
    setTweet(_tweet);
  }

  const verify = async () => {
    if (!proofPayloadResponse || !xHandle || !publicKey) {
      const errrorMessage =
        'Expecting all of thse to be populated: ' +
        `proofPayloadResponse: ${proofPayloadResponse}, ` +
        `xHandle: ${xHandle}, publicKey: ${publicKey}`;

      throw new Error(errrorMessage);
    }

    if (tweetUrl) {
      const numberAtEndTweetUrl = getNumberAtEndTweetUrl(tweetUrl);
      const uuid = proofPayloadResponse.uuid;

      try {
        nextIdVerifyService.verifyProof(xHandle, publicKey, numberAtEndTweetUrl, uuid);
        setXProofVerified(true);
      }
      catch (error) {
        // @todo: we get an error if verify failed
        throw error;
      }
    }
  }

  useEffect(() => {
    console.log('proofPayloadResponse', proofPayloadResponse);
    console.log('proofPayloadResponse.sign_payload', proofPayloadResponse?.sign_payload);

    if (proofPayloadResponse) {
      console.log('Set signPayload', proofPayloadResponse.sign_payload);

      signMessage({ message: proofPayloadResponse.sign_payload });

      const postContent: PostContent = proofPayloadResponse.post_content;
      const postContentEnUS = postContent.en_US;
      console.log('data', data);

      if (data) {
        createTweet(postContentEnUS, data);
      }
    }
  }, [proofPayloadResponse]);

  if (proofPayloadResponse && !xProofVerified) {
    return (
      <>
        <div>
          <span style={{ fontWeight: 'bold' }}>Step 2: </span>
          Submit X Handle - IN PROGRESS
        </div>
        <div style={{ paddingTop: '20px' }}>
          Please copy the text in the pink box below into a tweet and send it:
        </div>
        <div style={{ marginTop: '20px', backgroundColor: 'pink', height: '80px', wordWrap: 'break-word' }}>
          {tweet}
        </div >
        <div style={{ paddingTop: '20px' }}>
          Once you have sent the tweet, paste the web url of the newly created tweet into the box
          below and press the Verify Button.
        </div>
        <div style={{ paddingTop: '20px' }}>
          <input
            className={appStyle.input}
            placeholder="Tweet Url"
            value={tweetUrl} onChange={(event) => setTweetUrl(event.target.value)} />
          &nbsp;&nbsp;
          <button disabled={xHandle?.length == 0} className={appStyle.button}
            onClick={verify}>Next</button>
        </div>
      </>
    );
  }
  else if (xProofVerified) {
    return (
      <>
        <span style={{ fontWeight: 'bold' }}>Step 2: </span>
        Submit X Handle - Handle added successfullt to next.id DID
      </>
    );
  }
}