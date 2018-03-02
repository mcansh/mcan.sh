import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'unistore/react';
import { actions } from '../store';
import Image from './Image';

const Headshot = ({ toggleDark }) => (
  <Fragment>
    <Image
      source="/static/images/11698668.jpg"
      alt="me 💁‍♂️"
      onDoubleClick={toggleDark}
    />
  </Fragment>
);

Headshot.propTypes = {
  toggleDark: PropTypes.func.isRequired,
};

export default connect('dark', actions)(Headshot);
