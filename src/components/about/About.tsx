import React from 'react'
import { Link } from 'react-router-dom';
import UtuTokenBalance from '../shared/UTUTokenBalance';

export default function About() {

  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/'}>
          Back
        </Link>
      </div >
      <div style={{ color: 'green', fontWeight: 'bold' }}>
        About
      </div>
      <ul>
        <li><a href="#about_next_id">About next.id</a></li>
        <li><a href="#about_utu_trust">About UTU Trust</a></li>
        <li><a href="#about_developers_of_this_dapp">About Developers of this dApp</a></li>
      </ul>
      <div style={{ paddingTop: '10px' }}>
        <div style={{ color: 'maroon', fontWeight: 'bold', fontStyle: 'italic', paddingTop: '20px' }}>
          <span id="about_next_id">About next.id</span>
        </div>
        <p>
          next.id provides a Decentralised ID (DID) which aggregates a user's different web 2.0
          and web 3.0 handles together.
        </p>
        <p>
          This dApp provides a GUI so that users can link their different social handles
          together.
        </p>
        <p>
          This next.id service is particularly useful in the crypto space for linking
          wallet addresses to other identities also owned by the user.
        </p>
        <p>
          A DID makes it easier to see whether a wallet address is associated with a
          genuine user or a spammer.
        </p>
        <p>
          For more details see: <a href="https://next.id" target="_next_id">https://next.id</a>
        </p>
        <div style={{ color: 'maroon', fontWeight: 'bold', fontStyle: 'italic', paddingTop: '20px' }}>
          <span id="about_utu_trust">About UTU Trust</span>
        </div>
        <p>
          UTU Trust is about getting feedback from people in your social network as to the
          trustworthiness of a resource. Users often value the opinions of known people more
          than the opinions of strangers.
        </p>
        <p>
          The UTU Trust tech allows you to comment on or endorse a resource which has a unique ID.
        </p>
        <p>
          In order to endorse you need UTU tokens.
        </p>
        <UtuTokenBalance />
        <p>
          In this dApp a user can endorse a user of a DID as having a certain characteristic.
          For example you could endorse someone as being a good chef.
        </p>
        <p>
          For more details about UTU Trust see:
          <a href="https://utu.io" target="_utu_io">https://utu.io</a>
        </p>
        <div style={{ color: 'maroon', fontWeight: 'bold', paddingTop: '20px' }}>
          <span id="about_developers_of_this_dapp">About Developers of this dApp</span>
        </div>
        <p>
          The developers of this dApp are open source crypto enthusiasts who want to create value
          for decentralised: applications, systems and users.
        </p>
        <p>
          If you want to get in touch with the developers add an issue here:
          <br /><br /> &nbsp;&nbsp;&nbsp;
          <a href="https://github.com/spotadev/utu-endorse-nextid/discussions" target="_discussions">
            https://github.com/spotadev/utu-endorse-nextid/discussions
          </a>
        </p>
        <p>
          Power to the People!
        </p>
        <p>
          Unity & One Love
        </p>
      </div >
    </>
  );
}