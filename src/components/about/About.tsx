import React from 'react'
import { Link } from 'react-router-dom';
import UtuTokenBalance from '../shared/utu-token-balance/UTUTokenBalance';

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
        <li><a href="#about_next_id">About next.id avatar DID</a></li>
        <li><a href="#about_utu_trust">About UTU Trust</a></li>
        <li><a href="#about_developers_of_this_dapp">About Developers of this dApp</a></li>
        <li><a href="#about_what_this_tech_can_be_used_for">About what this tech can be used for</a></li>
      </ul>
      <div style={{ paddingTop: '10px' }}>
        <div style={{ color: 'maroon', fontWeight: 'bold', fontStyle: 'italic', paddingTop: '20px' }}>
          <span id="about_next_id">About next.id</span>
        </div>
        <p>
          next.id provides a decentralised avatar DID which aggregates a user's different web 2.0
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
          A next.id avatar DID makes it easier to see whether a wallet address is associated with a
          genuine user or a spammer.
        </p>
        <p>
          For more details see: <a href="https://next.id" target="_next_id">https://next.id</a>
        </p>
        <div style={{ color: 'maroon', fontWeight: 'bold', fontStyle: 'italic', paddingTop: '20px' }}>
          <span id="about_utu_trust">About UTU Trust</span>
        </div>
        <p>
          UTU Trust is about getting and giving UTU Signal on certain resources. That signal is
          created and retrived by people in your immediate and extended social media networks.
          Signal is often an opinion from a person.  We value the opinions of people we know more
          than unknown people.
        </p>
        <p>
          Apart from UTU Signal there are also UTU Endorsements.  UTU endorsement is where you spend
          some UTU tokens endorsing a resource.  You earn you initial tokens by connecting some
          of your social media accounts to UTU.  This is how UTU is able to know if signal came
          from someone in your network or extended network.  The UTU network also offers you ways
          of earning additional tokens.
        </p>
        <p>
          The UTU Trust tech allows you to give signal on or endorse a resource which has a unique ID.
          The hope is that UTU will later allow one to endorse a trait for a next.id avatar DID.
          For example it would be nice to endorse someone as being a good cook.
        </p>
        <p>
          In order to endorse you need UTU tokens.
        </p>
        <UtuTokenBalance />
        <p>
          In this dApp a user can endorse a user of a next.id avatar DID.
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
        <div style={{ color: 'maroon', fontWeight: 'bold', paddingTop: '20px' }}>
          <span id="about_what_this_tech_can_be_used_for">About what this tech can be used for</span>
        </div>
        <p>
          This app is showing how a user interface can be used to help people manage their next.id
          avatar DID.  It also shows how avatars can be UTU endorsed or have UTU signal created or
          read.
        </p>
        <p>
          Then there are the apps that use the next.id avatar DIDs.  For example in the case of
          a platform for software workers to find work, a requirement for a prospective worker is to
          list their github handle.  Prospective workers could lie and give the impressive github
          handle of someone else so that they win the contract by deception.  However if the worker
          has a next.id avatar DID which has a github handle in it you can be sure that the github
          handle does belongs to the worker.  i.e. the worker's profile is considered to have
          improved vetting if the worker has a next.id avatar DID in it with their github handle.
        </p>
        <p>
          Another example could be a social media website.  People write comments and tag content
          as offensive or good.  With next.id avatar DIDs, UTU endorsements and UTU signal you
          can know that the person who wrote a comment is in your network or exended network and
          that they are likely a real person. You have access to substantial evidence that the
          comment was not written by a software bot architected to destroy the effectiveness of
          the software.
        </p>
        <p>
          Further, the software could be designed to filter information by people who have or do
          not have next.id avatar DIDs.  People who have next.id avatar DIDs, UTU endorsements and
          UTU signal can be trusted more than unknown people without next.id avatar DIDs,
          UTU Endorsements or UTU Signal.
        </p>
        <p>
          Infact a self censorship system could be created where users have the option of tagging
          content as "offensive". Then other users could subscribe not to see that tagged content.
          This is all good and fine as long as the users are not maliciously tagging content which
          is "not offensive" as being "offensive". They could be doing this to render the platform
          unusable, to prevent people discussing content which saves lifes.
        </p>
        <p>
          By using next.id avatar DIDs, UTU Endorsements and UTU Signal this malicious activity
          can be eliminated.  For example you could subscribe to not see tagged content ONLY if
          the tagged content was tagged by UTU endorsed people with next.id avatar DIDs.
        </p>
        <p>
          It is our belief that improving the quality of information makes for a more prosperous
          and equal world where war mongering over lies cannot function as effectively.  This means
          this technology also has the potential to save millions of lives.
        </p>
        <p>
          With this technology it becomes harder for malicious actors to use propaganda to brain
          wash people.  Information is now in the hands of the users instead of in the hands of
          gangster criminals.  This is all made possible with Crypto Wallets like MetaMask and
          technologies like next.id avatar DIDs, UTU Endorsements and UTU Signal.
        </p>
        <p>
          Thank you
        </p>
      </div>
    </>
  );
}