import PropTypes from 'prop-types';
import moment from 'moment';
import React, { memo, Fragment } from 'react';
import { getUserName } from '../../../utils/user';
import urls from '../../../utils/urls';
import PostFeedHeader from './PostFeedHeader';
import PostFeedContent from './PostFeedContent';
import PostFeedFooter from './PostFeedFooter';
import PostCard from '../../PostMedia/PostCard';
import { getPostUrl, getPostTypeById, POST_TYPE_MEDIA_ID, getPostCover } from '../../../utils/posts';
import { POST_TYPE_AUTOUPDATE_ID } from '../../../utils';
import styles from './Post.css';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../../utils/comments';
import { PostAutoupdate } from '../Autoupdate';

const Repost = ({
  post, user, owner, commentsContainerId, ...props
}) => {
  if (!post || !post.post || !user) {
    return null;
  }

  return (
    <div className={styles.post}>
      <PostFeedHeader
        post={post}
        user={owner}
        userId={user.id}
        postTypeId={props.postTypeId}
        createdAt={moment(post.createdAt).fromNow()}
        postId={post.id}
        userName={getUserName(user)}
        accountName={user.accountName}
        profileLink={urls.getUserUrl(user.id)}
        originEnabled={props.originEnabled}
      />

      <div className={styles.repost} id={`post-${post.post.id}`}>
        {post.post.postTypeId === POST_TYPE_AUTOUPDATE_ID ? (
          <PostAutoupdate flat postId={post.post.id} showFooter={false} />
        ) : (
          <Fragment>
            <PostFeedHeader
              repost
              post={post.post}
              user={owner}
              userId={post.post.user.id}
              postTypeId={post.post.postTypeId}
              createdAt={moment(post.post.createdAt).fromNow()}
              postId={post.post.id}
              userName={getUserName(post.post.user)}
              accountName={post.post.user.accountName}
              profileLink={urls.getUserUrl(post.post.user.id)}
              avatarUrl={urls.getFileUrl(post.post.user.avatarFilename)}
              feedTypeId={props.feedTypeId}
            />

            {post.post.postTypeId === POST_TYPE_MEDIA_ID ? (
              <PostCard
                onFeed
                repost
                coverUrl={getPostCover(post.post)}
                rate={post.post.currentRate}
                title={post.post.title || post.post.leadingText}
                url={getPostUrl(post.post.id)}
                userUrl={urls.getUserUrl(post.post.user && post.post.user.id)}
                userImageUrl={urls.getFileUrl(post.post.user && post.post.user.avatarFilename)}
                userName={getUserName(post.post.user)}
                accountName={post.post.user && post.post.user.accountName}
                tags={post.post.postTypeId && [getPostTypeById(post.post.postTypeId)]}
                commentsCount={post.postTypeId && post.commentsCount}
                sharesCount={post.postTypeId && post.sharesCount}
              />
            ) : (
              <PostFeedContent
                post={post.post}
                postId={post.post.id}
                userId={post.post.user.id}
              />
            )}
          </Fragment>
        )}
      </div>

      <PostFeedFooter
        postId={post.id}
        commentsCount={post.commentsCount}
        commentsContainerId={commentsContainerId}
      />
    </div>
  );
};

Repost.propTypes = {
  id: PropTypes.number.isRequired,
  feedTypeId: PropTypes.number.isRequired,
  postTypeId: PropTypes.number,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  commentsContainerId: PropTypes.number,
  originEnabled: PropTypes.bool,
};

Repost.defaultProps = {
  postTypeId: undefined,
  commentsContainerId: COMMENTS_CONTAINER_ID_FEED_POST,
  originEnabled: true,
};

export default memo(Repost);
