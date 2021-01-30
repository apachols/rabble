import React, { ReactNode }  from "react";

import { RouteComponentProps, withRouter } from 'react-router-dom';

import { AuthConfig } from "react-use-auth";
// @ts-ignore
import { Auth0 } from "react-use-auth/auth0";


interface AuthProviderProps extends RouteComponentProps<any> {
  children: ReactNode
}
const AuthProvider = (props: AuthProviderProps) => (
  <AuthConfig
    navigate={props.history.push}
    authProvider={Auth0}
    params={{
      redirectUri: "http://localhost:3000/auth-callback",
      domain: process.env?.REACT_APP_AUTH_DOMAIN,
      clientID: process.env?.REACT_APP_AUTH_CLIENT_ID
    }}
  >
    {props.children}
  </AuthConfig>
);

export default withRouter(AuthProvider);