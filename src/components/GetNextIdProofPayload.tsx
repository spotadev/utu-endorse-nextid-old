import appStyle from '../App.module.css';

import { useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import ProofPayloadResponse, { PostContent, nextIdProofService } from '../services/next-id-proof/nextIdProofService';


export default function GetNextIdProofPayload() {

  const { isConnected } = useAccount();
  const [xHandle, setXHandle] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [signPayload, setSignPayload] = useState<string>();
  const [tweet, setTweet] = useState<string>();

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: signPayload,
  })

  const createTweet = (postContentEnUS: string, signedMessage: string) => {
    const lastLine = 'Next.ID YOUR DIGITAL IDENTITIES IN ONE PLACE';
    const _tweet = postContentEnUS + signedMessage + '\n\n' + lastLine;
    setTweet(_tweet);
  }

  const next = async () => {
    if (xHandle) {
      const proofPayloadResponse: ProofPayloadResponse =
        await nextIdProofService.getNextIdProofPayload(xHandle);

      setSignPayload(proofPayloadResponse.sign_payload);
      signMessage();
      const signedMessage = data;
      console.log('signedMessage', signedMessage);
      const postContent: PostContent = proofPayloadResponse.post_content;
      const postContentEnUS = postContent.en_US;


      if (signedMessage) {
        const tweet = createTweet(postContentEnUS, signedMessage);
      }
    }
  }

  if (!isConnected) {
    return (
      <div>
        Step 2: Submit Linked In Handle - PENDING
      </div>
    );
  }
  else if (isConnected && !submitted) {
    return (
      <>
        <div>
          <span style={{ fontWeight: 'bold' }}>Step 2:</span> Submit X Handle - PENDING
          &nbsp;&nbsp;
          <input
            className={appStyle.input}
            placeholder="Linked In Handle (mandatory)"
            value={xHandle} onChange={(event) => setXHandle(event.target.value)} />
          &nbsp;&nbsp;
          <button disabled={xHandle.length == 0} className={appStyle.button} onClick={next}>Next</button>
        </div>
      </>
    );
  }
  else {
    return (
      <div>
        Step 2: Submitted Linked In Handle - DONE
      </div>
    );
  }
}