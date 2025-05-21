import * as React from "react";

const SvgIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="243"
    height="70"
    fill="none"
    viewBox="0 0 243 70"
    {...props}
  >
    <foreignObject width="243" height="70" x="-3.791" y="-3.097">
      <div
        xmlns="http://www.w3.org/1999/xhtml"
        clipPath="url(#bgblur_0_594_200_clip_path)"
        style={{ backdropFilter: "blur(2px)", height: "100%", width: "100%" }}
      ></div>
    </foreignObject>
    <path
      fill="#fff"
      fillOpacity="0.6"
      d="M.209.903h243V41.77c0 16.568-13.432 30-30 30H.209z"
      data-figma-bg-blur-radius="4"
    ></path>
    <defs>
      <clipPath
        id="bgblur_0_594_200_clip_path"
        transform="translate(3.791 3.097)"
      >
        <path d="M.209.903h243V41.77c0 16.568-13.432 30-30 30H.209z"></path>
      </clipPath>
    </defs>
  </svg>
);

export default SvgIcon;
