import ThemeToggle from "@/components/ThemeToggle";

export default function Nav() {
  return (
    <nav className="nav">
      <a href="#home" className="nav-logo">
        Fan<span>Fest</span> 2026
      </a>
      <div className="nav-actions">
        <ThemeToggle />
        <a href="#apply" className="nav-cta">
          Apply Now
        </a>
      </div>
    </nav>
  );
}
