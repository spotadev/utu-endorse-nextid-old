import React from 'react'
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { IdsItem, Platform, Proof, nextIdCheckAvatarService } from "../../../services/next-id/nextIdCheckAvatarService";
import { useGlobalStateContext } from "../../../App";
import { avatarStatusResponseHelper } from "../../../helpers/avatar-status-response/avatarStatusResponseHelper";
import GuiProof from "../../shared/show-next-id/children/GuiProof";
import GuiPlatform from "./GuiPlatform";
import ShowNextId from '../../shared/show-next-id/ShowNextId';

export default function CheckForNextID() {

  const {
    setAvatarStatusResponse,
    setXProofVerified,
  } = useGlobalStateContext();

  const { address, isConnected } = useAccount();

  const [proofs, setProofs] = useState<Proof[]>([]);
  const [idsItem, setIdsItem] = useState<IdsItem | null>(null);
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

      const exact = true;

      // This is a network call
      const avatarStatusResponse =
        await nextIdCheckAvatarService.getAvatarStatus(handle, platform, exact);

      console.log('avatarStatusResponse', avatarStatusResponse);
      setAvatarStatusResponse(avatarStatusResponse);

      let _idsItem =
        avatarStatusResponseHelper.getIdsItem(handle, platform, avatarStatusResponse.ids);

      if (_idsItem) {
        setPlatformVerifiedStates(_idsItem.proofs);
        setProofs(_idsItem.proofs);
        setIdsItem(_idsItem);
      }
      else {
        setPlatformVerifiedStates([]);
        setProofs([]);
        setIdsItem(null);
      }

      const supportedPlatforms = ['twitter', 'github'];

      const platformsNeedToConnectTo: Platform[] =
        avatarStatusResponseHelper.getPlatformsNeedToConnectTo(
          idsItem, supportedPlatforms);

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
          <ShowNextId title='Your next.id DID' idsItem={idsItem} />
          <br /><hr /><br />
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
