import styled from "styled-components";

export const StyledButton = styled.button`
    border: 1px;
    background: #16324f;
    border-radius: 4.3px;
    font-family: "Space Grotesk", sans-serif;
    font-size: 16px;
    cursor: pointer;
    color: #ffffff;
    width: 100%;
    max-width: 146px;
    height: 42px;
  &:hover {
    background-color: #273d54ff;
  }
`;
export const ContainerButton= styled.div`
 display: flex;
    justify-content: center;
    z-index: 4;`