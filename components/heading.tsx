import styled from 'styled-components';

const Heading = styled.h1`
  text-align: center;
  font-size: 4rem;
  font-weight: 400;
  margin: 2rem 0;
  max-width: 60rem;
  color: ${props => props.theme.text};
  @media (prefers-color-scheme: light) {
    color: black;
  }
`;

export default Heading;
