import "./box.css";

interface Props {
  title: string;
  children: JSX.Element;
}

const Box = ({ title, children }: Props): JSX.Element => {
  return (
    <div className="box">
      <header>
        <h5>{title}</h5>
      </header>
      <section>{children}</section>
    </div>
  );
};

export default Box;
