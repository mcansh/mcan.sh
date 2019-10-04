import styled from 'styled-components';

const StyledLink = styled.a`
  text-decoration: none;
  position: relative;
  z-index: 1;
  color: currentColor;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: var(--links);
    transform-origin: bottom center;
    transform: scaleY(0.1);
    transition: all 0.1s ease-in-out;
  }

  &:hover::before {
    transform: scaleY(1);
    background-color: hsla(341, 97%, 59%, 0.75);
  }
`;

export { StyledLink };
