import GetNextIdProofPayload from './GetNextIdProofPayload';
import PostTweetInstructions from './PostTweetInstructions';
import ShowProofHere from './ShowProofHere';
import ShowProofOnWeb3Bio from './ShowProofOnWeb3Bio';

export default function X() {

  return (
    <>
      <span style={{ fontWeight: 'bold' }}>Demo using Next.id, X (Twitter) and UTU Trust</span>
      <GetNextIdProofPayload />
      <hr />
      <PostTweetInstructions />
      <hr />
      <ShowProofHere />
      <hr />
      <ShowProofOnWeb3Bio />
      <hr />
      <div style={{ backgroundColor: 'pink' }}>
        NOTE: This in progress - next.id and UTU Trust not yet integrated but will soon be.
      </div>
    </>
  );
}

