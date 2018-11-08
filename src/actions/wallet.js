import api from '../api';
import { selectUser } from '../store/selectors/user';
import { parseWalletErros } from '../utils/errors';

export const resetWalletState = payload => ({ type: 'RESET_WALLET_STATE', payload });
export const setWalletStateData = payload => ({ type: 'SET_WALLET_STATE_DATA', payload });
export const resetWalletSendTokens = payload => ({ type: 'RESET_WALLET_SEND_TOKENS', payload });
export const setWalletSendTokensData = payload => ({ type: 'SET_WALLET_SEND_TOKENS_DATA', payload });
export const setWalletSendTokensLoading = payload => ({ type: 'SET_WALLET_SEND_TOKENS_LOADING', payload });
export const resetWalletEditStake = payload => ({ type: 'RESET_WALLET_EDIT_STAKE', payload });
export const setWalletEditStakeData = payload => ({ type: 'SET_WALLET_EDIT_STAKE_DATA', payload });
export const setWalletEditStakeLoading = payload => ({ type: 'SET_WALLET_EDIT_STAKE_LOADING', payload });
export const resetWalletTradeRam = payload => ({ type: 'RESET_WALLET_TRADE_RAM', payload });
export const setWalletTradeRamLoading = payload => ({ type: 'SET_WALLET_TRADE_RAM_LOADING', payload });
export const setWalletTradeRamData = payload => ({ type: 'SET_WALLET_TRADE_RAM_DATA', payload });
export const setWalletTradeRamIsBuy = payload => ({ type: 'SET_WALLET_TRADE_RAM_IS_BUY', payload });
export const setWalletTradeRamServerErrors = payload => ({ type: 'SET_WALLET_TRADE_RAM_SERVER_ERRORS', payload });
export const setWalletSendTokensServerErrors = payload => ({ type: 'SET_WALLET_SEND_TOKENS_SERVER_ERRORS', payload });
export const setWalletEditStakeServerErrors = payload => ({ type: 'SET_WALLET_EDIT_STAKE_SERVER_ERRORS', payload });

export const setWalletSendTokensVisible = payload => (dispatch) => {
  dispatch(resetWalletSendTokens());
  dispatch(({ type: 'SET_WALLET_SEND_TOKENS_VISIBLE', payload }));
};

export const setWalletTradeRamVisible = payload => (dispatch) => {
  dispatch(resetWalletTradeRam());
  dispatch(({ type: 'SET_WALLET_TRADE_RAM_VISIBLE', payload }));
};

export const getCurrentNetAndCpuStakedTokens = () => async (dispatch, getState) => {
  const state = getState();
  const user = selectUser(state);

  if (!user.accountName) {
    return;
  }

  try {
    const data = await api.getCurrentNetAndCpuStakedTokens(user.accountName);

    dispatch(setWalletEditStakeData({
      netAmount: String(data.net),
      cpuAmount: String(data.cpu),
    }));
  } catch (e) {
    console.error(e);
  }
};

export const setWalletEditStakeVisible = payload => async (dispatch) => {
  dispatch(resetWalletEditStake());
  dispatch({ type: 'SET_WALLET_EDIT_STAKE_VISIBLE', payload });

  if (!payload) {
    return;
  }

  dispatch(getCurrentNetAndCpuStakedTokens());
};

export const getAccountState = () => async (dispatch, getState) => {
  const state = getState();
  const user = selectUser(state);

  if (!user.accountName) {
    return;
  }

  try {
    const accountState = await api.getAccountState(user.accountName);
    dispatch(setWalletStateData(accountState));
  } catch (e) {
    console.error(e);
  }
};

export const sendTokens = () => async (dispatch, getState) => {
  const state = getState();
  const user = selectUser(state);

  if (!user.accountName) {
    return;
  }

  const accountNameFrom = user.accountName;
  const accountNameTo = state.wallet.sendTokens.data.user.accountName;
  const { amount, memo } = state.wallet.sendTokens.data;

  try {
    await api.sendTokens(accountNameFrom, accountNameTo, +amount, memo);
    dispatch(setWalletSendTokensVisible(false));
    dispatch(getAccountState());
  } catch (e) {
    const errors = parseWalletErros(e);
    dispatch(setWalletSendTokensServerErrors(errors));
    console.error(e);
  }
};

export const stakeOrUnstakeTokens = () => async (dispatch, getState) => {
  const state = getState();
  const user = selectUser(state);

  if (!user.accountName) {
    return;
  }

  const { netAmount, cpuAmount } = state.wallet.editStake.data;
  const { accountName } = user;

  try {
    await api.stakeOrUnstakeTokens(accountName, +netAmount, +cpuAmount);
    dispatch(getAccountState());
    dispatch(setWalletEditStakeVisible(false));
  } catch (e) {
    const errors = parseWalletErros(e);
    dispatch(setWalletEditStakeServerErrors(errors));
    console.error(e);
  }
};

export const claimEmission = () => async (dispatch, getState) => {
  const state = getState();
  const user = selectUser(state);

  if (!user.accountName) {
    return;
  }

  try {
    await api.claimEmission(user.accountName);
    dispatch(getAccountState());
  } catch (e) {
    console.error(e);
  }
};

export const getApproximateRamPriceByBytesAmount = payload => async (dispatch) => {
  const { bytesAmount } = payload;

  if (+bytesAmount) {
    try {
      const price = await api.getApproximateRamPriceByBytesAmount(+bytesAmount);
      dispatch(setWalletTradeRamData({ price }));
    } catch (e) {
      console.error(e);
    }
  } else {
    dispatch(setWalletTradeRamData({ price: '' }));
  }
};

export const setWalletTradeRamDataAndGetPrice = payload => (dispatch) => {
  dispatch(getApproximateRamPriceByBytesAmount(payload));
  dispatch(setWalletTradeRamData(payload));
};

export const tradeRam = isBuy => async (dispatch, getState) => {
  const state = getState();
  const user = selectUser(state);

  if (!user.accountName) {
    return;
  }

  const trade = isBuy ? api.buyRam : api.sellRam;

  try {
    await trade(user.accountName, +state.wallet.tradeRam.data.bytesAmount);
    dispatch(setWalletTradeRamVisible(false));
    dispatch(getAccountState());
  } catch (e) {
    const errors = parseWalletErros(e);
    dispatch(setWalletTradeRamServerErrors(errors));
    console.error(e);
  }
};
