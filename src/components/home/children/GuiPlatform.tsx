import React from 'react'
import { Link } from "react-router-dom";
import { Platform } from "../../../services/next-id/nextIdCheckAvatarService";

export default function GuiPlatform(props: any) {

  const platform: Platform = props.platform;
  console.log('platform', platform);

  return (
    <Link to={platform.url}>
      <button>Link {platform.name}</button>
    </Link>
  );
}