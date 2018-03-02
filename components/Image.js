import React, { Component } from 'react';
import PropTypes from 'prop-types';
import objectFitImages from 'object-fit-images';
import webp from '../utils/webp';

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
    return (
      <picture {...props}>
        <source srcSet={webp(source).url} type="image/webp" />
        <source srcSet={source} type={`image/${webp(source).type}`} />
        <img src={source} alt={alt} />
        <style jsx>{`
          img {
            height: 15rem;
            width: 15rem;
            object-fit: cover;
            border-radius: 50%;
            margin: 0 auto;
            font-family: 'object-fit: cover;';
          }
        `}</style>
      </picture>
    );
  }
}

export default Image;
