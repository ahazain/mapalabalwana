import React from "react";
import DivisiBaseAdmin from "./component/DivisiBaseAdmin";

// Icon Mountain
const mountainIcon = (
  <svg
    className="w-6 h-6 text-[#3F5F9A]"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
  >
    <path d="M5 12l5-5 4 4 6-6v13H5z" />
  </svg>
);

const DivisiGunungHutan = () => {
  return (
    <DivisiBaseAdmin divisionName="Gunung Hutan" divisionIcon={mountainIcon} />
  );
};

export default DivisiGunungHutan;
