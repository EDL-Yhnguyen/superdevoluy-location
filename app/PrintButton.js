"use client";
export default function PrintButton() {
  return <p className="noprint"><button className="btn" onClick={() => window.print()}>Imprimer / enregistrer en PDF</button></p>;
}
