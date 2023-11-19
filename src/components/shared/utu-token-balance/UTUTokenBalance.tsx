import { useEffect, useState } from "react";

export default function UtuTokenBalance(props: any) {

  const utuTokenBalance = Number(props.utuTokenBalance);

  const connectUtuSocialMediaPlatformsUrl =
    process.env.REACT_APP_CONNECT_UTU_SOCIAL_MEDIA_PLATFORMS_URL;

  const earnTokens = () => {
    if (utuTokenBalance === 0) {
      return (
        <>
          <br /><br />
          Your balance is zero so you cannot endorse.
          <br /><br />
          You can earn UTU tokens by connecting your Social Media Platforms here:
          <br /><br />
          <a href={connectUtuSocialMediaPlatformsUrl}>{connectUtuSocialMediaPlatformsUrl}</a>
        </>
      );
    }
    else {
      return null;
    }
  }

  return (
    <div>
      <span style={{ fontWeight: 'bold' }}>Your UTT:</span> {utuTokenBalance}
      {earnTokens()}
    </div>
  );
}