import "./styles.module.scss";

import logo from "../../../assets/logo.png";

export function Header() {
  return (
    <header>
      <img src={logo} alt="logo-shop-list" />
    </header>
  );
}
