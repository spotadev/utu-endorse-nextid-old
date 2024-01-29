import React from 'react';
import { useGlobalStateContext } from "../../../App";
import GuiProof from "./children/GuiProof";
import { IdsItem, Proof } from '../../../services/next-id/nextIdCheckAvatarService';

export default function ShowNextId(props: any) {

  let proofsToRender: Proof[] = [];
  let title = props.title;
  const idsItem: IdsItem = props.idsItem;

  let proofs: Proof[] = idsItem?.proofs;

  if (proofs) {®
    for (let proof of proofs) {
      if (proof.is_valid) {
        proofsToRender.push(proof);
      }
    }
  }

  if (!title) {
    title = 'next.id DID';
  }

  title = title + ':';

  return (
    <div style={{ paddingTop: '20px' }}>
      <div style={{ fontWeight: 'bold' }}>
        <span>{title}</span>
      </div>
      <div style={{ wordWrap: 'break-word' }}>
        {idsItem?.avatar}
      </div>
      <div style={{ paddingTop: '20px' }}>
        <span style={{ fontWeight: 'bold' }}>Below are the current connected handles:</span>
      </div>
      {
        proofsToRender.map((proof, index) => (
          <div key={proof.identity} style={{ paddingTop: '20px' }}>
            <GuiProof proof={proof} />
          </div>
        ))
      }
    </div>
  );
}