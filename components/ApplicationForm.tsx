"use client";

import { FormEvent, useState, useEffect } from "react";

const platformMap: Record<string, string> = {
  youtube: "YouTube",
  tiktok: "TikTok",
  twitch: "Twitch",
  instagram: "Instagram",
  x: "Twitter/X",
  podcast: "Podcast",
  other: "Other",
};

export default function ApplicationForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // 13 seconds timer to auto pop up
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem("formClosed")) {
        setIsOpen(true);
      }
    }, 13000);

    const handleHashChange = () => {
      if (window.location.hash === "#apply") {
        setIsOpen(true);
      }
    };

    // Check initial hash on mount
    if (window.location.hash === "#apply") {
      setIsOpen(true);
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen || showSuccessModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, showSuccessModal]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("formClosed", "true");
    if (window.location.hash === "#apply") {
      // Clear hash without scroll jump
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }
  };

  const handleNext = () => {
    // Find current step element
    const stepContainer = document.querySelector(`.form-step-${currentStep}`);
    if (stepContainer) {
      // Find all inputs in the active step
      const inputs = stepContainer.querySelectorAll<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >("input, select, textarea");

      // Validate inputs in the active step
      let allValid = true;
      for (let i = 0; i < inputs.length; i++) {
        const input = inputs[i];
        if (!input.reportValidity()) {
          allValid = false;
          break;
        }
      }

      if (allValid) {
        setCurrentStep((prev) => prev + 1);
        // Scroll the form container back to top
        const overlay = document.getElementById("apply");
        if (overlay) {
          overlay.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    } else {
      setCurrentStep((prev) => prev + 1);
      // Scroll the form container back to top
      const overlay = document.getElementById("apply");
      if (overlay) {
        overlay.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    // Scroll the form container back to top
    const overlay = document.getElementById("apply");
    if (overlay) {
      overlay.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (currentStep !== 3) {
      handleNext();
      return;
    }
    const form = e.currentTarget;
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(form);
    const platforms = formData
      .getAll("platform")
      .map((val) => platformMap[String(val)] || "Other");

    if (platforms.length === 0) {
      platforms.push("Other");
    }

    const interests = formData.getAll("interest").map(String);

    const payload = {
      personalInfo: {
        name: `${formData.get("fname")} ${formData.get("lname")}`.trim(),
        email: formData.get("email"),
        phone: formData.get("phone") || "N/A",
        country: formData.get("country"),
        city: formData.get("city") || "N/A",
      },
      creatorProfile: {
        handle: formData.get("handle"),
        niche: formData.get("niche"),
        platforms,
        followerCount: formData.get("followers"),
        avgViews: formData.get("avg_views") || "N/A",
        profileLinks: [
          formData.get("channel_link"),
          formData.get("other_links"),
        ].filter(Boolean),
      },
      participationPreferences: {
        panel: interests.includes("panel"),
        meetAndGreet: interests.includes("meetgreet"),
        collabs: interests.includes("collab"),
        brandDeals: interests.includes("brand"),
        liveChallenges: interests.includes("challenge"),
      },
      additionalDetails: {
        bio: formData.get("bio"),
        previousEventExperience: formData.get("prev_events") || "",
        referralSource: formData.get("referral") || "",
      },
      consents: {
        termsAndConditions: formData.get("terms") === "on",
        mediaConsent: formData.get("media_consent") === "on",
        newsletter: formData.get("newsletter") === "on",
      },
    };

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong.");
        return;
      }

      setStatus("success");
      form.reset();

      // Return back to home page flow after a brief delay
      setTimeout(() => {
        handleClose();
        setCurrentStep(1);
        setStatus("idle");
        // Trigger success modal popup
        setShowSuccessModal(true);
      }, 1500);
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please try again.");
    }
  }

  return (
    <>
      <div
        id="apply"
      className={`form-modal-overlay${isOpen ? " open" : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="form-wrap" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={handleClose}
          aria-label="Close form"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 className="form-title">Apply as a Creator</h2>
        <p className="form-sub">
          Fill in the form below and we&apos;ll review your application within
          5–7 business days.
        </p>

        {/* Multi-Step Progress Indicator */}
        <div className="form-steps-indicator">
          <div className="progress-bg-line" />
          <div
            className="progress-fill-line"
            style={{ transform: `scaleX(${(currentStep - 1) / 2})` }}
          />
          <div
            className={`step-node${currentStep >= 1 ? " active" : ""}${
              currentStep > 1 ? " completed" : ""
            }`}
          >
            <div className="step-num">{currentStep > 1 ? "✓" : "1"}</div>
            <div className="step-label">Personal</div>
          </div>
          <div
            className={`step-node${currentStep >= 2 ? " active" : ""}${
              currentStep > 2 ? " completed" : ""
            }`}
          >
            <div className="step-num">{currentStep > 2 ? "✓" : "2"}</div>
            <div className="step-label">Profile</div>
          </div>
          <div className={`step-node${currentStep >= 3 ? " active" : ""}`}>
            <div className="step-num">3</div>
            <div className="step-label">Preferences</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* STEP 1: PERSONAL INFORMATION */}
          <div
            style={{ display: currentStep === 1 ? "block" : "none" }}
            className="form-step-1"
          >
            <p className="section-tag" style={{ marginBottom: "1.25rem" }}>
              Personal Information
            </p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fname">
                  First Name <span>*</span>
                </label>
                <input
                  type="text"
                  id="fname"
                  name="fname"
                  placeholder="e.g. Alex"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="lname">
                  Last Name <span>*</span>
                </label>
                <input
                  type="text"
                  id="lname"
                  name="lname"
                  placeholder="e.g. Rivera"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">
                  Email Address <span>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="hello@yoursite.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="+91 9876543210"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">
                  Country <span>*</span>
                </label>
                <select id="country" name="country" required defaultValue="">
                  <option value="" disabled>
                    Select your country
                  </option>
                  <option>India</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>Canada</option>
                  <option>Australia</option>
                  <option>Philippines</option>
                  <option>Indonesia</option>
                  <option>Brazil</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  placeholder="e.g. Mumbai"
                />
              </div>
            </div>

            <div className="form-step-btns">
              <button
                type="button"
                className="next-btn"
                style={{ width: "100%" }}
                onClick={handleNext}
              >
                Next Step →
              </button>
            </div>
          </div>

          {/* STEP 2: CREATOR PROFILE */}
          <div
            style={{ display: currentStep === 2 ? "block" : "none" }}
            className="form-step-2"
          >
            <p className="section-tag" style={{ marginBottom: "1.25rem" }}>
              Creator Profile
            </p>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="handle">
                  Primary Creator Handle / Name <span>*</span>
                </label>
                <input
                  type="text"
                  id="handle"
                  name="handle"
                  placeholder="@yourname"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="niche">
                  Content Niche <span>*</span>
                </label>
                <select id="niche" name="niche" required defaultValue="">
                  <option value="" disabled>
                    Select your niche
                  </option>
                  <option>Gaming & Esports</option>
                  <option>Lifestyle & Vlogging</option>
                  <option>Fashion & Beauty</option>
                  <option>Food & Cooking</option>
                  <option>Fitness & Health</option>
                  <option>Tech & Reviews</option>
                  <option>Music & Entertainment</option>
                  <option>Education & How-to</option>
                  <option>Travel</option>
                  <option>Art & Design</option>
                  <option>Comedy & Skits</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <p className="form-label">
                Primary Platform(s) <span>*</span>
              </p>
              <div className="checkbox-group">
                {[
                  ["youtube", "YouTube"],
                  ["instagram", "Instagram"],
                  ["tiktok", "TikTok"],
                  ["twitch", "Twitch"],
                  ["podcast", "Podcast"],
                  ["x", "X (Twitter)"],
                  ["other", "Other"],
                ].map(([value, label]) => (
                  <label key={value} className="checkbox-item">
                    <input type="checkbox" name="platform" value={value} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="followers">
                  Total Followers / Subscribers <span>*</span>
                </label>
                <select id="followers" name="followers" required defaultValue="">
                  <option value="" disabled>
                    Select range
                  </option>
                  <option>1K – 10K</option>
                  <option>10K – 50K</option>
                  <option>50K – 100K</option>
                  <option>100K – 500K</option>
                  <option>500K – 1M</option>
                  <option>1M+</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="avg-views">Average Views per Post</label>
                <select id="avg-views" name="avg_views" defaultValue="">
                  <option value="" disabled>
                    Select range
                  </option>
                  <option>Under 1K</option>
                  <option>1K – 10K</option>
                  <option>10K – 50K</option>
                  <option>50K – 100K</option>
                  <option>100K – 500K</option>
                  <option>500K+</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="channel-link">
                Primary Channel / Profile Link <span>*</span>
              </label>
              <input
                type="url"
                id="channel-link"
                name="channel_link"
                placeholder="https://youtube.com/@yourchannel"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="other-links">Other Social Media Links</label>
              <input
                type="text"
                id="other-links"
                name="other_links"
                placeholder="Paste links separated by commas"
              />
            </div>

            <div className="form-step-btns split">
              <button type="button" className="back-btn" onClick={handleBack}>
                ← Back
              </button>
              <button type="button" className="next-btn" onClick={handleNext}>
                Next Step →
              </button>
            </div>
          </div>

          {/* STEP 3: PARTICIPATION PREFERENCES */}
          <div
            style={{ display: currentStep === 3 ? "block" : "none" }}
            className="form-step-3"
          >
            <p className="section-tag" style={{ marginBottom: "1.25rem" }}>
              Participation Preferences
            </p>
            <div className="form-group">
              <p className="form-label">Interested In (Select all that apply)</p>
              <div className="checkbox-group">
                {[
                  ["panel", "Hosting a Panel or Talk"],
                  ["meetgreet", "Meet & Greet Booth"],
                  ["collab", "Creator Collaborations"],
                  ["brand", "Brand Sponsorship Opportunities"],
                  ["challenge", "Live Content Challenges"],
                ].map(([value, label]) => (
                  <label key={value} className="checkbox-item">
                    <input type="checkbox" name="interest" value={value} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">
                Tell Us About Yourself &amp; Why You Want to Join <span>*</span>
              </label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Share a brief intro, what kind of content you create, and why FanFest 2026 excites you…"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="prev-events">Previous Event Experience</label>
              <textarea
                id="prev-events"
                name="prev_events"
                placeholder="Have you attended or participated in fan conventions or creator events before? Tell us about it."
                style={{ minHeight: 80 }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="referral">
                How Did You Hear About FanFest 2026?
              </label>
              <select id="referral" name="referral" defaultValue="">
                <option value="" disabled>
                  Select one
                </option>
                <option>Instagram</option>
                <option>YouTube</option>
                <option>TikTok</option>
                <option>From another creator</option>
                <option>Email / Newsletter</option>
                <option>Google Search</option>
                <option>Other</option>
              </select>
            </div>

            <hr className="form-divider" />

            <div className="form-group">
              <div className="checkbox-group">
                <label className="checkbox-item">
                  <input type="checkbox" name="terms" required />
                  <span>
                    I agree to FanFest 2026&apos;s Terms &amp; Conditions and
                    Creator Code of Conduct.{" "}
                    <span style={{ color: "var(--c-accent)" }}>*</span>
                  </span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" name="media_consent" />
                  <span>
                    I consent to photos and videos of me being used in FanFest
                    marketing materials.
                  </span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" name="newsletter" />
                  <span>
                    Keep me updated with FanFest news and future opportunities.
                  </span>
                </label>
              </div>
            </div>

            <div className="form-step-btns split">
              <button type="button" className="back-btn" onClick={handleBack}>
                ← Back
              </button>
              <button
                type="submit"
                className={`next-btn${status === "success" ? " success" : ""}`}
                disabled={status === "loading"}
              >
                {status === "loading"
                  ? "Submitting..."
                  : status === "success"
                    ? "Application Submitted!"
                    : "Submit My Application →"}
              </button>
            </div>

            {status === "error" && (
              <p className="form-disclaimer" style={{ color: "var(--c-accent)" }}>
                {errorMessage}
              </p>
            )}

            <p className="form-disclaimer">
              Applications close June 30, 2026. We&apos;ll respond within 5–7
              business days. Limited spots available.
            </p>
          </div>
        </form>
      </div>
    </div>

    {/* Stylized Success Modal Popup */}
    <div
      className={`success-modal-overlay${showSuccessModal ? " open" : ""}`}
      onClick={() => setShowSuccessModal(false)}
    >
      <div
        className="success-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="success-modal-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <h3 className="success-modal-title">APPLICATION RECEIVED</h3>
        <p className="success-modal-msg">
          Thank you for applying to FanFest 2026! We have received your details
          and will review your creator profile within 5–7 business days. A
          confirmation email has been sent.
        </p>
        <button
          type="button"
          className="success-modal-btn"
          onClick={() => setShowSuccessModal(false)}
        >
          Awesome!
        </button>
      </div>
    </div>
  </>
  );
}
