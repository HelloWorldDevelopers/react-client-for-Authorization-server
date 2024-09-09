import React, { useEffect } from 'react';

const Ssologin = () => {
  useEffect(() => {
     const clientId = 'customer';
    const redirectUri = 'http://localhost:3001/redirect'; // Ensure this matches your registered redirect URI
    const authorizationEndpoint = 'http://localhost:8080/oauth2/authorize';
    const codeChallenge = 'XhuoHNOdoZNrut2tWrA_4yJAlGiaJHUi1UGAayk1Sck'; // Ensure this matches the challenge used during authorization
    const secret="cus";
    const authorizationRequest = `${authorizationEndpoint}?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid&code_challenge=${codeChallenge}&code_challenge_method=S256&client_secret=${secret}`;

    window.location.href = authorizationRequest; // Automatically redirect to authorization server
  }, []);

  return <div>Redirecting to login...</div>;
};

export default Ssologin;