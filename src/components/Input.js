import React from 'react'
import styled from 'styled-components'
import { FaUser } from 'react-icons/fa' 

export default function Input({ label, type = 'text', value, onChange, placeholder, icon }) {
  return (
    <InputWrapper>
      {label && <Label>{label}</Label>}
      <InputContainer>
        {icon && <Icon>{icon}</Icon>}
        <StyledInput
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      </InputContainer>
    </InputWrapper>
  )
}

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Label = styled.label`
  font-weight: 500;
  color: #333;
`

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const Icon = styled.div`
  position: absolute;
  left: 12px;
  margin-top: 5px;
  color: #888;
  font-size: 1.2rem;
`

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem; 
  border: 2px solid var(--secondary-color);
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  font-weight: 500;
  transition: border-color 0.3s;
  background: transparent;
  color: var(--text-color);

  &:focus {
    border: 3px solid var(--third-color);
  }
`
