import React from "react";
import DivisiBaseAdmin from "./component/DivisiBaseAdmin";

// Icon Leaf/Tree
const treeIcon = (
  <svg
    className="w-6 h-6 text-emerald-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
  >
    <path d="M12 2L8 8h8l-4-6zM10 8L6 14h12l-4-6M8 14l-4 6h16l-4-6M12 20v2" />
  </svg>
);

const DivisiKonservasi = () => {
  return <DivisiBaseAdmin divisionName="Konservasi" divisionIcon={treeIcon} />;
};

export default DivisiKonservasi;
