import logo from "../assets/chitkara-logo.jpg";

function BrandLogo({ className = "logo-mark" }) {
  return (
    <span className={className}>
      <img src={logo} alt="" />
    </span>
  );
}

export default BrandLogo;
