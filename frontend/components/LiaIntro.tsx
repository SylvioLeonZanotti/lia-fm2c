"use client";

import { useEffect, useState } from "react";

interface Props {
  onDone: () => void;
}

const words = ["Olá,", "sou", "a", "Lia"];

export default function LiaIntro({ onDone }: Props) {
  const [show, setShow] = useState(false);
  const [out, setOut]   = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true), 60);
    const t2 = setTimeout(() => setOut(true),  3400);
    const t3 = setTimeout(onDone,              4100);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  const skip = () => {
    if (out) return;
    setOut(true);
    setTimeout(onDone, 700);
  };

  return (
    <div
      className={`li-root ${show ? "li-root--in" : ""} ${out ? "li-root--out" : ""}`}
      onClick={skip}
    >
      {/* Avatar em círculo */}
      <div className={`li-circle ${show ? "li-circle--in" : ""}`}>
        {/* overflow:hidden aqui garante o corte circular da imagem */}
        <div className="li-circle__img">
          <img src="/avatar.png" alt="Lia" draggable={false} />
        </div>
        {/* Anéis ficam fora do clip mas dentro do wrapper posicionado */}
        <div className="li-ring li-ring-1" />
        <div className="li-ring li-ring-2" />
      </div>

      {/* Bloco de texto */}
      <div className="li-text">
        <h1 className="li-heading">
          {words.map((w, i) => (
            <span
              key={i}
              className={`li-word ${show ? "li-word--in" : ""}`}
              style={{ transitionDelay: show ? `${0.65 + i * 0.11}s` : "0s" }}
            >
              {w}
            </span>
          ))}
        </h1>

        <p
          className={`li-sub ${show ? "li-sub--in" : ""}`}
          style={{ transitionDelay: show ? "1.15s" : "0s" }}
        >
          Assistente inteligente da FM2C
        </p>
      </div>

    </div>
  );
}
