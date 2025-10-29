import  { FC } from "react";

//styles
import { ContainerButton, StyledButton } from "./GenericButton.style";

// Define the props interface
interface ButtonProps {
  name: string;
  onClick: () => void;
}

const GenericButton: FC<ButtonProps> = ({ name, onClick }) => {
  return <ContainerButton><StyledButton onClick={onClick}>{name}</StyledButton></ContainerButton>
};

export default GenericButton;