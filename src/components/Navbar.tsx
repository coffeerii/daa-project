type NavbarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

const links = [
  ["home", "Home"],
  ["search", "Search Demo"],
  ["algorithms", "Algorithm Explorer"],
  ["complexity", "Complexity Analysis"],
  ["about", "About"],
];

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="brand">BotikaFinder</div>

      <div className="nav-links">
        {links.map(([page, label]) => (
          <button
            key={page}
            className={currentPage === page ? "active" : ""}
            onClick={() => onNavigate(page)}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}