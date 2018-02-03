import React, { Component } from 'react';
import objectFitImages from 'object-fit-images';
import styled from 'styled-components';

const Img = styled.img`
  height: 15rem;
  width: 15rem;
  object-fit: cover;
  font-family: 'object-fit: cover;';
  border-radius: 50%;
  margin: 0 auto;
`;

class Headshot extends Component {
  componentDidMount = () => {
    objectFitImages();
  };

  render() {
    return <Img src="/static/images/11698668.jpg" alt="me 💁‍♂️" />;
  }
}

export default Headshot;
