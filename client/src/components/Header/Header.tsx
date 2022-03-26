import "./header.css";

interface Props {
  children: JSX.Element | JSX.Element[];
}

const Header = ({ children }: Props): JSX.Element => {
  return <header className="header">{children}</header>;
};

export default Header;
