import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import React, { Fragment, useState, memo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { UserCard } from '../../../SimpleCard';
import DropdownMenu from '../../../DropdownMenu';
import urls from '../../../../utils/urls';
import { addSuccessNotification } from '../../../../actions/notifications';
import styles from './styles.css';
import UserPick from '../../../UserPick/UserPick';
import { POST_TYPE_MEDIA_ID, postIsEditable, POST_EDIT_TIME_LIMIT } from '../../../../utils/posts';
import { copyToClipboard } from '../../../../utils/text';
import fromNow from '../../../../utils/fromNow';

const PostFeedHeader = ({ post, ...props }) => {
  if (!post) {
    return null;
  }

  const [leftTime, setLeftTime] = useState(0);
  const isEditable = postIsEditable(post.createdAt, POST_EDIT_TIME_LIMIT);
  const onClickDropdownButton = () => {
    setLeftTime(15 - moment().diff(post.createdAt, 'm'));
  };

  const items = [
    post.userId === props.userId ? {
      title: isEditable
        ? <span>Edit <span className={styles.leftTime}>({leftTime} {leftTime <= 1 ? 'minute' : 'minutes'} left)</span></span>
        : <span className={styles.limit}>Can only edit in first 15 min </span>,
      onClick: isEditable ? props.showForm : undefined,
      disabled: !isEditable,
    } : null,
    {
      title: 'Copy Link',
      onClick: () => {
        copyToClipboard(`${document.location.origin}${urls.getFeedPostUrl(post)}`);
        props.addSuccessNotification('Link copied to clipboard');
      },
    },
  ];

  return (
    <Fragment>
      <div className={styles.header}>
        <div className={styles.info}>
          <Link to={urls.getFeedPostUrl(post)} className={styles.date}>{fromNow(post.createdAt)}</Link>

          {props.formIsVisible &&
            <Fragment>
              <span>|</span>
              <span className={styles.edit}>Edit post</span>
            </Fragment>
          }

          {post.entityNameFor.trim() === 'org' &&
            <div className={styles.org}>
              <UserPick
                shadow
                size={24}
                organization
                url={urls.getOrganizationUrl(post.entityForCard.id)}
                src={urls.getFileUrl(post.entityForCard.avatarFilename)}
                alt={post.entityForCard.title}
              />
              <Link to={urls.getOrganizationUrl(post.entityForCard.id)}>{post.entityForCard.title}</Link>
            </div>
          }
        </div>

        {!props.formIsVisible &&
          <div className={styles.dropdown}>
            <DropdownMenu
              onClickButton={onClickDropdownButton}
              items={items.filter(e => e)}
              position="bottom-end"
            />
          </div>
        }
      </div>

      {post.postTypeId !== POST_TYPE_MEDIA_ID &&
        <div className={styles.user}>
          <UserCard userId={post.userId} />
        </div>
      }
    </Fragment>
  );
};

PostFeedHeader.propTypes = {
  showForm: PropTypes.func,
  addSuccessNotification: PropTypes.func.isRequired,
  formIsVisible: PropTypes.bool,
  userId: PropTypes.number,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};

PostFeedHeader.defaultProps = {
  userId: null,
  showForm: null,
  formIsVisible: false,
};

export default connect(null, {
  addSuccessNotification,
})(memo(PostFeedHeader, (prev, next) => (
  prev.user.id === next.user.id
)));
