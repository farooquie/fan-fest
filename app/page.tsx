import type { CSSProperties } from "react";
import ApplicationForm from "@/components/ApplicationForm";
import Faq from "@/components/Faq";
import Nav from "@/components/Nav";
import PageMotion from "@/components/PageMotion";

const aboutCards = [
  {
    icon: "🎤",
    title: "Live Panels & Talks",
    body: "Host your own stage session, Q&A, or join a creator roundtable. Real conversations with your real fans.",
  },
  {
    icon: "📸",
    title: "Meet & Greet Booths",
    body: "Dedicated creator booths where fans can interact, take photos, and grab exclusive merchandise.",
  },
  {
    icon: "🤝",
    title: "Brand Collaborations",
    body: "Connect with top-tier sponsors looking for authentic creator partnerships during the event.",
  },
  {
    icon: "🎮",
    title: "Live Content Challenges",
    body: "Compete in cross-creator content battles, streamed live for the audience and judged by fans.",
  },
  {
    icon: "🌐",
    title: "Global Streaming Reach",
    body: "The entire event is live-streamed to millions worldwide — your content extends far beyond the venue.",
  },
  {
    icon: "🎉",
    title: "Creator After-Party",
    body: "An exclusive closing night celebration — network, celebrate, and create memories off-camera too.",
  },
];

const perks = [
  {
    num: "01",
    title: "All-Access Badge",
    body: "Backstage, VIP zones, creator lounge, and all event areas throughout the three days.",
  },
  {
    num: "02",
    title: "Complimentary Accommodation",
    body: "Hotel stay covered for the full duration of the event for verified creators.",
  },
  {
    num: "03",
    title: "Dedicated Creator Stage",
    body: "Your own scheduled time slot on the creator main stage or breakout rooms.",
  },
  {
    num: "04",
    title: "Professional Content Crew",
    body: "On-site videographers and photographers available to document your FanFest moments.",
  },
  {
    num: "05",
    title: "Promotion Package",
    body: "Featured on all official FanFest 2026 social media, website, and email marketing to 500K+ subscribers.",
  },
  {
    num: "06",
    title: "Exclusive Merch Kit",
    body: "Limited-edition FanFest 2026 creator merchandise kit sent to you before the event.",
  },
];

const whoCanApply = [
  ["📹", "YouTubers"],
  ["🎵", "TikTokers"],
  ["📸", "Instagrammers"],
  ["🎙️", "Podcasters"],
  ["🎮", "Streamers"],
  ["✍️", "Bloggers"],
  ["🎨", "Digital Artists"],
  ["💪", "Fitness Creators"],
  ["🍳", "Food Creators"],
  ["👗", "Fashion Creators"],
] as const;

const timeline = [
  {
    step: "1",
    date: "July 13 – Aug 30, 2026",
    title: "Applications Open",
    body: "Submit your creator application form with your details and profile links.",
  },
  {
    step: "2",
    date: "September 1 – September 15, 2026",
    title: "Review & Selection",
    body: "Our team reviews all submissions. Shortlisted creators are contacted directly.",
  },
  {
    step: "3",
    date: "September 25, 2026",
    title: "Confirmation & Onboarding",
    body: "Selected creators receive official confirmation, event details, and onboarding kit.",
  },
  {
    step: "4",
    date: "October 21–23, 2026",
    title: "FanFest 2026 — LIVE",
    body: "Three days of content, connection, and unforgettable fan experiences.",
  },
];

