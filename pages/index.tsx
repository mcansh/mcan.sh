import React from 'react';
import { NextPage } from 'next';
import { SimpleImg } from 'react-simple-img';
import { Link } from '@mcansh/custom-next-link';
import { motion } from 'framer-motion';

import { StyledLink } from '~/components/style/styled-link';

const Index: NextPage = () => (
  <motion.div
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
    initial={{ y: -80, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      type: 'spring',
      damping: 40,
      stiffness: 200,
    }}
  >
    <SimpleImg
      src="/me.jpg"
      alt="Why it's me, Logan McAnsh"
      height={240}
      width={240}
      placeholder="transparent"
      imgStyle={{ borderRadius: '50%' }}
      style={{ marginBottom: '1rem' }}
    />
    <h1
      css={{
        fontSize: '4rem',
        fontWeight: 'normal',
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
      }}
    >
      Making{' '}
      <Link
        href="https://blog.powerley.com/utilities-are-giving-the-home-a-voice-and-a-brain/?utm_source=mcan.sh"
        passHref
      >
        <StyledLink>Advisor</StyledLink>
      </Link>{' '}
      and Home Profile for{' '}
      <Link href="https://www.powerley.com" passHref>
        <StyledLink>Powerley</StyledLink>
      </Link>
      .
    </p>
  </motion.div>
);

export default Index;
