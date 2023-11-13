import { useEffect, useState } from "react";

export default function UtuTokenBalance() {

  const connectSocialMediaPlatformsUrl = '';
  const [utuTokenBalance, setUtuTokenBalance] = useState<number>(0);

  const getUtuTokenBalance = () => {
    return 0;
  }

  useEffect(() => {
    setUtuTokenBalance(getUtuTokenBalance());
    // Get UTU token balance
    // setUtuTokenBalance();
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