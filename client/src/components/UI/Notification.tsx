import React from "react";
import Button from "./Button";

export default function Notification() {
  return (
    <div>
      <Button variant="plain" className="!p-2 shadow-none aspect-square">
        <span className="material-symbols-outlined">notifications</span>
      </Button>
    </div>
  );
}
