import React from 'react';
import { handleAuthentication } from '../utils/auth';

const CallBack = () => {
  handleAuthentication();

  return <p>Loading...</p>;
};

export default CallBack;
