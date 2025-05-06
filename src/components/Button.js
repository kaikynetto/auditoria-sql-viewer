import React from 'react';
import styled from 'styled-components';

const GreenButton = styled.button`
  background-color: var(--third-color2); /* Cor verde */
  color: white;rgb(12, 20, 14)
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  padding: 10px;
  font-weight: 700;
  
  &:hover {
     /* Verde mais escuro ao passar o mouse */
     opacity: 0.8;
  }

  &:focus {
    outline: none; /* Remove a borda ao focar */
  }
`;

const Button = ({text}) => {
  return (
    <GreenButton>{text}</GreenButton>
  );
};

export default Button;
