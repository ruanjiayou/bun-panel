import styled from "styled-components";

export const Right = styled.div`
  text-align: right;
  flex: 1;
`;

export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const AlignAside = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AlignAround = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const AlignVertical = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
`;

export const FullHeight = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const FullHeightFix = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

export const FullHeightAuto = styled.div`
  /* flex-grown flex-shink flex-basis */
  flex: 1;
  overflow-y: auto;
`;

export const FullWidth = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
`;

export const FullWidthFix = styled.div`
  display: flex;
  flex-direction: row;
`;

export const FullWidthAuto = styled.div`
  flex: 1;
`;

export const Padding = styled.div`
  padding: 15px;
`

export const PaddingSide = styled.div`
  padding: 0 15px;
`


export const FormItem = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: row;
`
export const FormLabel = styled.div`
  text-align: right;
  padding-right: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: end;
  font-size: 14px;
  @media (min-width: 768px) {
    width: 150px;
  }
  @media (max-width: 767px) {
    width: 80px;
  }
`