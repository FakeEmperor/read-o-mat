import React from 'react';
import moment from 'moment';
import electron from 'electron';

import styles from './styles.css';

export default function (props) {
  const time = moment.unix(props.book.time).fromNow();
  const site = props.book.url.replace(/(https?:\/\/)(www\.)?([^\/]+)(.+)/, '$3');
  const userUrl = props.book.url;
  let style = [styles.book];
  if (props.book.seen) {
    style.push(styles.seenBook);
  }
  if (props.isFavorite) {
    style.push(styles.favoriteBook);
  }
  return (
    <li className={style.join(' ')} key={props.book.id}>
      <div className={styles.scoreWrapper} onClick={props.onFavoriteClick}>
        <button className={styles.favoriteBtn} />
        <span className={styles.score}>{props.book.score}</span>
      </div>
      <div className={styles.body} onClick={props.onClick}>
        <div className={styles.title}>{props.book.title}</div>
        <div className={styles.subtitle}>
          {site}
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          by <a href="#" onClick={(e) => electron.shell.openExternal(userUrl)}>{props.book.by}</a>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          {time}
        </div>
      </div>
    </li>
  );
}
