import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import appStyle from '../../App.module.css';
import { IdsItem, nextIdCheckAvatarService } from '../../services/next-id/nextIdCheckAvatarService';
import SelectNextIdDID from './children/SelectNextIdDID';
import ShowTestEthereumAddress from '../show-test-ethereum-address/ShowTestEthereumAddress';
import { useGlobalStateContext } from '../../App';

export default function FindNextIdToEndorseOrComment() {

  const {
    findPlatform, setFindPlatform, findHandle, setFindHandle
  } = useGlobalStateContext();

  const [idsItems, setIdsItems] = useState<IdsItem[] | null>(null);


  const reset = () => {
    setFindPlatform('');
    setFindHandle('');
  }

  const search = async () => {
    const exact = true;

    // This is a network call
    const avatarStatusResponse =
      await nextIdCheckAvatarService.getAvatarStatus(findHandle, findPlatform, exact);

    const idsItems = avatarStatusResponse.ids;
    setIdsItems(idsItems);
  }

  return (
    <>
      <div style={{ textAlign: 'right' }}>
        <Link to={'/about'}>
          About
        </Link>
        &nbsp;&nbsp;
        <Link to={'/'}>
          Back
        </Link>
      </div>
      <div style={{ color: 'green', fontWeight: 'bold', paddingTop: '20px' }}>
        "UTU Endorse / Comment / See Signal"
      </div>
      <div style={{ paddingTop: '20px' }}>
        To Endorse, add a comment or see signal for a  next.id DID you need to first of all find
        the DID.
        <br /><br />
        To find the DID:
        <ul>
          <li>Select the platform you want to search in from the dropdown</li>
          <li>Type the handle in the box</li>
        </ul>
        Note if the person does not have a next.id DID you will not find them.
      </div>
      <ShowTestEthereumAddress />
      <br /><hr />
      <div style={{ paddingTop: '20px' }}>
        Select Platform:
        &nbsp;&nbsp;
        <select id="selectPlatform"
          value={findPlatform}
          onChange={(event) => { setFindPlatform(event.target.value) }}
          className={appStyle.input}
        >
          <option value="">Select...</option>
          <option value="ethereum">Ethereum Wallet Address</option>
          <option value="github">Github Handle</option>
          <option value="nextid">Next.id DID</option>
          <option value="twitter">X Handle</option>
        </select>
      </div>
      <div style={{ paddingTop: '20px' }}>
        Handle:
        &nbsp;&nbsp;
        <input
          type="text"
          id="yourTextBox"
          value={findHandle}
          onChange={(event) => { setFindHandle(event.target.value) }}
          className={appStyle.input}
          style={{ width: '400px' }}
        />
        &nbsp;&nbsp;
        <button onClick={search}
          disabled={!(findPlatform.length > 0 && findHandle.length > 0)}>Search</button>
        &nbsp;&nbsp;
        <button onClick={reset}
          disabled={!(findPlatform.length > 0 || findHandle.length > 0)}>Reset</button>
      </div >
      <br /><hr /><br />
      <SelectNextIdDID idsItems={idsItems} />
      <br /><br /><hr />
    </>
  );
}