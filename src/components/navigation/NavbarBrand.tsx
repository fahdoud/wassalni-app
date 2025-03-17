
import { Link } from "react-router-dom";
import GradientText from "../ui-components/GradientText";
import Logo from "../ui-components/Logo";

const NavbarBrand = () => {
  return (
    <Link to="/" className="flex items-center gap-2">
      <Logo size="md" />
      <h1 className="text-2xl font-bold tracking-tight">
        <GradientText>Wassalni</GradientText>
      </h1>
    </Link>
  );
};

export default NavbarBrand;
