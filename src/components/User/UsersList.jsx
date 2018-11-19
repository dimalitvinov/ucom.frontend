import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import UserCard from '../UserCard';
import Rate from '../Rate';
import UserFollowButton from './UserFollowButton';
import { selectUser } from '../../store/selectors/user';
import { getUserById } from '../../store/users';
import { getUserName, getUserUrl } from '../../utils/user';
import { getFileUrl } from '../../utils/upload';

const UsersList = (props) => {
  if (!props.usersIds) {
    return null;
  }

  const users = props.usersIds.map(userId => getUserById(props.users, userId));

  return (
    <div className="entry-list">
      <div className="entry-list__title">{props.title}</div>

      <div className="entry-list__list">
        {users.map(item => (
          <div className="entry-list__item" key={item.id}>
            <div className="entry-list__card">
              <UserCard
                className="user-card_text_left"
                userName={getUserName(item)}
                accountName={item.accountName}
                avatarUrl={getFileUrl(item.avatarFilename)}
                profileLink={getUserUrl(item.id)}
                sign={props.noSign ? '' : '@'}
              />
            </div>

            <div className="entry-list__rate">
              <Rate value={+item.currentRate} className="rate_small" />
            </div>

            {item.id &&
              <div className="entry-list__follow">
                <UserFollowButton userId={item.id} />
              </div>
            }
          </div>
        ))}
      </div>
    </div>
  );
};

UsersList.propTypes = {
  title: PropTypes.string,
  noSign: PropTypes.bool,
  usersIds: PropTypes.arrayOf(PropTypes.number),
};

UsersList.defaultTypes = {
  title: 'Followers',
};

export default connect(state => ({
  users: state.users,
  user: selectUser(state),
}))(UsersList);
