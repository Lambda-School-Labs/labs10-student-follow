import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Image from './LandingImage.jpg';
import Logo from './logo.png';
import './LandingPage.css';
import OtherNavBar from '../navigation/OtherNavBar';

const style = {
  position: 'absolute',
  width: '100%',
  margin: 0,
  padding: 0
};

const LandingPage = props => {
  return (
    <div className="container">
      <div style={style}>
        <OtherNavBar />
        <div className="text">
          <h1>Refreshr</h1>
          <p>
            Test your students over weeks or months. Help them learn for the
            long-term.
          </p>
        </div>
      </div>
      <img className="background-img" alt="image" src={Image} />
    </div>
  );
};

export default withRouter(LandingPage);
