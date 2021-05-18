import React from 'react';
import {
  Link,
} from 'react-router-dom';

const Home = () => (
  <div>
    Welcome home!
    <div>
      <p>Humans, please ignore the following links, they are used for testing:</p>
      <nav>
        <ul>
          <li>
            <Link to="/a-404">A 404-error page - from the server - used for testing</Link>
          </li>
          <li>
            <Link to="/a-500">A 500-error page - from the server - used for testing</Link>
          </li>
        </ul>
      </nav>
    </div>
  </div>
);

export default Home;
