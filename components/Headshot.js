import React, { Fragment } from 'react';
import Image from './Image';
import { Consumer } from '../pages/_app';

const Headshot = () => (
  <Consumer>
    {context => {
      const toggleDark = e => {
        e.preventDefault();

        context.toggleTheme();
      };

      return (
        <Fragment>
          <Image
            source="/static/images/11698668.png"
            alt="me 💁‍♂️"
            onDoubleClick={toggleDark}
            onContextMenu={toggleDark}
          />
        </Fragment>
      );
    }}
  </Consumer>
);

export default Headshot;
