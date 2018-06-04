import styled from 'styled-components';

const Text = styled.p`
  font-size: 1.8rem;
  margin: 0;
  max-width: 60rem;
  color: ${props => props.theme.text};
`;

export default Text;
