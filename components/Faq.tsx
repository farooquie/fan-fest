"use client";

import type { CSSProperties } from "react";
import { useState } from "react";

const faqs = [
  {
    q: "Is there a minimum follower count to apply?",
    a: "There's no hard minimum — we evaluate creators holistically based on content quality, engagement, and audience connection. Even nano-creators with highly engaged communities are welcome.",
  },
  {
    q: "Is travel reimbursement provided?",
    a: "We cover accommodation for all selected creators. Travel reimbursement is offered on a case-by-case basis for international creators. Details are shared in your acceptance letter.",
  },
  {
    q: "Can I apply as a team or co-creators?",
    a: "Yes! You can apply as a duo or small team. Each member should be listed in the application and all relevant social links included.",
  },
  {
    q: "What is the Creator Code of Conduct?",
    a: "FanFest 2026 requires all participating creators to maintain a respectful, inclusive environment for fans and fellow creators. The full CoC is available on our website.",
  },
  {
    q: "Will I be paid to participate?",
    a: "Selected creators receive a comprehensive perks package including accommodation, a dedicated stage slot, and promotional exposure. Paid partnerships are available separately through our brand matching program.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section who" id="faq">
      <p className="section-tag" data-animate>
        Frequently Asked Questions
      </p>
      <h2
        className="section-title"
        data-animate
        style={{ "--delay": "80ms" } as CSSProperties}
      >
        Got Questions?
      </h2>
      <div className="faq-list">
        {faqs.map((item, index) => (
          <div
            key={item.q}
            className={`faq-item${openIndex === index ? " open" : ""}`}
            data-animate
            style={{ "--delay": `${100 + index * 70}ms` } as CSSProperties}
          >
            <button
              type="button"
              className="faq-q"
              onClick={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
              aria-expanded={openIndex === index}
            >
              {item.q}
            </button>
            <div className="faq-a">{item.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
