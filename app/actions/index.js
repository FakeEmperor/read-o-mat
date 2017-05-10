/**
 * Created by Raaw on 5/9/2017.
 */
export const REQUEST_BOOK = 'REQUEST_BOOK';
export const FETCHED_BOOK = 'FETCHED_BOOK';

export const REQUEST_BOOKS = 'REQUEST_BOOKS';
export const FETCHED_BOOKS = 'FETCHED_BOOKS';

export const FETCHING_BOOK = 'FETCHING_BOOK';

export const REQUEST_UPDATE_BOOK = 'REQUEST_UPDATE_BOOK';
export const NOTIFY_ABOUT_BOOK = 'NOTIFY_ABOUT_BOOK';
export const CLICKED_BOOK = 'CLICKED_BOOK';
export const MARK_ALL_AS_READ = 'MARK_ALL_AS_READ';
export const UPDATE_SCORE_LIMIT = 'UPDATE_SCORE_LIMIT';
export const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
export const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
export const SWITCH_TAB = 'SWITCH_TAB';

export function requestBooks(limit = 50) {
    return {
        type: REQUEST_BOOKS,
        limit
    };
}

export function fetchedBooks(books) {
    return {
        type: FETCHED_BOOKS,
        books
    };
}

export function requestBook(limit = 50) {
    return {
        type: REQUEST_BOOK,
        limit
    };
}

export function fetchedBook(book) {
    return {
        type: FETCHED_BOOK,
        book
    };
}

export function fetchingBook(book) {
    return {
        type: FETCHING_BOOK,
        book
    };
}

export function updateScoreLimit(newScoreLimit) {
    return {
        type: UPDATE_SCORE_LIMIT,
        newScoreLimit
    }
}

export function requestUpdateBook(book) {
    return {
        type: REQUEST_UPDATE_BOOK,
        book
    }
}

export function notifyAboutBook(book, onClick) {
    const notification = new Notification(`Hacker News ${book.score} 👍💥 votes`, {
        body: book.title
    });
    notification.onclick = onClick;

    return {
        type: NOTIFY_ABOUT_BOOK,
        book
    };
}

export function clickedBook(book) {
    return {
        type: CLICKED_BOOK,
        book
    };
}

export function markAllAsRead(book) {
    return {
        type: MARK_ALL_AS_READ,
        book
    };
}

export function addToFavorites(book) {
    return {
        type: ADD_TO_FAVORITES,
        book
    };
}

export function removeFromFavorites(book) {
    return {
        type: REMOVE_FROM_FAVORITES,
        book
    };
}

export function switchTab(newTab) {
    return {
        type: SWITCH_TAB,
        newTab
    };
}
