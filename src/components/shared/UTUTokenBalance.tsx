import { useEffect, useState } from "react";

export default function UtuTokenBalance(props: any) {

  const utuTokenBalance = props.utuTokenBalance;

  const connectSocialMediaPlatformsUrl = '';

  useEffect(() => {

  }, []);

  return (
    <div>
      Your UTU Token Balance is: {utuTokenBalance} UTU tokens
      <br /><br />
      You can earn UTU tokens by connecting your Social Media Platforms here:
      <br /><br />
      <a href={connectSocialMediaPlatformsUrl}>{connectSocialMediaPlatformsUrl}</a>
    </div>
  );
}