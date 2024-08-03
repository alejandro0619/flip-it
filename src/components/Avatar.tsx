"use client";

import Avvvatars from "avvvatars-react";

export default function Avatar({
  placeholder,
  style = "character",
  size = 50
}: {
  placeholder: string;
  style: "shape" | "character";
  size: number;
}) {
  return (
    <Avvvatars
      value={placeholder}
      size={size}
      style={style}
      radius={50}
      border
      borderSize={3}
    />
  );
}
