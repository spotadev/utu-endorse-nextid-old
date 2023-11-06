import CaptureXHandle from './children/CaptureXHandle';
import { Link } from "react-router-dom";

export default function LinkXTwitter() {

  return (
    <div>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/'}>
          Back
        </Link>
      </div>
      <CaptureXHandle />
    </div>
  );
}