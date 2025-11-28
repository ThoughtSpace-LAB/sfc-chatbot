import React from "react";
import line4Stroke from "./line-4-stroke.svg";
import vector8Stroke from "./vector-8-stroke.svg";
import vector9Stroke from "./vector-9-stroke.svg";
import vector10 from "./vector-10.svg";
import vector11 from "./vector-11.svg";
import vector12 from "./vector-12.svg";
import vector13 from "./vector-13.svg";

interface LogoImageLayer {
  src: string;
  alt: string;
  className: string;
}

export const Logo = (): JSX.Element => {
  const logoLayers: LogoImageLayer[] = [
    {
      src: vector10,
      alt: "Logo accent element top right",
      className: "absolute top-[17px] left-[95px] w-4 h-[29px]",
    },
    {
      src: vector11,
      alt: "Logo accent element bottom left",
      className: "absolute top-[85px] left-5 w-[13px] h-[23px]",
    },
    {
      src: vector12,
      alt: "Logo accent element bottom center",
      className: "absolute top-[82px] left-[35px] w-[13px] h-[21px]",
    },
    {
      src: vector13,
      alt: "Logo accent element top center",
      className: "absolute top-[26px] left-[83px] w-[11px] h-4",
    },
    {
      src: line4Stroke,
      alt: "Logo circular border",
      className: "absolute top-px left-px w-32 h-32",
    },
    {
      src: vector8Stroke,
      alt: "Logo upper design element",
      className: "absolute top-5 left-[27px] w-[81px] h-[41px]",
    },
    {
      src: vector9Stroke,
      alt: "Logo lower design element",
      className: "absolute top-[62px] left-[22px] w-[85px] h-[46px]",
    },
  ];

  return (
    <figure
      className="flex flex-col w-[129px] h-[129px] items-center justify-center relative"
      role="img"
      aria-label="Company logo"
    >
      <div className="relative flex-1 self-stretch w-full grow">
        {logoLayers.map((layer, index) => (
          <img
            key={index}
            className={layer.className}
            alt={layer.alt}
            src={layer.src}
          />
        ))}
      </div>
    </figure>
  );
};
