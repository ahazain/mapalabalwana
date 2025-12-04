import React from "react";
import DivisiBaseAdmin from "./component/DivisiBaseAdmin";

// Icon Shield/Cliff
const shieldIcon = (
  <svg
    className="w-6 h-6 text-slate-700"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const DivisiRockClimbing = () => {
  return (
    <DivisiBaseAdmin divisionName="Rock Climbing" divisionIcon={shieldIcon} />
  );
};

export default DivisiRockClimbing;