export default function Home() {
  return (
    <>
      <PageMotion />
      <Nav />

      <section className="hero" id="home">
        <p className="hero-eyebrow">🎬 Open Applications — Limited Spots</p>
        <h1 className="hero-title">
          CREATE.
          <br />
          <span>CONNECT.</span>
          <br />
          DOMINATE.
        </h1>
        <p className="hero-sub">
          FanFest 2026 is calling on creators like you to be part of the biggest
          fan-powered event of the year. Share your world, grow your audience,
          and make history.
        </p>
        <div className="hero-btns">
          <a href="#apply" className="btn-primary">
            Apply as a Creator
          </a>
          <a href="#about" className="btn-ghost">
            Learn More
          </a>
        </div>
        <div className="hero-date-bar">
          <div className="date-item">
            <div className="val">OCT 21–23</div>
            <div className="lbl">Event Dates</div>
          </div>
          <div className="date-item">
            <div className="val">2026</div>
            <div className="lbl">Edition</div>
          </div>
          <div className="date-item">
            <div className="val">50K+</div>
            <div className="lbl">Expected Fans</div>
          </div>
          <div className="date-item">
            <div className="val">200+</div>
            <div className="lbl">Creator Spots</div>
          </div>
        </div>
      </section>

      <section className="section about" id="about">
        <p className="section-tag" data-animate>
          What Is FanFest 2026
        </p>
        <h2 className="section-title" data-animate style={{ "--delay": "80ms" } as CSSProperties}>
          Where Creators
          <br />
          Meet Their Fans
        </h2>
        <p className="section-lead" data-animate style={{ "--delay": "140ms" } as CSSProperties}>
          Three days of panels, activations, live streams, brand collaborations,
          and unforgettable fan moments — all under one roof.
        </p>
        <div className="about-grid">
          {aboutCards.map((card, index) => (
            <div
              key={card.title}
              className="about-card"
              data-animate="scale"
              style={{ "--delay": `${160 + index * 70}ms` } as CSSProperties}
            >
              <div className="icon">{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="perks">
        <p className="section-tag" data-animate>
          Creator Perks
        </p>
        <h2 className="section-title" data-animate style={{ "--delay": "80ms" } as CSSProperties}>
          What You Get
        </h2>
        <p className="section-lead" data-animate style={{ "--delay": "140ms" } as CSSProperties}>
          Every creator who joins FanFest 2026 gets a full support package
          designed to help you shine.
        </p>
        <div className="perks-list">
          {perks.map((perk, index) => (
            <div
              key={perk.num}
              className="perk"
              data-animate={index % 2 === 0 ? "left" : "right"}
              style={{ "--delay": `${120 + index * 70}ms` } as CSSProperties}
            >
              <div className="perk-num">{perk.num}</div>
              <div className="perk-body">
                <h4>{perk.title}</h4>
                <p>{perk.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section who" id="who">
        <p className="section-tag" data-animate>
          Eligibility
        </p>
        <h2 className="section-title" data-animate style={{ "--delay": "80ms" } as CSSProperties}>
          Who Can Apply?
        </h2>
        <p className="section-lead" data-animate style={{ "--delay": "140ms" } as CSSProperties}>
          We welcome creators across every niche, platform, and audience size.
          If you create — this is for you.
        </p>
        <div className="who-grid">
          {whoCanApply.map(([emoji, label], index) => (
            <a
              key={label}
              href="#apply"
              className="who-badge"
              data-animate="scale"
              style={{ "--delay": `${100 + index * 50}ms` } as CSSProperties}
            >
              <span className="emoji">{emoji}</span>
              <span>{label}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="section" id="timeline">
        <p className="section-tag" data-animate>
          Key Dates
        </p>
        <h2 className="section-title" data-animate style={{ "--delay": "80ms" } as CSSProperties}>
          Application Timeline
        </h2>
        <div className="timeline-list" data-animate>
          {timeline.map((item, index) => (
            <div
              key={item.step}
              className="tl-item"
              data-animate="left"
              style={{ "--delay": `${180 + index * 120}ms` } as CSSProperties}
            >
              <div className="tl-dot">{item.step}</div>
              <div className="tl-content">
                <div className="tl-date">{item.date}</div>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ApplicationForm />
      <Faq />

      <footer className="site-footer">
        <p className="footer-brand">
          FAN<strong>FEST</strong> 2026
        </p>
        <p>
          October 21–23, 2026 · For creators, by Aman Ali.
        </p>
        <p className="footer-links">
          © 2026 FanFest. All rights reserved. ·{" "}
          <a href="#">Privacy Policy</a> · <a href="#">Contact Us</a>
        </p>
      </footer>
    </>
  );
}
