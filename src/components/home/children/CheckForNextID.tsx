import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import AvatarStatusResponse, { IdsItem, Platform, Proof, nextIdCheckAvatarService } from "../../../services/next-id/nextIdCheckAvatarService";
import { useGlobalStateContext } from "../../../App";
import { avatarStatusResponseHelper } from "../../../helpers/avatar-status-response/avatarStatusResponseHelper";
import GuiProof from "./GuiProof";
import GuiPlatform from "./GuiPlatform";

export default function CheckForNextID() {

  const {
    setAvatarStatusResponse,
    setXProofVerified,
  } = useGlobalStateContext();

  const { address, isConnected } = useAccount();

  const [proofs, setProofs] = useState<Proof[]>([]);
  const [idItem, setIdItem] = useState<IdsItem | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const setPlatformVerifiedStates = (proofs: Proof[]) => {
    for (let proof of proofs) {

      // @todo need to add github
      switch (proof.platform) {
        case 'twitter':
          setXProofVerified(true);
          break;
      }
    }
  }

  useEffect(() => {
    const platform = 'ethereum';

    const getAvatarStatusResponse = async (handle: string, platform: string) => {

      // this is a temporary overide for testing
      // handle = '0x0bd793ea8334a77b2bfd604dbaedca11ea094306';

      // This is a network call
      const avatarStatusResponse =
        await nextIdCheckAvatarService.getAvatarStatus(handle, platform);

      console.log('avatarStatusResponse', avatarStatusResponse);
      setAvatarStatusResponse(avatarStatusResponse);

      let response: { idsItem: IdsItem | null, proofs: Proof[] } =
        avatarStatusResponseHelper.getProofs(avatarStatusResponse, platform, handle);

      console.log('proofs', response.proofs);

      setPlatformVerifiedStates(response.proofs);

      setProofs(response.proofs);
      setIdItem(response.idsItem);

      const supportedPlatforms = ['twitter', 'github'];

      const platformsNeedToConnectTo: Platform[] =
        avatarStatusResponseHelper.getPlatformsNeedToConnectTo(
          response.idsItem, supportedPlatforms);

      console.log('platformsNeedToConnectTo', platformsNeedToConnectTo);
      setPlatforms(platformsNeedToConnectTo);

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
            <span style={{ fontWeight: 'bold' }}>Link Platform:</span>
          </div>
          {platforms.map((platform, index) => (
            <div key={platform.name} style={{ paddingTop: '20px' }}>
              <GuiPlatform platform={platform} />
            </div>
          ))}
        </>
      );
    }
    else {
      return (
        <>
          <div>
            You do not yet have a next.ID associated with your wallet address.
          </div>
          <br />
          <hr />
          <br />
          <div>
            <span style={{ fontWeight: 'bold' }}>Create Next.id and Link Platform:</span>
          </div>
          {platforms.map((platform, index) => (
            <div key={platform.name} style={{ paddingTop: '20px' }}>
              <GuiPlatform platform={platform} />
            </div>
          ))}
        </>
      );
    }
  }
  else {
    return 'You need to connect your wallet before you can see your next.ID';
  }
}
