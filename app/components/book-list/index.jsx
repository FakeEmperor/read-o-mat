import React, { Component } from 'react';

import Book from '../book';
import styles from './styles.css';

export default class BookList extends Component {

  componentDidMount() {
    const rootEl = document.getElementById('root');
    rootEl.onscroll = () => {
      if (rootEl.scrollTop + rootEl.offsetHeight >= rootEl.scrollHeight) {
        this.props.onScrollToEnd();
      }
    };
  }

  render() {
    const {
      books,
      favoriteBooks,
      handleClick,
      handleFavoriteClick,
    } = this.props;
    return (
      <ol className={styles.storyList}>
        {books.map(book => (
          <Book
            book={book}
            onClick={handleClick(book)}
            onFavoriteClick={handleFavoriteClick(book)}
            isFavorite={favoriteBooks[book.id]}
            key={book.id}
          />
        ))}
      </ol>
    );
  }
}
