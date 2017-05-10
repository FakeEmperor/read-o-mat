import { take, put, call, fork } from 'redux-saga/effects';
import moment from 'moment';
import electron from 'electron';
import * as actions from '../actions'

function fetchBook(bookId) {
  return fetch(`https://hacker-news.firebaseio.com/v0/item/${bookId}.json?print=pretty`)
          .then(response => response.json());
}

function fetchTopBooksApi() {
  return fetch(`https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty`)
          .then(response => response.json())
          .then(books => books.map(storyId => ({ id: storyId, loaded: false, loading: false })));
}

function* watchRequestTopBooks(getState) {
  while (true) {
    const { limit } = yield take(actions.REQUEST_BOOKS);
    try {
      const allBooks = yield call(fetchTopBooksApi);
      yield put(actions.fetchedBooks(allBooks));

      const books = allBooks.filter(book => {
        const bookFromState = getState().books.find(s => s.id === book.id);
        if (!bookFromState) {
          return true;
        }
        if (!bookFromState.loaded) {
          return true;
        }
        return false;
      }).slice(0, limit);

      yield books.map(function* (book) {
        yield call(updateBook, book);
      });
    } catch (ex) {
      console.log('error while fetching books', ex);
    }
  }
}

function* updateBook(book) {
  yield put(actions.fetchingBook(book));
  try {
    const data = yield call(fetchBook, book.id);
    yield put(actions.fetchedBook(data));
  } catch (e) {

  }
}

function* watchRequestUpdateBook() {
  while (true) {
    const { book } = yield take(actions.REQUEST_UPDATE_BOOK);
    yield fork(updateBook, book);
  }
}

const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

function* startAutoRequestBooks() {
  while (true) {
    yield call(delay, 3600 * 1000); // fetch new stories every hour
    yield put(actions.requestBooks());
  }
}

function* startAutoUpdateBooks(getState) {
  while (true) {
    yield getState().books
      .filter(book => // update stories that haven't been updated within the past hour and are not older than 1 day
        book.loaded && moment().diff(moment(book.updated)) > 3600 * 1000)// && moment().diff(moment.unix(story.time)) < 3600 * 1000 * 24)
      .map(book => call(updateBook, book));
    yield call(delay, 60 * 10 * 1000); // update loaded stories every 10 minutes
  }
}

function* notifyAboutBook(book, dispatch) {
  yield put(actions.notifyAboutBook(book, () => {
    console.log(book);
    electron.shell.openExternal(book.url);
    dispatch(actions.clickedBook(book));
  }));
}

function* watchFetchedBook(getState, dispatch) {
  while (true) {
    const { book } = yield take(actions.FETCHED_BOOK);
    const { scoreLimit } = getState().filter;
    if (book.score >= scoreLimit && getState().seenBooks.indexOf(book.id) === -1) {
      yield fork(notifyAboutBook, book, dispatch);
    }
  }
}

export default function* root() {
  const { store } = yield take('APP_INIT');
  yield fork(watchRequestTopBooks, store.getState);
  yield fork(watchRequestUpdateBook);
  yield fork(startAutoUpdateBooks, store.getState);
  yield fork(watchFetchedBook, store.getState, store.dispatch);
  yield fork(startAutoRequestBooks);
  yield put(actions.requestBooks());
}
