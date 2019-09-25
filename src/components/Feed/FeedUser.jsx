// TODO: Refactoring all feed components

import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, memo, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { feedReset, feedGetUserPosts, feedSetExcludeFilterId } from '../../actions/feed';
import FeedView from './FeedView';
import { commentsResetContainerDataById } from '../../actions/comments';
import { COMMENTS_CONTAINER_ID_FEED_POST } from '../../utils/comments';
import {
  withLoader,
  FEED_EXCLUDE_FILTER_ID_ALL,
  FEED_EXCLUDE_FILTER_ID_MEDIA_POSTS,
  FEED_EXCLUDE_FILTER_ID_UPDATES,
  FEED_PER_PAGE,
  getFeedExcludePostTypeIdsByExcludeFilterId,
  isFeedExcludeFilterIsEnabledByFeedTypeId,
} from '../../utils';

const FeedUser = (props) => {
  const dispatch = useDispatch();
  const feed = useSelector(state => state.feed, isEqual);

  const loadInitial = useMemo(() => async (excludeFilterId) => {
    await withLoader(dispatch(feedGetUserPosts({
      feedTypeId: props.feedTypeId,
      page: 1,
      perPage: FEED_PER_PAGE,
      userId: props.userId,
      organizationId: props.organizationId,
      tagIdentity: props.tagIdentity,
      userIdentity: props.userId,
      excludePostTypeIds: getFeedExcludePostTypeIdsByExcludeFilterId(excludeFilterId),
    })));
  }, [props.feedTypeId, feed, props.userId, props.organizationId, props.tagIdentity]);

  const loadMore = useMemo(() => async () => {
    await withLoader(dispatch(feedGetUserPosts({
      feedTypeId: props.feedTypeId,
      page: feed.metadata.page + 1,
      perPage: FEED_PER_PAGE,
      userId: props.userId,
      organizationId: props.organizationId,
      tagIdentity: props.tagIdentity,
      userIdentity: props.userId,
      excludePostTypeIds: getFeedExcludePostTypeIdsByExcludeFilterId(feed.excludeFilterId),
    })));
  }, [props.feedTypeId, feed, props.userId, props.organizationId, props.tagIdentity]);

  const changeExcludeFilterId = (filterId) => {
    dispatch(feedSetExcludeFilterId(filterId));
    loadInitial(filterId);
  };

  const reset = () => {
    dispatch(feedReset());
    dispatch(commentsResetContainerDataById({
      containerId: COMMENTS_CONTAINER_ID_FEED_POST,
    }));
  };

  useEffect(() => {
    loadInitial();

    return reset;
  }, [props.userId, props.organizationId, props.tagIdentity]);

  return (
    <FeedView
      showForm
      callbackOnSubmit={props.callbackOnSubmit}
      hasMore={feed.metadata.hasMore}
      postIds={feed.postIds}
      loading={feed.loading}
      feedInputInitialText={props.feedInputInitialText}
      onClickLoadMore={loadMore}
      filter={props.filter}
      feedTypeId={props.feedTypeId}
      originEnabled={props.originEnabled}
      forUserId={props.userId}
      forOrgId={props.organizationId}
      filters={isFeedExcludeFilterIsEnabledByFeedTypeId(props.feedTypeId) ? {
        items: [{
          title: 'All',
          active: feed.excludeFilterId === FEED_EXCLUDE_FILTER_ID_ALL,
          onClick: () => changeExcludeFilterId(FEED_EXCLUDE_FILTER_ID_ALL),
        }, {
          title: 'Publications',
          active: feed.excludeFilterId === FEED_EXCLUDE_FILTER_ID_MEDIA_POSTS,
          onClick: () => changeExcludeFilterId(FEED_EXCLUDE_FILTER_ID_MEDIA_POSTS),
        }, {
          title: 'Updates',
          active: feed.excludeFilterId === FEED_EXCLUDE_FILTER_ID_UPDATES,
          onClick: () => changeExcludeFilterId(FEED_EXCLUDE_FILTER_ID_UPDATES),
        }],
      } : undefined}
    />
  );
};

FeedUser.propTypes = {
  feedTypeId: PropTypes.number.isRequired,
  userId: PropTypes.number,
  organizationId: PropTypes.number,
  tagIdentity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  feedInputInitialText: PropTypes.string,
  filter: PropTypes.func,
  callbackOnSubmit: PropTypes.func,
  originEnabled: PropTypes.bool,
};

FeedUser.defaultProps = {
  userId: null,
  organizationId: null,
  tagIdentity: null,
  feedInputInitialText: null,
  filter: null,
  callbackOnSubmit: null,
  originEnabled: true,
};

export default memo(FeedUser);
