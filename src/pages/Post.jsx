import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Footer from '../components/Footer';
import LayoutBase from '../components/Layout/LayoutBase';
import { fetchPost } from '../actions/posts';
import { getPostById } from '../store/posts';
import { getUserById } from '../store/users';
import { UserCardSimpleWrapper } from '../components/User/UserCardSimple';
import UserFollowButton from '../components/User/UserFollowButton';
import urls from '../utils/urls';
import ButtonEdit from '../components/ButtonEdit';
import { sanitizePostText, checkHashTag } from '../utils/text';
import PostRating from '../components/Rating/PostRating';
import Rate from '../components/Rate';
import Comments from '../components/Comments/Comments';
import { getPostBody } from '../utils/posts';

const Post = (props) => {
  useEffect(() => {
    props.fetchPost(props.match.params.id);
  }, [props.match.params.id]);

  const post = getPostById(props.posts, props.match.params.id);

  if (!post || !post.user || !post.user.id) {
    return null;
  }

  const user = getUserById(props.users, post.user.id);

  if (!user) {
    return null;
  }

  post.description = checkHashTag(post.description);

  return (
    <LayoutBase>
      <div className="container">
        <div className="post-head">
          <div className="post-head__inner">
            <div className="post-head__user">
              <UserCardSimpleWrapper userId={user.id} />
            </div>
            <div className="post-head__follow">
              <UserFollowButton userId={user.id} />
            </div>
          </div>
        </div>

        <div className="post-body">
          <div className="post-body__inner">
            <div className="post-body__aside">
              {props.user.id === post.userId &&
                <ButtonEdit url={urls.getPostEditUrl(post.id)} />
              }
            </div>

            <div className="post-body__main">
              <div className="post-body__content">
                <div className="post-content" dangerouslySetInnerHTML={{ __html: sanitizePostText(getPostBody(post)) }} />
              </div>

              <div className="post-body__comments">
                <Comments postId={post.id} />
              </div>
            </div>

            <div className="post-body__bside">
              <div className="post-body__rate">
                <Rate className="rate_medium" value={post.currentRate} />
              </div>
              <div className="post-body__rating">
                <PostRating postId={post.id} />
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </LayoutBase>
  );
};

Post.propTypes = {
  fetchPost: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    user: state.user.data,
    posts: state.posts,
    users: state.users,
  }),
  dispatch => bindActionCreators({
    fetchPost,
  }, dispatch),
)(Post);
