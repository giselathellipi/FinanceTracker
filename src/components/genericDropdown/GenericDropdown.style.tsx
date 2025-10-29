import styled from "styled-components";

export const StyledSelect = styled.select`
  padding: 10px;
  margin: 10px 0;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  width: 100%;
  color: ${(props) => (props.value ? "#333" : "#999")};
  &:focus {
    outline: none;
    border-color: #16324f;
  }

  option[disabled] {
    color: #999; 
  }
`;
export const AddIconButton = styled.button`
  height: 42px;
  width: 49px;
  margin-top:10px;
  // display: flex;
  align-items: center;
  justify-content: center;
  background-color: #16324f;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: white;

  &:hover {
    background-color: #273d54ff;
  }

  &:active {
    background-color: #004099;
  }

  svg {
    pointer-events: none;
  }
`;