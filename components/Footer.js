import React from 'react';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div>&copy; {year} Logan McAnsh</div>
      <style jsx>{`
        footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 5rem;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: -1;
          font-size: 1.6rem;
        }

        div {
          max-width: 60rem;
          width: 80%;
          margin: 0 auto;
          text-align: center;
          z-index: -1;
        }
      `}</style>
    </footer>
  );
};

export default Footer;