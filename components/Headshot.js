import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'unistore/react';
import { actions } from '../store';
import Image from './Image';

class Headshot extends React.PureComponent {
  static propTypes = {
    toggleDark: PropTypes.func.isRequired,
  };

  actuallyToggleDark = e => {
    e.preventDefault();
    this.props.toggleDark();
  };

  render() {
    return (
      <Fragment>
        <Image
          source="/static/images/11698668.png"
          alt="me 💁‍♂️"
          onDoubleClick={this.actuallyToggleDark}
          onContextMenu={this.actuallyToggleDark}
        />
      </Fragment>
    );
  }
}

export default connect('dark', actions)(Headshot);
