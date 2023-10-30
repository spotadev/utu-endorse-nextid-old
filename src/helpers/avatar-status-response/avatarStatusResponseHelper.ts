import AvatarStatusResponse from "../../services/next-id/nextIdCheckAvatarService";


const hasXHandle = (avatarStatusResponse: AvatarStatusResponse) => {
  const idsItems = avatarStatusResponse.ids;

  for (let idsItem of idsItems) {
    const proofs = idsItem.proofs;

    for (let proof of proofs) {

      if (proof.platform == '') {
        return true;
      }
    }
  }

  return false;
}

export const avatarStatusResponseHelper = {
  hasXHandle
}