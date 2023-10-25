import appStyle from '../App.module.css';

import { useState } from "react";
import { useAccount } from "wagmi";

export default function GetNextIdProofPayload() {

  const { isConnected } = useAccount();
  const [linkedInHandle, setLinkedInHandle] = useState<string>();
  const [submitted, setSubmitted] = useState<boolean>(false);

  const next = () => {

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
          <span style={{ fontWeight: 'bold' }}>Step 2:</span> Submit Linked In Handle - PENDING
          &nbsp;&nbsp;
          <input
            className={appStyle.input}
            placeholder="Linked In Handle (mandatory)"
            value={linkedInHandle} onChange={(event) => setLinkedInHandle(event.target.value)} />
          &nbsp;&nbsp;
          <button className={appStyle.button} onClick={next}>Next</button>
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