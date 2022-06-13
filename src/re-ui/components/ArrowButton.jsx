import React from "react";
import { tw } from "twind";
import Left from "../resources/svgs/left";

const ArrowButton = ({ children, ...rest }) => {
  return (
    <button
      className={tw(
        "py-5 bg-white rounded-[10px] flex justify-between items-center px-4 text-[12px] font-extrabold uppercase text-black min-w-[120px] max-w-[250px] w-full"
      )}
      {...rest}
    >
      {children}
      <div className={tw("scale-75")}>
        <Left />
      </div>
    </button>
  );
};

export default ArrowButton;
