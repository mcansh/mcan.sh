import React, { Fragment, Component } from 'react';
import objectFitImages from 'object-fit-images';

class Headshot extends Component {
  componentDidMount = () => {
    objectFitImages();
  };

  render() {
    return (
      <Fragment>
        <img src="/static/images/11698668.jpg" alt="me 💁‍♂️" />
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

export default Headshot;
