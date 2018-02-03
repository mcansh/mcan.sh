import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  font-size: 1.6rem;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
`;

const FooterContent = styled.div`
  max-width: 60rem;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  z-index: -1;
`;

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <FooterContainer>
      <FooterContent>&copy; {year} Logan McAnsh</FooterContent>
    </FooterContainer>
  );
};

export default Footer;
