import React from 'react';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';

const Signup: React.FC = () => {
  return (
    <div>
      <h2>Signup</h2>
      <form>
        <Input label="Name" type="text" name="name" required />
        <Input label="Email" type="email" name="email" required />
        <Input label="Password" type="password" name="password" required />
        <Button type="submit">Signup</Button>
      </form>
    </div>
  );
};

export default Signup;
