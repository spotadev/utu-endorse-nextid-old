import CaptureXHandle from './children/CaptureXHandle';
import { Link } from "react-router-dom";
import PostTweetInstructions from './children/PostTweetInstructions';

export default function LinkXTwitter() {

  return (
    <div>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/'}>
          Back
        </Link>
      </div>
      <CaptureXHandle />
      <br />
      <hr />
      <br />
      <PostTweetInstructions />
      <br />
      <hr />
    </div>
  );
}