import { useEffect, useState } from "react";
import AvatarStatusResponse, { nextIdCheckAvatarService } from "../services/next-id/nextIdCheckAvatarService";
import { useGlobalStateContext } from "../App";

export default function ShowProofHere() {
  const {
    xHandle, setXHandle,
    avatarStatusResponse, setAvatarStatusResponse
  } = useGlobalStateContext();

  useEffect(() => {
    const getAvatarStatusResponse = async (xHandle: string) => {
      const avatarStatusResponse = await nextIdCheckAvatarService.getAvatarStatus(xHandle);
      console.log('avatarStatusResponse', avatarStatusResponse);
      setAvatarStatusResponse(avatarStatusResponse);
    };

    if (xHandle) {
      (async () => {
        await getAvatarStatusResponse(xHandle);
      })();
    }
  }, []);

  if (avatarStatusResponse) {
    const avatarStatusResponseString = JSON.stringify(avatarStatusResponse);

    return (
      <>
        <div>
          <span style={{ fontWeight: 'bold' }}>Step 4:</span> Show Proof here - Done
        </div>
        <div>
          Proof of your Universal Decentralised ID:
        </div>
        <div style={{ backgroundColor: 'pink' }}>
          ${avatarStatusResponseString}
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