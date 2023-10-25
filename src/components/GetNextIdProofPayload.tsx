import appStyle from '../App.module.css';

import { useState } from "react";
import { useAccount } from "wagmi";
import ProofPayloadResponse, { nextIdProofService } from '../services/next-id-proof/nextIdProofService';


export default function GetNextIdProofPayload() {

  const { isConnected } = useAccount();
  const [xHandle, setXHandle] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const next = async () => {
    if (xHandle) {
      const proofPayloadResponse: ProofPayloadResponse =
        await nextIdProofService.getNextIdProofPayload(xHandle);

      const signPayload = proofPayloadResponse.sign_payload;
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