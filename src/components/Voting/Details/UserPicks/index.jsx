import PropTypes from 'prop-types';
import React from 'react';
import UserPick from '../../../UserPick';
import styles from './styles.css';

const UserPicks = ({ userPicks, onClickMore }) => (
  <span className={styles.users}>
    {userPicks.length > 0 &&
      <div className={styles.items}>
        {userPicks.slice(0, 3).map(userPick => (
          <div className={styles.item}>
            <UserPick
              {...userPick}
              shadow
              size={20}
            />
          </div>
        ))}
      </div>
    }
    <span
      role="presentation"
      className={styles.more}
      onClick={onClickMore}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="0.5" y="0.5" width="19" height="19" rx="9.5" stroke="#C4C4C4" />
        <circle r="0.999783" transform="matrix(1 0 0 -1 6.99978 10.0002)" fill="#C4C4C4" />
        <circle r="0.999783" transform="matrix(1 0 0 -1 9.99978 10.0002)" fill="#C4C4C4" />
        <circle r="0.999783" transform="matrix(1 0 0 -1 12.9998 10.0002)" fill="#C4C4C4" />
      </svg>
    </span>
  </span>
);

UserPicks.propTypes = {
  userPicks: PropTypes.arrayOf(PropTypes.shape(UserPick.propTypes)),
  onClickMore: PropTypes.func,
};

UserPicks.defaultProps = {
  userPicks: [],
  onClickMore: undefined,
};

export default UserPicks;
