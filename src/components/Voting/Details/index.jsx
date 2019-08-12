import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { memo } from 'react';
import IconVoteUp from '../../Icons/VoteUp';
import IconVoteDown from '../../Icons/VoteDown';
import UserPicks from './UserPicks';
import Spinner from '../../Spinner';
import { UPVOTE_STATUS, DOWNVOTE_STATUS } from '../../../utils/constants';
import styles from './styles.css';

const Details = ({
  upCount, downCount, upUserPicks, downUserPicks, selfVote, loading, onClick,
}) => (
  <div className={styles.details}>
    {loading ? (
      <Spinner />
    ) : (
      <div className={styles.data}>
        <span
          className={classNames({
            [styles.icon]: true,
            [styles.up]: selfVote === UPVOTE_STATUS,
          })}
        >
          <IconVoteUp />
        </span>

        <span className={styles.value}>{upCount}</span>

        <UserPicks
          {...upUserPicks}
          onClick={onClick}
        />

        <span
          className={classNames({
            [styles.icon]: true,
            [styles.down]: selfVote === DOWNVOTE_STATUS,
          })}
        >
          <IconVoteDown />
        </span>

        <span className={styles.value}>{downCount}</span>

        <UserPicks
          {...downUserPicks}
          onClick={onClick}
        />
      </div>
    )}
  </div>
);

Details.propTypes = {
  loading: PropTypes.bool,
  upCount: PropTypes.number,
  downCount: PropTypes.number,
  selfVote: PropTypes.string,
  upUserPicks: PropTypes.arrayOf(PropTypes.shape(UserPicks.propTypes)),
  downUserPicks: PropTypes.arrayOf(PropTypes.shape(UserPicks.propTypes)),
  onClick: PropTypes.func,
};

Details.defaultProps = {
  loading: false,
  upCount: 0,
  downCount: 0,
  selfVote: undefined,
  upUserPicks: [],
  downUserPicks: [],
  onClick: undefined,
};

export default memo(Details);
