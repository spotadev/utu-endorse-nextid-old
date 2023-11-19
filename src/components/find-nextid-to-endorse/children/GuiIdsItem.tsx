import { useNavigate } from "react-router-dom";
import { useGlobalStateContext } from "../../../App";
import { IdsItem, Proof } from "../../../services/next-id/nextIdCheckAvatarService";
import GuiProof from "../../shared/show-next-id/children/GuiProof";

export default function GuiIdsItem(props: any) {

  const navigate = useNavigate();
  const idsItem: IdsItem = props.idsItem;
  const index = props.index;
  const proofs: Proof[] = idsItem.proofs;


  const {
    setIdsItemToEndorse,
    setIdsItemToComment
  } = useGlobalStateContext();

  const endorse = (idsItem: IdsItem) => {
    console.log('idsItemToEndorse', idsItem);
    setIdsItemToEndorse(idsItem);
    navigate('/utuEndorse');
  }

  const comment = (idsItem: IdsItem) => {
    console.log('Comment clicked');
    setIdsItemToComment(idsItem);
    navigate('/utuComment')
  }

  if (idsItem) {
    return (
      <div style={{ paddingTop: '20px', backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>
        <div style={{ fontWeight: 'bold' }}>
          <span>next.id DID:</span>
        </div>
        <div style={{ wordWrap: 'break-word' }}>
          {idsItem?.avatar}
        </div>
        {
          proofs.map((proof, index) => (
            <div key={proof.identity} style={{ paddingTop: '20px' }}>
              <GuiProof proof={proof} />
            </div>
          ))
        }
        <div style={{ paddingTop: '20px' }}>
          <button onClick={() => { endorse(idsItem) }}>Endorse</button>
          &nbsp;&nbsp;
          <button onClick={() => { comment(idsItem) }}>Comment</button>
        </div>
      </div>
    );
  }
  return null;
}