"use client";

import Avvvatars from "avvvatars-react";

export default function Avatar({ placeholder }: { placeholder: string }) {
  return (
    <Avvvatars
      value={placeholder}
      size={50}
      style="character"
      radius={50}
      border
      borderSize={3}
    />
  );
}
