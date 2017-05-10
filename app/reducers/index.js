import { combineReducers } from 'redux';
import * as actions from '../actions';

const filterInitialState = {
  activeTab: 'topBooks',
  scoreLimit: 200
};
const filterReducer = (state = filterInitialState, action) => {
  switch (action.type) {
    case actions.UPDATE_SCORE_LIMIT:
      return {
        ...state,
        scoreLimit: action.newScoreLimit
      };
    case actions.SWITCH_TAB:
      return {
        ...state,
        activeTab: action.newTab
      };
    default:
      return state;
  }
};

const booksInitialState = [];
const booksReducer = (state = booksInitialState, action) => {

  switch (action.type) {
    case actions.FETCHED_BOOKS:
      return action.books.map(book => {
        const stateBook = state.find(s => s.id === book.id);
        if (stateBook && stateBook.loaded) {
          return stateBook;
        }
        return book;
      });
    case actions.FETCHING_BOOK:
      action.book = {
        ...action.book,
        loading: true
      };
      return state.map(book => {
        if (book.id === action.book.id) {
          return action.book;
        }
        return book;
      });
    case actions.FETCHED_BOOK:
      action.book = {
        ...action.book,
        updated: new Date(),
        loading: false,
        loaded: true
      };
      if (!action.book.url) {
        action.book.url = `https://news.ycombinator.com/item?id=${action.book.id}`;
      }
      return state.map(book => {
        if (book.id === action.book.id) {
          return {
            ...book,
            ...action.book,
          };
        }
        return book;
      });
    case actions.CLICKED_BOOK:
      return state.map(book => {
        if (book.id === action.book.id) {
          return {
            ...book,
            seen: true
          };
        }
        return book;
      });
    case actions.MARK_ALL_AS_READ:
      console.log("booksReducer::");
      return state.map(book => {
        if (action.books.find(s => s.id === book.id)) {
          return {
            ...book,
            seen: true
          };
        }
        return book;
      });
    default:
      return state;
  }
};


const seenBooksInitialState = [];
const seenBooksReducer = (state = seenBooksInitialState, action) => {
  switch (action.type) {
    case actions.NOTIFY_ABOUT_BOOK:
      return state.concat([action.book.id]);
    case actions.MARK_ALL_AS_READ:
      console.log("I HAVE FIRED!!");
      return state
        .concat(action.books.map(book => book.id))
        .filter(id => action.books.some(s => s.id === id)) // remove old books
        .sort()
        .reduce((arr, id) => (arr.length > 0 && arr[arr.length - 1] === id) ? arr : [...arr, id], []);
    default:
      return state;
  }
};

const favoriteBooksInitialState = {};
const favoriteBooksReducer = (state = favoriteBooksInitialState, action) => {
  switch (action.type) {
    case actions.ADD_TO_FAVORITES:
      state[action.book.id] = {
        ...action.book,
        seen: false
      };
      return state;
    case actions.REMOVE_FROM_FAVORITES:
      delete state[action.book.id];
      return state;
    default:
      return state;
  }
};

export default combineReducers({
  filter: filterReducer,
  books: booksReducer,
  seenBooks: seenBooksReducer,
  favoriteBooks: favoriteBooksReducer
});
