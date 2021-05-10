import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Example = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times.</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Click me!
      </button>
    </div>
  );
};

const rootElement = document.getElementById('appRoot');
ReactDOM.render(<Example />, rootElement);
