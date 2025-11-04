import styled from "styled-components";

export const TransactionsContainer = styled.div`
  width: 80%;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;
export const TransactionsTableContainer = styled.div`
  // background-color: #16324f;
  // padding: 15px;
  // border-radius: 12px;
  // box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);
  margin:20px 0;
`
export const FiltersContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;
export const SummaryBox = styled.div`
  background-color: #f9fafc;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.05);

  p {
    margin: 8px 0;
    font-size: 16px;
  }

  select {
    margin-top: 10px;
    padding: 6px 8px;
    border-radius: 6px;
    border: 1px solid #ccc;
  }
`;


export const SummaryAndChartContainer = styled.div`
  display: flex;
  @media (max-width: 768px) {
    flex-direction: column;
  }
  `
  export const PieChartContainer = styled.div`
  flex: 1;
  `
  export const SummarySectionContainer = styled.div`
  flex:1
  `
