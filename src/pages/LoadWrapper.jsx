import styled, { keyframes } from "styled-components";

const Spinner = () => {
  return <Block />;
};

export function LoadWrapper(props) {
  const { loading, children } = props;

  if (loading) {
    return <Spinner />;
  }

  return children;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  
  to {
    transform: rotate(360deg);
  }
`;

const Block = styled.div`
  width: 15px;
  height: 15px;
  background-color: gray;
  box-shadow: 1px 2px 2px 0px lightgray;
  animation: ${rotate} 2s linear infinite;
`;
