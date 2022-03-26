import "./info-text.css";

interface Props {
  text: string;
}

const InfoText = ({ text }: Props): JSX.Element => {
  return <p className="info-text">{text}</p>;
};

export default InfoText;
