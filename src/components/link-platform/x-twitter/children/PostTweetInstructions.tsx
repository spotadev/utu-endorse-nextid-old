import React from 'react';
import appStyle from '../../../../App.module.css';
import { useEffect, useState } from "react";
import { useGlobalStateContext } from "../../../../App";
import ProofPayloadResponse, { PostContent } from "../../../../services/next-id/nextIdProofService";
import { nextIdVerifyService } from "../../../../services/next-id/nextIdVerifyService";
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { signMessage } from '@wagmi/core';

export default function PostTweetInstructions() {

  const {
    xHandle,
    xProofPayloadResponse,
    publicKey,
    xProofVerified,
    setXProofVerified
  } = useGlobalStateContext();

  const navigate = useNavigate();
  const [tweet, setTweet] = useState<string | null>();
  const [tweetUrl, setTweetUrl] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const getNumberAtEndTweetUrl = (tweetUrl: string) => {
    const pathParts = tweetUrl.split("/");
    const number = pathParts[pathParts.length - 1];
    return number;
  }

  const createTweet = (signedMessage: string | undefined, proofPayloadResponse: ProofPayloadResponse) => {
    if (signedMessage) {
      const postContent: PostContent = proofPayloadResponse.post_content;
      const postContentEnUS = postContent.en_US;
      const lastLine = 'Next.ID YOUR DIGITAL IDENTITIES IN ONE PLACE';
      const tweet = postContentEnUS + signedMessage + lastLine;
      return tweet;
    }
    else {
      return null;
    }
  }

  const verify = async () => {
    if (!xProofPayloadResponse || !xHandle || !publicKey) {
      const errrorMessage =
        'Expecting all of thse to be populated: ' +
        `proofPayloadResponse: ${xProofPayloadResponse}, ` +
        `xHandle: ${xHandle}, publicKey: ${publicKey}`;

      throw new Error(errrorMessage);
    }

    if (tweetUrl) {
      const numberAtEndTweetUrl = getNumberAtEndTweetUrl(tweetUrl);
      const uuid = xProofPayloadResponse.uuid;

      try {
        nextIdVerifyService.verifyProof(xHandle, publicKey, numberAtEndTweetUrl, uuid);
        setXProofVerified(true);
        navigate('/');
      }
      catch (error) {
        setErrorMessage(
          'Tweet did not pass validation. The twitter handle was not added to your next.id DID');
      }
    }
  }

  useEffect(() => {
    (async () => {
      if (xProofPayloadResponse) {
        const signedData = await signMessage({ message: xProofPayloadResponse.sign_payload });
        const _tweet = createTweet(signedData, xProofPayloadResponse);
        setTweet(_tweet);
      }
    })();
  }, [xProofPayloadResponse]);

  if (xProofPayloadResponse && !xProofVerified) {
    return (
      <>
        <div>
          <span style={{ fontWeight: 'bold' }}>Step 2: </span>
          Send Tweet and Paste URL - IN PROGRESS
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
            style={{ width: '80%' }}
            className={appStyle.input}
            placeholder="Tweet Url"
            value={tweetUrl} onChange={(event) => setTweetUrl(event.target.value)} />
          &nbsp;&nbsp;
          <button disabled={xHandle?.length == 0} className={appStyle.button}
            onClick={verify}>Verify</button>
        </div>
        {errorMessage ? (<div style={{ color: 'red' }}>${errorMessage}</div>) : null}
      </>
    );
  }
  else if (xProofVerified) {
    return (
      <>
        <span style={{ fontWeight: 'bold' }}>Step 2: </span>
        Send Tweet and Paste URL - Handle added successfullt to next.id DID
      </>
    );
  }
  else {
    return (
      <>
        <span style={{ fontWeight: 'bold' }}>Step 2: </span>
        Send Tweet and Paste URL - PENDING
      </>
    );
  }
}
