import styled from 'styled-components';

const Text = styled.p`
  font-size: 1.8rem;
  margin: 0;
  max-width: 60rem;
  color: ${props => props.theme.text};

  @media (prefers-color-scheme: light) {
    color: black;
  }
`;

export default Text;
