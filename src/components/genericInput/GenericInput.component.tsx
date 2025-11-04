
import React, { FC } from "react";

//styles
import { StyledInput } from "./GenericInput.style";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}

const GenericInput: FC<InputProps> = ({ value, onChange, placeholder, type = "text" }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value); 
  };

  return <StyledInput
   value={value} 
   onChange={handleChange}
   placeholder={placeholder} 
   type={type} 
    />;
};

export default GenericInput;