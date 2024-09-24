// create not found page component
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <h1>404 - Not Found!</h1>
          <Link to="/">Go Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;