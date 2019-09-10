import PromiseWorker from 'promise-worker';
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

export default class Api {
  static getPromiseWorker() {
    const MainWorker = require('./main.worker');
    const mainWorker = new MainWorker();
    const promiseWorker = new PromiseWorker(mainWorker);

    return promiseWorker;
  }

  static async postMessage(action) {
    const result = await Api.getPromiseWorker().postMessage(action);

    return result;
  }

  static async getActiveKeyByBrainKey(brainkey) {
    const activeKey = await Api.postMessage({
      type: WORKER_GET_ACTIVE_KEY_BY_BRAINKEY,
      brainkey,
    });

    return activeKey;
  }

  static async getSocialKeyByActiveKey(activeKey) {
    const socialKey = await Api.postMessage({
      type: WORKER_GET_SOCIAL_KEY_BY_ACTIVE_KEY,
      activeKey,
    });

    return socialKey;
  }

  static async getPublicKeyByPrivateKey(privateKey) {
    const publicKey = await Api.postMessage({
      type: WORKER_GET_PUBLIC_KEY_BY_PRIVATE_KEY,
      privateKey,
    });

    return publicKey;
  }

  static async eccSign(str, privateKey) {
    const sign = await Api.postMessage({
      type: WORKER_ECC_SIGN,
      str,
      privateKey,
    });

    return sign;
  }

  static async bindSocialKeyWithSocialPermissions(accountName, activeKey, socialPublicKey) {
    const sign = await Api.postMessage({
      type: WORKER_BIND_SOCIAL_KEY_WITH_SOCIAL_PERMISSIONS,
      accountName,
      activeKey,
      socialPublicKey,
    });

    return sign;
  }

  static async addSocialPermissionsToEmissionAndProfile(accountName, activeKey) {
    const sign = await Api.postMessage({
      type: WORKER_ADD_SOCIAL_PERMISSIONS_TO_EMISSION_AND_PROFILE,
      accountName,
      activeKey,
    });

    return sign;
  }

  static async getUpvoteContentSignedTransaction(accountName, privateKey, blockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_UPVOTE_CONTENT_SIGNED_TRANSACTION,
      accountName,
      privateKey,
      blockchainId,
      permission,
    });

    return signTransaction;
  }

  static async getDownvoteContentSignedTransaction(accountName, privateKey, blockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_DOWNVOTE_CONTENT_SIGNED_TRANSACTION,
      accountName,
      privateKey,
      blockchainId,
      permission,
    });

    return signTransaction;
  }

  static async getFollowAccountSignedTransaction(ownerAccountName, privateKey, userAccountName, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_FOLLOW_ACCOUNT_SIGNED_TRANSACTION,
      ownerAccountName,
      privateKey,
      userAccountName,
      permission,
    });

    return signTransaction;
  }

  static async getUnfollowAccountSignedTransaction(ownerAccountName, privateKey, userAccountName, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_UNFOLLOW_ACCOUNT_SIGNED_TRANSACTION,
      ownerAccountName,
      privateKey,
      userAccountName,
      permission,
    });

    return signTransaction;
  }

  static async getFollowOrganizationSignedTransaction(ownerAccountName, privateKey, orgBlockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_FOLLOW_ORGANIZATION_SIGNED_TRANSACTION,
      ownerAccountName,
      privateKey,
      orgBlockchainId,
      permission,
    });

    return signTransaction;
  }

  static async getUnfollowOrganizationSignedTransaction(ownerAccountName, privateKey, orgBlockchainId, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_UNFOLLOW_ORGANIZATION_SIGNED_TRANSACTION,
      ownerAccountName,
      privateKey,
      orgBlockchainId,
      permission,
    });

    return signTransaction;
  }

  static async getTrustUserSignedTransactionsAsJson(ownerAccountName, ownerPrivateKey, userAccountName, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_TRUST_USER_SIGNED_TRANSACTIONS_AS_JSON,
      ownerAccountName,
      ownerPrivateKey,
      userAccountName,
      permission,
    });

    return signTransaction;
  }

  static async getUnTrustUserSignedTransactionsAsJson(ownerAccountName, ownerPrivateKey, userAccountName, permission) {
    const signTransaction = await Api.postMessage({
      type: WORKER_GET_UNTRUST_USER_SIGNED_TRANSACTIONS_AS_JSON,
      ownerAccountName,
      ownerPrivateKey,
      userAccountName,
      permission,
    });

    return signTransaction;
  }
}