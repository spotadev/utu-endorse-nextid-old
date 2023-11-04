import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { IdsItem, Proof, nextIdCheckAvatarService } from "../../../services/next-id/nextIdCheckAvatarService";
import { useGlobalStateContext } from "../../../App";
import { avatarStatusResponseHelper } from "../../../helpers/avatar-status-response/avatarStatusResponseHelper";
import GuiProof from "./GuiProof";

interface Platform {
  name: string;
  url: string;
}

export default function CheckForNextID() {

  const {
    setAvatarStatusResponse,
  } = useGlobalStateContext();

  const { address, isConnected } = useAccount();

  const [proofs, setProofs] = useState<Proof[]>([]);
  const [idItem, setIdItem] = useState<IdsItem | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  useEffect(() => {
    const platform = 'ethereum';

    const getAvatarStatusResponse = async (handle: string, platform: string) => {

      // this is a temporary overide for testing
      handle = '0x0bd793ea8334a77b2bfd604dbaedca11ea094306';

      const avatarStatusResponse =
        await nextIdCheckAvatarService.getAvatarStatus(handle, platform);

      console.log('avatarStatusResponse', avatarStatusResponse);

      setAvatarStatusResponse(avatarStatusResponse);

      let response: { idItem: IdsItem | null, proofs: Proof[] } =
        avatarStatusResponseHelper.getProofs(avatarStatusResponse, platform, handle);

      console.log('proofs', response.proofs);
      setProofs(response.proofs);
      setIdItem(response.idItem);
    }

    if (address) {
      getAvatarStatusResponse(address, platform);
    }

  }, [address]);

  if (isConnected) {
    if (proofs.length > 0) {
      return (
        <>
          <div>
            <span style={{ fontWeight: 'bold' }}>Your next.id DID:</span>
          </div>
          <div style={{ paddingTop: '20px', wordWrap: 'break-word' }}>
            {idItem?.avatar}
          </div>
          <div style={{ paddingTop: '20px' }}>
            <span style={{ fontWeight: 'bold' }}>Below are your current connected handles:</span>
          </div>
          {proofs.map((proof, index) => (
            <div key={proof.identity} style={{ paddingTop: '20px' }}>
              <GuiProof proof={proof} />

            </div>
          ))}
          <br />
          <hr />
          <br />
          <div>
            <span style={{ fontWeight: 'bold' }}>Below are the platforms you have not yet connected:</span>
          </div>

        </>
      );
    }
    else {
      return (
        <>
          You do not yet have a next.ID associated with your wallet address.
        </>
      );
    }
  }
  else {
    return 'You need to connect your wallet before you can see your next.ID';
  }
}
