import {
  AnyAction,
} from 'redux';

import {
  SET_PROJECTS,
} from '../actions';

const initialState = [];

const projectsReducer = (state: object[] = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_PROJECTS: {
      return action.projects;
    }

    default: {
      return state;
    }
  }
};

export default projectsReducer;
