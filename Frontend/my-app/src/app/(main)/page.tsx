"use client";

import React from "react";
import { ToastNotify } from "@/components/toast/Toast";

const page = () => {
  const handleClick = () => {
    ToastNotify("top-left", "Hellow New here!", "warning");
  };
  return (
    <div>
      <button onClick={handleClick}>Click me</button>
    </div>
  );
};

export default page;
