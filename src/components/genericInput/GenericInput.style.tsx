import styled from "styled-components";

export const StyledInput = styled.input`
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  &:focus {
    outline: none;
    border-color: #16324f;
  }
  &::placeholder {
    color: #999; 
  }
`;