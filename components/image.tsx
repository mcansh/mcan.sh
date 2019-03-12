import React, { useEffect } from 'react';
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

interface Props {
  source: string;
  alt: string;
}

const Image = ({ source, alt }: Props) => {
  useEffect(() => {
    objectFitImages();
  }, []);

  const { url, type } = webp(source);

  return (
    <picture>
      <source srcSet={url} type="image/webp" />
      <source srcSet={source} type={`image/${type}`} />
      <StyledImage src={source} alt={alt} />
    </picture>
  );
};

export default Image;
