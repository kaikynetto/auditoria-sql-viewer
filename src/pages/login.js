
import React, { useState } from 'react';
import styled from 'styled-components';
import { FaLock, FaUser } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import Input from '../components/Input';

export default function Login() {

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password })
    });
    const data = await res.json();
    if (data.success) {
      const user_data = {
        username: user,
        password
      }
      localStorage.setItem("user_data", user_data)
      router.push("/viewer")
    } else {
      console.log(data)
      // alert('Login inválido');
    }
  };
  

  return (
    <>
      <LoginBackground>
        <LoginForm onSubmit={handleSubmit}> 
          <Input
            type="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Nome do Usuário"
            icon={<FaUser />}
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPaste={(e) => e.preventDefault()}
            placeholder="Senha"
            icon={<FaLock />}
          />
          <Button text={"Login"} type="submit" /> 
        </LoginForm>
      </LoginBackground>
    </>
  );
}

const LoginBackground = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 300px;
  padding: 20px;
  // background: #fff;
  border-radius: 10px;
`;
