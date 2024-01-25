import React from 'react';
import appStyle from '../../../../App.module.css';
import { useEffect, useState } from "react";
import { useGlobalStateContext } from "../../../../App";
import ProofPayloadResponse, { PostContent } from "../../../../services/next-id/nextIdProofService";
import { nextIdVerifyService } from "../../../../services/next-id/nextIdVerifyService";
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { signMessage } from '@wagmi/core';

export default function PostTweetInstructions() {

  // @todo remove when working
  const testShowJSX = false;

  const {
    xHandle,
    xProofPayloadResponse,
    publicKey,
    xProofVerified,
    setXProofVerified
  } = useGlobalStateContext();

  const navigate = useNavigate();
  const [tweetUrl, setTweetUrl] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string | null>();

  const [firstLineTweet, setFirstLineTweet] = useState<string | null>(null);
  const [signedMessageBase64Tweet, setSignedMessageBase64Tweet] = useState<string | null>(null);
  const [lastLineTweet, setLastLineTweet] = useState<string | null>(null);

  // https://x.com/JohnDic94329223/status/1731172325096087575?s=20
  const getNumberAtEndTweetUrl = (tweetUrl: string) => {
    const pathParts = tweetUrl.split("/");
    let number = pathParts[pathParts.length - 1];
    const indexOfQuestionMark = number?.indexOf('?');

    if (indexOfQuestionMark != -1) {
      number = number.substring(0, indexOfQuestionMark);
    }

    console.log('number', number);
    return number;
  }

  const isBase64 = (str: string) => {
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  }

  const createTweet = (
    signedMessage: string | undefined, proofPayloadResponse: ProofPayloadResponse
  ): { firstLine: string, signedMessageBase64: string, lastLine: string } | null => {
    if (signedMessage) {
      console.log('signedMessage', signedMessage);

      const isBase64Boolean = isBase64(signedMessage);
      console.log('isBase64Boolean', isBase64Boolean);

      // const hexStringWithoutPrefix =
      //   signedMessage.startsWith('0x') ? signedMessage.slice(2) : signedMessage;

      // const buffer = Buffer.from(hexStringWithoutPrefix, 'hex');
      // const signedMessageBase64 = buffer.toString('base64');
      // const signedMessageBase64 = Buffer.from(signedMessage, 'hex').toString('base64');
      const signedMessageBase64 = signedMessage;
      console.log('signedMessageBase64[', signedMessageBase64);
      const firstLine = `🎭 Verifying my Twitter ID @${xHandle} for @NextDotID.`;
      const lastLine = 'Next.ID YOUR DIGITAL IDENTITIES IN ONE PLACE';
      return { firstLine, signedMessageBase64, lastLine };
    }
    else {
      return null;
    }
  }

  const verify = async () => {
    if (tweetUrl) {
      const numberAtEndTweetUrl = getNumberAtEndTweetUrl(tweetUrl);

      if (!xProofPayloadResponse || !xHandle || !publicKey) {
        const errrorMessage =
          'Expecting all of these to be populated: ' +
          `proofPayloadResponse: ${xProofPayloadResponse}, ` +
          `xHandle: ${xHandle}, publicKey: ${publicKey}`;

        throw new Error(errrorMessage);
      }

      const uuid = xProofPayloadResponse?.uuid;
      const createdAt = xProofPayloadResponse.created_at;

      try {
        nextIdVerifyService.verifyTwitterProof(xHandle, publicKey, numberAtEndTweetUrl, uuid, createdAt);
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
        // const signedData = await signMessage({ message: xProofPayloadResponse.sign_payload });

        const _window: any = window;
        const provider = _window.ethereum;

        var selectedAddress = provider.selectedAddress;
        console.log('selectedAddress', selectedAddress);

        const signedData = await provider
          .request({
            method: 'personal_sign',
            params: [xProofPayloadResponse.sign_payload, selectedAddress],
          })

        console.log('xProofPayloadResponse.sign_payload', xProofPayloadResponse.sign_payload);

        console.log('signedData', signedData);

        const signatureWithoutPrefix = signedData.slice(2);
        const buffer = Buffer.from(signatureWithoutPrefix, 'hex');
        const base64String = buffer.toString('base64');
        console.log('base64String', base64String);

        const result: { firstLine: string, signedMessageBase64: string, lastLine: string } | null =
          createTweet(base64String, xProofPayloadResponse);

        if (result) {
          const { firstLine, signedMessageBase64, lastLine } = result;

          setFirstLineTweet(firstLine);
          setSignedMessageBase64Tweet(signedMessageBase64);
          setLastLineTweet(lastLine);
        }
      }
    })();
  }, [xProofPayloadResponse]);

  const getSendTweetJSX = () => {
    return (
      <>
        <div>
          <span style={{ fontWeight: 'bold' }}>Step 2: </span>
          Send Tweet and Paste URL - IN PROGRESS
        </div>
        <div style={{ paddingTop: '20px' }}>
          Please copy the text in the pink box below into a tweet and send it:
        </div>
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: 'lightgreen', height: '120px', wordWrap: 'break-word' }}>
          {firstLineTweet}
          <br />
          Sig: {signedMessageBase64Tweet}
          <br /><br />
          {lastLineTweet}
        </div >
        <div style={{ paddingTop: '20px' }}>
          Once you have sent the tweet. Click the share tweet, paste the web url of the newly created tweet into the box
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

  if (testShowJSX || xProofPayloadResponse && !xProofVerified) {
    return getSendTweetJSX();
  }
  else if (xProofVerified) {
    return (
      <>
        <span style={{ fontWeight: 'bold' }}>Step 2: </span>
        Send Tweet and Paste URL - Handle added successfully to next.id DID
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
