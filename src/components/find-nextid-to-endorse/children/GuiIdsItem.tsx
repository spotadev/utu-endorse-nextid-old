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
    setIdsItem,
  } = useGlobalStateContext();

  const utuEndorse = (idsItem: IdsItem) => {

    setIdsItem(idsItem);
    navigate('/utuEndorse');
  }

  const utuComment = (idsItem: IdsItem) => {
    setIdsItem(idsItem);
    navigate('/utuComment')
  }

  const seeSignalFeedback = (idsItem: IdsItem) => {
    setIdsItem(idsItem);
    navigate('/signalFeedback')
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
          <button onClick={() => { utuEndorse(idsItem) }}>UTU Endorse</button>
          &nbsp;&nbsp;
          <button onClick={() => { utuComment(idsItem) }}>UTU Comment</button>
          &nbsp;&nbsp;
          <button onClick={() => { seeSignalFeedback(idsItem) }}>See Signal Feedback</button>
        </div>
      </div>
    );
  }
  return null;
}