import styled from "styled-components";

export const SummaryContainer = styled.div`
  width: 100%;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const SummaryBox = styled.div`
  background-color: #16324f;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  h1 {
    font-size: 24px;
    color: #ffffff;
    margin: 10px 0
  }
  p {
    color: #ffffff;
    margin: 8px 0;
    font-size: 16px;
  }

  select {
    gap: 18px;
    margin-top: 10px;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
    span{
    gap:10px}
`;

