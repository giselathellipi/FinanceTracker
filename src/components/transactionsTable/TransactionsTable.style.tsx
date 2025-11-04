import styled from "styled-components";

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;

  th,
  td {
    border: 1px solid #ddd;
    padding: 10px 14px;
    text-align: left;
  }

  th {
    background-color: #16324f;
    color: white;
  }

  tr:nth-child(even) {
    background-color: #f5f7fa;
  }
`;
  export const IconsContainer = styled.div`
  display: flex;
  gap:8px
  `