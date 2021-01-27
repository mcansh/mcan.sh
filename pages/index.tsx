import React from 'react';
import type { NextPage } from 'next';
import Image from 'next/image';
import { Link } from '@mcansh/custom-next-link';
import { motion } from 'framer-motion';

import { FunHoverLink } from '~/components/style/styled-link';

const Index: NextPage = () => (
  <motion.div
    className="flex flex-col items-center justify-center h-full max-w-screen-md px-4 py-8 mx-auto "
    initial={{ y: -80, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{
      type: 'spring',
      damping: 40,
      stiffness: 200,
    }}
  >
    <div className="flex flex-col items-center justify-center flex-1">
      <Image
        src="/me.jpg"
        alt="Why it's me, Logan McAnsh"
        height={240}
        width={240}
        placeholder="transparent"
        className="rounded-full"
      />
      <h1 className="mt-4 text-4xl">Logan McAnsh</h1>
      <p className="text-lg text-center sm:text-xl">
        Making{' '}
        <Link
          href="https://blog.powerley.com/utilities-are-giving-the-home-a-voice-and-a-brain/?utm_source=mcan.sh"
          passHref
        >
          <FunHoverLink>Advisor</FunHoverLink>
        </Link>{' '}
        and Home Profile for{' '}
        <Link href="https://www.powerley.com" passHref>
          <FunHoverLink>Powerley</FunHoverLink>
        </Link>
      </p>
    </div>
    <Link href="https://resume.mcan.sh">
      <FunHoverLink>Resume</FunHoverLink>
    </Link>
  </motion.div>
);

export default Index;
