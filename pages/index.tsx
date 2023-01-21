import { useState } from 'react';
import type { NextPage } from 'next';
import styled from '@emotion/styled';

const SomeDiv = styled.div`
  background-color: ${(props) => props.theme.colors.primary};
`;

const Home: NextPage = () => {
  const [counter, setCounter] = useState(0);
  const [disabled, setDisabled] = useState(false);

  return (
    <SomeDiv>
      <h3 data-testid={'counter'}>{counter}</h3>
      <button data-testid={'plus-button'} disabled={disabled} onClick={() => setCounter((counter) => counter + 1)}>
        {'+'}
      </button>
      <button data-testid={'minus-button'} disabled={disabled} onClick={() => setCounter((counter) => counter - 1)}>
        {'-'}
      </button>
      <button
        data-testid={'on/off-button'}
        style={{ backgroundColor: 'blue' }}
        onClick={() => setDisabled((prevState) => !prevState)}>
        {'on/off'}
      </button>
    </SomeDiv>
  );
};

export default Home;
