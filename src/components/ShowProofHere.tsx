import { useEffect, useState } from "react";
import AvatarStatusResponse, { Proof, nextIdCheckAvatarService } from "../services/next-id/nextIdCheckAvatarService";
import { useGlobalStateContext } from "../App";
import { avatarStatusResponseHelper } from "../helpers/avatar-status-response/avatarStatusResponseHelper";

export default function ShowProofHere() {
  const {
    xHandle, setXHandle,
    avatarStatusResponse, setAvatarStatusResponse
  } = useGlobalStateContext();

  const [proofs, setProofs] = useState<Proof[] | null>(null);

  useEffect(() => {
    const getAvatarStatusResponse = async (xHandle: string) => {
      const avatarStatusResponse: AvatarStatusResponse =
        await nextIdCheckAvatarService.getAvatarStatus(xHandle);

      console.log('avatarStatusResponse', avatarStatusResponse);
      setAvatarStatusResponse(avatarStatusResponse);
      return avatarStatusResponse;
    };

    if (xHandle) {
      (async () => {
        let avatarStatusResponse = await getAvatarStatusResponse(xHandle);

        let platform = 'twitter';

        let proofs: Proof[] =
          avatarStatusResponseHelper.getProofs(avatarStatusResponse, platform, xHandle);

        setProofs(proofs);
      })();
    }
  }, [xHandle]);


  if (proofs && proofs.length > 0) {
    console.log('rendering');

    return (
      <>
        <div>
          <span style={{ fontWeight: 'bold' }}>Step 4:</span> Show Proof here - Done
        </div>
        <div>
          Proof of your Universal Decentralised ID:
        </div>
        <div style={{ backgroundColor: 'pink', wordWrap: 'break-word' }}>
          {proofs.map((proof, index) => (
            <div>
              <span style={{ width: '33%' }}>
                ${proof.platform} :
              </span>
              <span style={{ width: '33%' }}>
                ${proof.identity}
              </span>
              <span style={{ width: '34%' }}>
                - created: ${proof.created_at}
              </span>
            </div>
          ))}
        </div>
      </>
    );
  }
  else {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Step 4:</span> Show Proof here - PENDING
      </div>
    );
  }
}