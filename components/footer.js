import React from 'react'
import styled from 'styled-components'

const FooterContainer = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  z-index: -1;
`

const FooterContent = styled.div`
  max-width: 600px;
  width: 80%;
  margin: 0 auto;
  text-align: center;
  z-index: -1;
`

const Footer = (props) => {
  return(
    <FooterContainer>
      <FooterContent>&copy; 2017 Logan McAnsh</FooterContent>
    </FooterContainer>
  )
}

export default Footer
