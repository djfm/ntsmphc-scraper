import {
  AnyAction,
} from 'redux';

import {
  SET_PROJECTS,
  ADD_PROJECT,
} from '../actions';

const initialState = [];

const projectsReducer = (state: object[] = initialState, action: AnyAction) => {
  switch (action.type) {
    case SET_PROJECTS: {
      return action.projects;
    }

    case ADD_PROJECT: {
      const projectsWithoutThisOne = state.filter(
        (project: any) => project.id !== action.project.id,
      );
      return [action.project, ...projectsWithoutThisOne];
    }

    default: {
      return state;
    }
  }
};

export default projectsReducer;
