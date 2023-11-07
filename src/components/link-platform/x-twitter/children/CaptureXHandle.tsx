import { useGlobalStateContext } from '../../../../App';
import ProofPayloadResponse, { nextIdProofService } from '../../../../services/next-id/nextIdProofService';
import appStyle from '../../../../App.module.css';
import { useSignMessage } from 'wagmi';

export default function LinkXTwitter() {

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();

  const {
    xHandle, setXHandle,
    proofPayloadResponse, setProofPayloadResponse,
    avatarStatusResponse, setAvatarStatusResponse,
    setPublicKey,
    xProofVerified,
    setXProofVerified
  } = useGlobalStateContext();

  const next = async () => {
    if (xHandle) {



      const proofPayloadResponse: ProofPayloadResponse =
        await nextIdProofService.getNextIdProofPayload(xHandle, setPublicKey, signMessage, data);

      console.log('proofPayloadResponse', proofPayloadResponse);
      setProofPayloadResponse(proofPayloadResponse);
      // setSignPayload(proofPayloadResponse.sign_payload);

    }
  }

  if (!proofPayloadResponse) {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Step 1:</span> Submit X Handle - PENDING
        &nbsp;&nbsp;
        <input
          className={appStyle.input}
          placeholder="X / Twitter Handle (mandatory)"
          value={xHandle ? xHandle : ''} onChange={(event) => setXHandle(event.target.value)} />
        &nbsp;&nbsp;
        <button disabled={xHandle?.length == 0} className={appStyle.button} onClick={next}>Next</button>
      </div>
    );
  }
  else {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Step 1:</span> Submit X Handle - DONE
      </div>
    );
  }
}