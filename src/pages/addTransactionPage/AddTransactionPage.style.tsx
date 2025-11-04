import styled from "styled-components";

export const AddTransactionContainer = styled.div`
    display: flex;
    height: 100%;
    margin: 15px 0;
`;

export const AddTransactionFormHolder = styled.form`
    margin: auto;
    width: 100%;
    max-width: 400px;
    background: #ffffff;
    box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 10px 20px 25px 20px;
    @media screen and (max-width: 760px) {
    box-shadow:none;
    }
`;
export const TransactionTitle=styled.h1`
     text-align: center;
     font-family: "Space Grotesk", sans-serif;
     font-style: normal;
     color: #16324f; 
     font-size:24px;
`
export const InputsContainer= styled.div`
  margin: 30px;
`;

export const AddTransactionInput = styled.div`
  flex: 1;
  margin: 30px;
`;

