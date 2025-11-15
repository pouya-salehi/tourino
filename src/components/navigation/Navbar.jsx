import NavAuth from "./NavAuth";
import NavLinks from "./NavLinks";
function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 ">
      <div>
        <NavLinks />
      </div>
      <div>
        <NavAuth />
      </div>
    </nav>
  );
}

export default Navbar;
