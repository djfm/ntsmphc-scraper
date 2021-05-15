import { AnyAction } from 'redux';

import {
  NOTIFY_PAGE_SCRAPED,
  PageScrapedAction,
} from '../actions';

const initialState = {};

const scrapingReducer = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case NOTIFY_PAGE_SCRAPED: {
      const scrapedAction = action as PageScrapedAction;
      console.log(scrapedAction.result);
      return state;
      break;
    }

    default: {
      return state;
    }
  }
};

export default scrapingReducer;
