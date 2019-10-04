import React from 'react';
import { NextPage } from 'next';
import { SimpleImg } from 'react-simple-img';

const Index: NextPage = () => (
  <div
    css={{
      maxWidth: 768,
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingLeft: 16,
      paddingRight: 16,
      paddingTop: 32,
      paddingBottom: 32,
      //
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}
  >
    <SimpleImg
      src="/me.jpg"
      alt="Why it's me, Logan McAnsh"
      height={240}
      width={240}
      placeholder={false}
      imgStyle={{ borderRadius: '50%', marginBottom: '1rem' }}
    />
    <h1
      css={{
        fontSize: '4rem',
      }}
    >
      Logan McAnsh
    </h1>
    <p
      css={{
        fontSize: '2rem',
        textAlign: 'center',
        '@media (max-width: 400px)': {
          fontSize: '1.8rem',
        },
        a: {
          textDecoration: 'none',
          position: 'relative',
          zIndex: 1,
          color: 'currentColor',
          '&::before': {
            content: "''",
            position: 'absolute',
            zIndex: -1,
            top: 0,
            left: '0',
            height: '100%',
            width: '100%',
            backgroundColor: 'var(--links)',
            transformOrigin: 'bottom center',
            transform: 'scaleY(0.1)',
            transition: 'all 0.1s ease-in-out',
          },
          '&:hover::before': {
            transform: 'scaleY(1)',
            backgroundColor: 'hsla(341, 97%, 59%, 0.75)',
          },
        },
      }}
    >
      Making{' '}
      <a href="https://blog.powerley.com/utilities-are-giving-the-home-a-voice-and-a-brain/?utm_source=mcan.sh">
        Advisor
      </a>{' '}
      and Home Profile for <a href="https://www.powerley.com">Powerley</a>.
    </p>
  </div>
);

export default Index;
