import auth0 from "auth0-js";
import { navigate } from "gatsby";

// perform a check to see if app is open in a browser
const isBrowser = typeof window !== "undefined";

// initialize a new instance of the auth0 application with params
const auth = isBrowser
  ? new auth0.WebAuth({
      domain: process.env.GATSBY_AUTH0_DOMAIN,
      clientID: process.env.GATSBY_AUTH0_CLIENTID,
      redirectUri: process.env.GATSBY_AUTH0_CALLBACK,
      responseType: "token id_token",
      scope: "openid profile email",
    })
  : {};

// initialize tokens
const tokens = {
  accessToken: false,
  idToken: false,
  expiresAt: false,
};

// declares empty user object
let user = {};

export const isAuthenticated = () => {
  if (!isBrowser) {
    return;
  }
  // check localstorage if isLoggedIn has been set to true
  return localStorage.getItem("isLoggedIn") === "true";
};

export const login = () => {
  if (!isBrowser) {
    return;
  }
  // logs user in using auth0 universal login
  auth.authorize();
};

const setSession = (cb = () => {}) => (err, authResult) => {
  if (err) {
    navigate("/");
    cb();
    return;
  }

  // if login is successful with accessToken and idToken
  // set expiration, token values / user, and set isLoggedIn in localstorage to true
  // then takes user to account page
  if (authResult && authResult.accessToken && authResult.idToken) {
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    tokens.accessToken = authResult.accessToken;
    tokens.idToken = authResult.idToken;
    tokens.expiresAt = expiresAt;
    // set value of user object
    user = authResult.idTokenPayload;
    localStorage.setItem("isLoggedIn", true);
    navigate("/account");
    cb();
  }
};

export const handleAuthentication = () => {
  if (!isBrowser) {
    return;
  }

  // uses auth0 parseHash extract the results of an auth0 authentication response
  auth.parseHash(setSession());
};

export const getProfile = () => {
  return user;
};

// silentAuth allows the app to remember if the user was logged in after a page refresh
export const silentAuth = (callback) => {
  if (!isAuthenticated()) return callback();
  auth.checkSession({}, setSession(callback));
};

// on logout, set the isLoggedin flag back to false
// and use auth0 logout method
export const logout = () => {
  localStorage.setItem("isLoggedIn", false);
  auth.logout();
};
