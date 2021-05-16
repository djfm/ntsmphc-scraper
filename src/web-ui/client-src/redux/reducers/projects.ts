import {
  AnyAction,
} from 'redux';

import {
  SET_PROJECTS,
  ADD_PROJECT,
  DELETE_PROJECT,
} from '../actions';

export type Project = {
  id: number;
  projectName: string;
  startURL: string;
  createdAt: number;
};

const initialState: Project[] = [];

const projectsReducer = (state: Project[] = initialState, action: AnyAction) => {
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

    case DELETE_PROJECT: {
      return state.filter(({ id }) => id !== action.projectId);
    }

    default: {
      return state;
    }
  }
};

export default projectsReducer;
