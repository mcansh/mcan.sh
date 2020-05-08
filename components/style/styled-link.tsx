import styled from 'styled-components';

const StyledLink = styled.a`
  --line: var(--links);
  --size: 0.2rem;
  text-decoration: none;
  color: currentColor;
  position: relative;

  span {
    background-image: linear-gradient(0deg, var(--line) 0%, var(--line) 100%);
    background-position: 100% 100%;
    background-repeat: no-repeat;
    background-size: var(--background-size, 100%) var(--size);
    transition: background-size 0.2s linear var(--background-delay, 0.15s);
    transform: translateZ(0);
  }

  svg {
    vertical-align: middle;
    display: inline-block;
    line-height: 1;
    height: 2rem;
    position: relative;
    left: -var(--size);
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-width: var(--size);
    stroke: var(--line);
    stroke-dasharray: 7.95 30;
    stroke-dashoffset: var(--stroke-dashoffset, 46);
    transition: stroke-dashoffset var(--stroke-duration, 0.15s)
      var(--stroke-easing, linear) var(--stroke-delay, 0s);
  }

  &:hover {
    --background-size: 0%;
    --background-delay: 0s;
    --stroke-dashoffset: 26;
    --stroke-duration: 0.3s;
    --stroke-easing: cubic-bezier(0.3, 1.5, 0.5, 1);
    --stroke-delay: 0.195s;
  }
`;

export { StyledLink };
