import appStyle from '../App.module.css';
import { useState } from "react";
import { useGlobalStateContext } from "../App";
import { useSignMessage } from "wagmi";
import { PostContent } from "../services/next-id/nextIdProofService";
import { nextIdVerifyService } from "../services/next-id/nextIdVerifyService";

export default function GetNextIdProofPayload() {

  const {
    xHandle,
    proofPayloadResponse,
    publicKey,
  } = useGlobalStateContext();

  const [signPayload, setSignPayload] = useState<string>();
  const [tweet, setTweet] = useState<string>();
  const [tweetUrl, setTweetUrl] = useState<string>();

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: signPayload,
  })

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

    setSignPayload(proofPayloadResponse.sign_payload);
    signMessage();
    const signedMessage = data;
    console.log('signedMessage', signedMessage);
    const postContent: PostContent = proofPayloadResponse.post_content;
    const postContentEnUS = postContent.en_US;

    if (signedMessage) {
      createTweet(postContentEnUS, signedMessage);
    }

    if (tweetUrl) {
      const numberAtEndTweetUrl = getNumberAtEndTweetUrl(tweetUrl);
      const uuid = proofPayloadResponse.uuid;

      try {
        nextIdVerifyService.verifyProof(xHandle, publicKey, numberAtEndTweetUrl, uuid);
      }
      catch (error) {
        // @todo: we get an error if verify failed
        throw error;
      }
    }
    else {

    }
  }

  if (!proofPayloadResponse) {

    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Step 3:</span> Post Tweet - PENDING
      </div>
    );
  }
  else {

    return (
      <>
        <div>
          <span style={{ fontWeight: 'bold' }}>Step 2:</span> Submit X Handle - IN PROGRESS
        </div>
        <div>
          Please copy the text in the pink box below into a tweet and send it:
        </div>
        <div style={{ backgroundColor: 'pink' }}>
          ${tweet}
        </div>
        <div>
          Once you have sent the tweet, paste the web url of the newly created tweet into the box
          below and press the Verify Button.
        </div>
        <div>
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
}