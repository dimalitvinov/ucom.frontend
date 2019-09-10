import Wallet from 'ucom-libs-wallet';
import ecc from 'eosjs-ecc';
import registerPromiseWorker from 'promise-worker/register';
import { getActivePrivateKey, getSocialPrivateKeyByActiveKey, getPublicKeyByPrivateKey } from '../utils/keys';
import {
  WORKER_GET_ACTIVE_KEY_BY_BRAINKEY,
  WORKER_GET_SOCIAL_KEY_BY_ACTIVE_KEY,
  WORKER_GET_PUBLIC_KEY_BY_PRIVATE_KEY,
  WORKER_BIND_SOCIAL_KEY_WITH_SOCIAL_PERMISSIONS,
  WORKER_ADD_SOCIAL_PERMISSIONS_TO_EMISSION_AND_PROFILE,
  WORKER_ECC_SIGN,
  WORKER_GET_UPVOTE_CONTENT_SIGNED_TRANSACTION,
  WORKER_GET_DOWNVOTE_CONTENT_SIGNED_TRANSACTION,
  WORKER_GET_FOLLOW_ACCOUNT_SIGNED_TRANSACTION,
  WORKER_GET_UNFOLLOW_ACCOUNT_SIGNED_TRANSACTION,
  WORKER_GET_FOLLOW_ORGANIZATION_SIGNED_TRANSACTION,
  WORKER_GET_UNFOLLOW_ORGANIZATION_SIGNED_TRANSACTION,
  WORKER_GET_TRUST_USER_SIGNED_TRANSACTIONS_AS_JSON,
  WORKER_GET_UNTRUST_USER_SIGNED_TRANSACTIONS_AS_JSON,
} from '../utils/constants';

const { SocialKeyApi, SocialApi } = Wallet;
const { ContentInteractionsApi } = Wallet.Content;

registerPromiseWorker((action) => {
  switch (action.type) {
    case WORKER_GET_ACTIVE_KEY_BY_BRAINKEY: {
      return getActivePrivateKey(action.brainkey);
    }

    case WORKER_GET_SOCIAL_KEY_BY_ACTIVE_KEY: {
      return getSocialPrivateKeyByActiveKey(action.activeKey);
    }

    case WORKER_GET_PUBLIC_KEY_BY_PRIVATE_KEY: {
      return getPublicKeyByPrivateKey(action.privateKey);
    }

    case WORKER_ECC_SIGN: {
      return ecc.sign(action.str, action.privateKey);
    }

    case WORKER_BIND_SOCIAL_KEY_WITH_SOCIAL_PERMISSIONS: {
      return SocialKeyApi.bindSocialKeyWithSocialPermissions(action.accountName, action.activeKey, action.socialPublicKey);
    }

    case WORKER_ADD_SOCIAL_PERMISSIONS_TO_EMISSION_AND_PROFILE: {
      return SocialKeyApi.addSocialPermissionsToEmissionAndProfile(action.accountName, action.activeKey);
    }

    case WORKER_GET_UPVOTE_CONTENT_SIGNED_TRANSACTION: {
      return ContentInteractionsApi.getUpvoteContentSignedTransaction(action.accountName, action.privateKey, action.blockchainId, action.permission);
    }

    case WORKER_GET_DOWNVOTE_CONTENT_SIGNED_TRANSACTION: {
      return ContentInteractionsApi.getUpvoteContentSignedTransaction(action.accountName, action.privateKey, action.blockchainId, action.permission);
    }

    case WORKER_GET_FOLLOW_ACCOUNT_SIGNED_TRANSACTION: {
      return SocialApi.getFollowAccountSignedTransaction(action.ownerAccountName, action.privateKey, action.userAccountName, action.permission);
    }

    case WORKER_GET_UNFOLLOW_ACCOUNT_SIGNED_TRANSACTION: {
      return SocialApi.getUnfollowAccountSignedTransaction(action.ownerAccountName, action.privateKey, action.userAccountName, action.permission);
    }

    case WORKER_GET_FOLLOW_ORGANIZATION_SIGNED_TRANSACTION: {
      return SocialApi.getFollowOrganizationSignedTransaction(action.ownerAccountName, action.privateKey, action.orgBlockchainId, action.permission);
    }

    case WORKER_GET_UNFOLLOW_ORGANIZATION_SIGNED_TRANSACTION: {
      return SocialApi.getUnfollowOrganizationSignedTransaction(action.ownerAccountName, action.privateKey, action.orgBlockchainId, action.permission);
    }

    case WORKER_GET_TRUST_USER_SIGNED_TRANSACTIONS_AS_JSON: {
      return SocialApi.getTrustUserSignedTransactionsAsJson(action.ownerAccountName, action.ownerPrivateKey, action.userAccountName, action.permission);
    }

    case WORKER_GET_UNTRUST_USER_SIGNED_TRANSACTIONS_AS_JSON: {
      return SocialApi.getUnTrustUserSignedTransactionsAsJson(action.ownerAccountName, action.ownerPrivateKey, action.userAccountName, action.permission);
    }

    default:
      return null;
  }
});