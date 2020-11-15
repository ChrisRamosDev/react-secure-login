import React from 'react';
import { Router } from '@reach/router';
import { login, logout, isAuthenticated, getProfile } from '../utils/auth';
import { Link } from 'gatsby';

const Home = ({ user }) => (
  <p>Welcome{user.name ? `, ${user.name}` : ' home'}!</p>
);
const Settings = () => <p>Settings Page</p>;
const MembersArea = () => <p>Welcome to the Members Only page!</p>;

const Account = () => {
  if (!isAuthenticated()) {
    login();
    return <p>Redirecting to Login page...</p>;
  }

  const user = getProfile();
  return (
    <>
      <nav>
        <Link to="/account">Home</Link>{' '}
        <Link to="/account/settings">Settings</Link>{' '}
        <Link to="/account/members">Members Only</Link>{' '}
        <a
          href="#logout"
          onClick={(e) => {
            logout();
            e.preventDefault();
          }}
        >
          Log Out
        </a>
      </nav>
      <Router>
        <Home path="/account" user={user} />
        <Settings path="/account/settings" />
        <MembersArea path="/account/members" />
      </Router>
    </>
  );
};

export default Account;
