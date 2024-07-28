"use client";

import Avvvatars from "avvvatars-react";

export default function Avatar({ placeholder }: { placeholder: string }) {
  return (
    <Avvvatars
      value={placeholder}
      size={64}
      style="character"
      radius={50}
      border
      borderSize={3}
    />
  );
}
