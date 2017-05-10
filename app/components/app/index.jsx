import React, { Component } from 'react';
import electron, { ipcRenderer } from 'electron';
import moment from 'moment';

import * as actions from '../../actions';
import styles from './styles.css';
import BookList from '../book-list';

export default class App extends Component {

  handleClick(book) {
    return (e) => {
      electron.shell.openExternal(book.url);
      this.props.dispatch(actions.clickedBook(book));
    };
  }

  handleFavoriteClick(book) {
    return (e) => {
      if (this.props.getState().favoriteBooks[book.id]) {
        this.props.dispatch(actions.removeFromFavorites(book));
      } else {
        this.props.dispatch(actions.addToFavorites(book));
      }
    };
  }

  render() {
    const { books, filter, favoriteBooks } = this.props.getState();
    const booksBeingLoaded = books.filter(s => s.loading).length;

    let content, filteredBooks;
    switch (filter.activeTab) {
      case 'topStories':
        filteredBooks = books.filter(s => s.loaded && s.score >= filter.scoreLimit);
        content = <BookList
          books={filteredBooks}
          favoriteBooks={favoriteBooks}
          handleClick={::this.handleClick}
          handleFavoriteClick={::this.handleFavoriteClick}
          onScrollToEnd={() => this.props.dispatch(actions.requestBooks())} />;
        break;
      case 'favoriteBooks':
        content = <BookList
          books={Object.keys(favoriteBooks).map(key => favoriteBooks[key])}
          favoriteBooks={favoriteBooks}
          handleClick={::this.handleClick}
          handleFavoriteClick={::this.handleFavoriteClick}
          onScrollToEnd={() => this.props.dispatch(actions.requestBooks())} />;
        break;
      default:
        break;
    }

    return (
      <div>
        <div className={styles.header}>
          <h1 onClick={() => electron.shell.openExternal(`https://news.ycombinator.com/`)}>
            Hacker News
          </h1>
          <button className={styles.infoBtn} onClick={() => this.props.dispatch(actions.switchTab('info'))} />
          {booksBeingLoaded > 0 && <div className={styles.updatingStories}>updating<br />{booksBeingLoaded} stories</div>}
        </div>
        <div className={styles.subHeader}>
          <button className={styles.topStoriesBtn} onClick={() => this.props.dispatch(actions.switchTab('topStories'))} />
          <button className={styles.favoriteStoriesBtn} onClick={() => this.props.dispatch(actions.switchTab('favoriteBooks'))} />
        </div>

        {content}

        <div className={styles.footer}>
          <button hidden={filter.activeTab !== 'topStories'} className={styles.markAllAsReadBtn} onClick={() => this.props.dispatch(actions.markAllAsRead(filteredBooks))}>
            Mark all as read
          </button>
          <div hidden={filter.activeTab !== 'topStories'} className={styles.filter}>
            <div className={styles.scoreLimit}>{filter.scoreLimit}</div>
            <input type="range" min="0" max="1000" value={filter.scoreLimit} onChange={(e) => this.props.dispatch(actions.updateScoreLimit(e.target.value))} />
          </div>
          <button className={styles.quitBtn} onClick={() => ipcRenderer.send('quit')}>
              Quit App
          </button>
        </div>
      </div>
    );
  }
}
