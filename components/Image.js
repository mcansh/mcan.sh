import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import objectFitImages from 'object-fit-images';
import webp from '../utils/webp';

const StyledImage = styled.img`
  height: 15rem;
  width: 15rem;
  object-fit: cover;
  border-radius: 50%;
  margin: 0 auto;
  font-family: 'object-fit: cover;';
`;

class Image extends Component {
  static propTypes = {
    source: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
  };

  componentDidMount = () => {
    objectFitImages();
  };

  render() {
    const { source, alt, ...props } = this.props;
    const { url, type } = webp(source);

    return (
      <picture {...props}>
        <source srcSet={url} type="image/webp" />
        <source srcSet={source} type={`image/${type}`} />
        <StyledImage src={source} alt={alt} />
      </picture>
    );
  }
}

export default Image;
