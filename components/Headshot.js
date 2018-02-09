import React, { Fragment, Component } from 'react';
import objectFitImages from 'object-fit-images';
import PropTypes from 'prop-types';
import { connect } from 'unistore/react';
import { actions } from '../store';

class Headshot extends Component {
  static propTypes = {
    toggleDark: PropTypes.func.isRequired,
  };

  componentDidMount = () => {
    objectFitImages();
  };

  render() {
    const { toggleDark } = this.props;
    return (
      <Fragment>
        <img
          src="/static/images/11698668.jpg"
          alt="me 💁‍♂️"
          onDoubleClick={toggleDark}
        />
        <style jsx>{`
          img {
            height: 15rem;
            width: 15rem;
            object-fit: cover;
            border-radius: 50%;
            margin: 0 auto;
            font-family: 'object-fit: cover;';
          }
        `}</style>
      </Fragment>
    );
  }
}

export default connect('dark', actions)(Headshot);
