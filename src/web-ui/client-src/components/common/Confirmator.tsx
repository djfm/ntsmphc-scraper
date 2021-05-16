import React,
{
  // TODO replace all of my BaseSyntheticEvent with SyntheticEvent
  SyntheticEvent,
  useState,
} from 'react';

const Confirmator = ({ children, action }) => {
  const [clickAttempted, setClickAttempted] = useState(false);

  const handleClickCapture = (event: SyntheticEvent) => {
    event.stopPropagation();
    setClickAttempted(true);
  };

  const handleSaidNo = (event: SyntheticEvent) => {
    event.stopPropagation();
    setClickAttempted(false);
  };

  const handleSaidYes = (event: SyntheticEvent) => {
    setClickAttempted(false);
    action(event);
  };

  const baseUI = () => (
    <div onClickCapture={handleClickCapture}>
      {children}
    </div>
  );

  const clickAttemptedUI = () => (
    <div>
      <p>Are you sure ?</p>
      <ul>
        <li>
          <p>
            <button type="button" onClick={handleSaidNo}>
              No
            </button>
          </p>
        </li>
        <li>
          <p>
            <button type="button" onClick={handleSaidYes}>
              Yes
            </button>
          </p>
        </li>
      </ul>
    </div>
  );

  return clickAttempted ? clickAttemptedUI() : baseUI();
};

export default Confirmator;
