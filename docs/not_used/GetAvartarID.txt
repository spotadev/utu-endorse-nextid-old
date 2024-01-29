import { useEffect, useState } from "react";

import appStyle from '../../../App.module.css';
import AvatarStatusResponse, { nextIdCheckAvatarService } from "../../src/services/next-id/nextIdCheckAvatarService";
import { avatarStatusResponseHelper } from "../../src/helpers/avatar-status-response/avatarStatusResponseHelper";


export default function GetAvatarID() {

  const [platformToSearch, setPlatformToSearch] = useState<string>('twitter');
  const [handleToSearch, setHandleToSearch] = useState<string | null>(null);
  const [avatarStatusResponseFromSearch, setAvatarStatusResponseFromSearch] = useState<AvatarStatusResponse | null>(null);
  const [idsItemsFromSearch, setidsItemsFromSearch] = useState<string | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>();

  useEffect(() => {

  })

  const avatarSearch = async () => {
    const exact = true;

    if (!(!!handleToSearch && !!platformToSearch)) {
      return;
    }

    const _avatarStatusResponseFromSearch =
      await nextIdCheckAvatarService.getAvatarStatus(handleToSearch, platformToSearch, exact);

    setAvatarStatusResponseFromSearch(_avatarStatusResponseFromSearch);
  }

  const getAvatarStatusJSX = () => {
    if (avatarStatusResponseFromSearch && avatarStatusResponseFromSearch.ids.length > 0) {
      return (
        <div>
          <div style={{ fontWeight: 'bold', paddingBottom: '10px', paddingTop: '20px' }}>DID details:</div>
          {avatarStatusResponseFromSearch.ids.length === 1 ?
            (
              'Select which avatar you want to add social medial handles to'
            ) : ''
          }
          {
            avatarStatusResponseFromSearch.ids.map((id, index) => (
              <div key={id.avatar}
                style={{ padding: '10px', backgroundColor: index % 2 === 0 ? 'lightGreen' : 'white' }}>
                <div>
                  {avatarStatusResponseFromSearch.ids.length === 1 ?
                    (
                      <input
                        type="checkbox"
                        value={id.avatar}

                        onChange={(event) => setSelectedAvatar(event.target.value)}
                      />
                    ) : ''
                  }
                </div>
                <div>
                  <span style={{ display: 'inline-block', width: '150px' }}>Avatar:</span>
                  <span>{id.avatar}</span>
                </div>
                <div>
                  <span style={{ display: 'inline-block', width: '150px' }}>Persona:</span>
                  <span>{id.persona}</span>
                </div>
                <div>
                  <span style={{ display: 'inline-block', width: '150px' }}>Activated at:</span>
                  <span>{id.activated_at}</span>
                </div>
                {
                  id.proofs.map(
                    (proof, index2) => (
                      <div key={proof.identity} style={{ paddingLeft: '10px;' }}>
                        <div>
                          <span style={{ display: 'inline-block', width: '150px' }}>Proof created at:</span>
                          <span>{proof.created_at}</span>
                        </div>
                        <div>
                          <span style={{ display: 'inline-block', width: '150px' }}>Handle:</span>
                          <span>{proof.identity}</span>
                        </div>
                        <div>
                          <span style={{ display: 'inline-block', width: '150px' }}>Platform:</span>
                          <span>{proof.platform}</span>
                        </div>
                        <div>
                          <span style={{ display: 'inline-block', width: '150px' }}>Is Valid:</span>
                          <span>{proof.is_valid}</span>
                        </div>
                        <div>
                          <span style={{ width: '200px' }}>Invalid Reason:</span>
                          <span>{proof.invalid_reason}</span>
                        </div>
                        <div>
                          <span style={{ display: 'inline-block', width: '150px' }}>Last Checked at:</span>
                          <span>{proof.last_checked_at}</span>
                        </div>
                      </div>
                    )
                  )
                }
              </div>
            ))
          }
        </div>
      );
    }
    else if (avatarStatusResponseFromSearch) {
      return (
        <>
          <div style={{ fontWeight: 'bold', paddingBottom: '10px', paddingTop: '20px' }}>DID details:</div>
          <div style={{ backgroundColor: 'lightgreen', color: 'red', padding: '10px' }}>
            No Avatar / Decentralised(DID) found.
          </div>
        </>
      );
    }
    else {
      return '';
    }
  }

  return (
    <div>
      <p style={{ fontWeight: 'bold' }}>
        Find your avatar if you have one
      </p>
      <p>
        <span style={{ display: 'inline-block', width: '100px' }}>Platform:</span>
        <select value={platformToSearch}
          className={appStyle.input}
          onChange={(event) => { setPlatformToSearch(event.target.value) }}>
          <option value="twitter">Twitter</option>
          <option value="ethereum">Ethereum</option>
          <option value="nextid">Next.id Avatar DID</option>
        </select>
      </p>
      <p>
        <span style={{ display: 'inline-block', width: '100px' }}>Handle:</span>
        <input
          style={{ width: '600px' }}
          className={appStyle.input}
          placeholder="Handle (mandatory)"
          value={handleToSearch ? handleToSearch : ''}
          onChange={(event) => setHandleToSearch(event.target.value)} />

        <button disabled={handleToSearch?.length == 0}
          className={appStyle.button}
          onClick={avatarSearch}>Search</button>
      </p>
      {getAvatarStatusJSX()}
    </div>
  );
}
