import React from 'react';

// eslint-disable-next-line import/prefer-default-export
export const wrapFeedback = (messages: string[]): any => {
  if (messages.length === 0) {
    return null;
  }

  return (
    <ul>
      { messages.map((message) => (<li key={message}>{message}</li>)) }
    </ul>
  );
};
