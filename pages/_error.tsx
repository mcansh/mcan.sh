import React from 'react';
import statusCodes from 'http-status';
import styled from 'styled-components';
import Link from '~/components/link';

const ErrorStyles = styled.div`
  color: white;
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  a {
    font-size: 2rem;
  }
`;

const Error = ({ statusCode }: { statusCode: number }) => {
  const statustext = statusCodes[statusCode];

  return (
    <ErrorStyles>
      {statusCode === 404 ? (
        <>
          <h1>404: The page could not be found</h1>
          <Link href="/">Go Home</Link>
        </>
      ) : (
        <p>
          {statusCode} {statustext}
        </p>
      )}
    </ErrorStyles>
  );
};

Error.getInitialProps = ({ res, err }) => {
  if (res) return { statusCode: res.statusCode };
  if (err) return { statusCode: err.statusCode };
  return { statusCode: 404 };
};

export default Error;
