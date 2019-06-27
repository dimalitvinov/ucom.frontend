import graphql from '../api/graphql';
import { addUsers, trustUser, untrustUser } from './users';
import { addOrganizations } from './organizations';

export const reset = () => ({ type: 'USER_PAGE_RESET' });

export const setData = payload => ({ type: 'USER_PAGE_SET_DATA', payload });

export const getPageData = userIdentity => async (dispatch) => {
  try {
    const {
      user, orgs, iFollow, followedBy, trustedBy,
    } = await graphql.getUserPageData({ userIdentity });

    dispatch(addUsers([
      user,
      ...iFollow.data,
      ...followedBy.data,
      ...trustedBy.data,
    ]));

    dispatch(addOrganizations(orgs.data));

    dispatch(setData({
      trustedBy: {
        ids: trustedBy.data.map(i => i.id),
        metadata: trustedBy.metadata,
      },
      trustedByPopup: {
        ids: trustedBy.data.map(i => i.id),
        metadata: trustedBy.metadata,
      },
      orgs: {
        ids: orgs.data.map(i => i.id),
        metadata: orgs.metadata,
      },
      orgsPopup: {
        ids: orgs.data.map(i => i.id),
        metadata: orgs.metadata,
      },
      iFollow: {
        ids: iFollow.data.map(i => i.id),
        metadata: iFollow.metadata,
      },
      iFollowPopup: {
        ids: iFollow.data.map(i => i.id),
        metadata: iFollow.metadata,
      },
      followedBy: {
        ids: followedBy.data.map(i => i.id),
        metadata: followedBy.metadata,
      },
      followedByPopup: {
        ids: followedBy.data.map(i => i.id),
        metadata: followedBy.metadata,
      },
    }));
  } catch (err) {
    console.error(err);
  }

  dispatch(setData({
    loaded: true,
  }));
};

export const getTrustedBy = userIdentity => async (dispatch) => {
  const { data, metadata } = await graphql.getUserTrustedBy({
    userIdentity,
  });

  dispatch(addUsers(data));

  dispatch(setData({
    trustedByPopup: {
      ids: data.map(i => i.id),
      metadata,
    },
    trustedBy: {
      ids: data.map(i => i.id),
      metadata,
    },
  }));
};

export const getTrustedByPopup = (userIdentity, page) => async (dispatch) => {
  try {
    const { data, metadata } = await graphql.getUserTrustedBy({
      userIdentity,
      page,
    });

    dispatch(addUsers(data));

    dispatch(setData({
      trustedByPopup: {
        metadata,
        ids: data.map(i => i.id),
      },
      trustedBy: {
        metadata,
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const submitTrust = (userIdentity, isTrust, params) => async (dispatch) => {
  try {
    dispatch(setData({
      trustLoading: true,
    }));

    await dispatch((isTrust ? trustUser : untrustUser)(params));
    await dispatch(getTrustedBy(userIdentity));

    dispatch(setData({
      trustLoading: false,
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getOrgsPopup = (userIdentity, page) => async (dispatch) => {
  try {
    const { data, metadata } = await graphql.getUserFollowsOrganizations({
      userIdentity,
      page,
    });

    dispatch(addOrganizations(data));

    dispatch(setData({
      orgsPopup: {
        ids: data.map(i => i.id),
        metadata,
      },
      orgs: {
        metadata,
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getIFollowPopup = (userIdentity, page) => async (dispatch) => {
  try {
    const { data, metadata } = await graphql.getUserIFollow({
      userIdentity,
      page,
    });

    dispatch(addUsers(data));

    dispatch(setData({
      iFollowPopup: {
        ids: data.map(i => i.id),
        metadata,
      },
      iFollow: {
        metadata,
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const getFollowedByPopup = (userIdentity, page) => async (dispatch) => {
  try {
    const { data, metadata } = await graphql.getUserFollowedBy({
      userIdentity,
      page,
    });

    dispatch(addUsers(data));

    dispatch(setData({
      followedByPopup: {
        ids: data.map(i => i.id),
        metadata,
      },
      followedBy: {
        metadata,
      },
    }));
  } catch (err) {
    console.error(err);
    throw err;
  }
};