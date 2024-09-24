import React from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const Login: React.FC = () => {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <Input label="Email" type="email" name="email" required />
        <Input label="Password" type="password" name="password" required />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default Login;
