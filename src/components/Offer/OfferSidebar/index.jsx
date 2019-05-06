import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { formatRate } from '../../../utils/rate';
import PostRating from '../../Rating/PostRating';
import One from '../../Icons/Airdrop/One';
import Two from '../../Icons/Airdrop/Two';
import Three from '../../Icons/Airdrop/Three';
import Done from '../../Icons/Airdrop/Done';
import DoneSmall from '../../Icons/Airdrop/DoneSmall';
import Dots from '../../Icons/Airdrop/Dots';
import Error from '../../Icons/Airdrop/Error';
import IconShareCircle from '../../Icons/ShareCircle';
import ShareBlock from '../../ShareBlock';
import styles from './styles.css';
import { authShowPopup } from '../../../actions/auth';
import IconTelegram from '../../Icons/Socials/TelegramBlack';

const { AirdropStatuses } = require('ucom.libs.common').Airdrop.Dictionary;

const OfferSidebar = (props) => {
  const [sharePopupVisibility, setSharePopupVisibility] = useState(false);

  const toggleShare = () => {
    setSharePopupVisibility(!sharePopupVisibility);
  };

  const { conditions } = props;

  return (
    <Fragment>
      <div className={styles.rateVote}>
        <div className={styles.rate}>{formatRate(props.rate)}°</div>
        <PostRating postId={props.postId} />
      </div>
      {conditions && ((conditions.airdropStatus === AirdropStatuses.PENDING ||
        conditions.airdropStatus === AirdropStatuses.RECEIVED) ||
        (conditions.conditions.authGithub === true &&
          conditions.conditions.authMyself === true &&
          conditions.conditions.followingDevExchange === true &&
          conditions.airdropStatus !== AirdropStatuses.NO_PARTICIPATION)) &&
          <div className={styles.airdrop}>
            <div className={styles.status}>
              <div>Airdrop Status:</div>
              {(conditions.airdropStatus === AirdropStatuses.PENDING ||
                (conditions.conditions.authGithub === true &&
                  conditions.conditions.authMyself === true &&
                  conditions.conditions.followingDevExchange === true &&
                  conditions.airdropStatus !== AirdropStatuses.RECEIVED)) &&
                  <Fragment>
                    <span className={styles.statusIcon}><Dots /></span>
                    <span className={styles.statusPending}>In progress</span>
                  </Fragment>
              }
              {conditions.airdropStatus === AirdropStatuses.RECEIVED &&
                <Fragment>
                  <span className={styles.statusIcon}><DoneSmall /></span>
                  <span className={styles.statusReceived}>Received</span>
                </Fragment>
              }
            </div>
            <div className={styles.tokens}>
              <div className={styles.tokensColumn}>
                <div className={styles.tokenNumber}>{(conditions.tokens[0].amountClaim).toLocaleString('ru-RU')}</div>
                <span className={styles.tokenCurr}>UOS</span>
              </div>
              <div className={styles.tokensColumn}>
                <div className={styles.tokenNumber}>{(conditions.tokens[1].amountClaim).toLocaleString('ru-RU')}</div>
                <span className={styles.tokenCurr}>UOS.Futures</span>
              </div>
            </div>
          </div>
      }
      {conditions && conditions.airdropStatus === AirdropStatuses.ERROR &&
        <div className={styles.airdrop}>
          <div className={styles.status}>
            <div>Airdrop Status:</div>
            <Fragment>
              <span className={styles.statusIcon}><Error /></span>
              <span className={styles.statusError}>Error occured</span>
            </Fragment>
          </div>
          <div className={styles.statusErrorText}>
            Something went wrong, please contact us in <a href="https://t.me/uos_network_en" target="_blank" rel="noopener noreferrer"><IconTelegram />Chat</a>
          </div>
        </div>
      }
      <div className={styles.condition}>
        <div className={styles.conditionTitle}>How to Enter Airdrop:</div>
        <div className={styles.option}>
          <div className={styles.optionStatus}>
            {(conditions && conditions.conditions.authGithub === true) || props.cookie !== null ? <Done /> : <One />}
          </div>
          <div className={styles.optionBlock}>
            <a
              href={Date.parse(new Date(props.startedAt)) - Date.parse(new Date()) < 0 ? props.gitHubAuthLink : null}
              className={styles.optionTitle}
            >
              Authorize GitHub
            </a>
            <div className={styles.optionText}>To get your Score system need acсess to your GitHub account data</div>
          </div>
        </div>
        <div className={styles.option}>
          <div className={styles.optionStatus}>{conditions && conditions.conditions.authMyself === true ? <Done /> : <Two />}</div>
          <div className={styles.optionBlock}>
            <div
              role="presentation"
              onClick={() => (Date.parse(new Date(props.startedAt)) - Date.parse(new Date()) < 0 ? props.authShowPopup() : null)}
              className={styles.optionTitle}
            >
              Register U°OS account
            </div>
            <div className={styles.optionText}>to secure your Importance in the network</div>
          </div>
        </div>
        <div className={styles.option}>
          <div className={styles.optionStatus}>{conditions && conditions.conditions.followingDevExchange === true ? <Done /> : <Three />}</div>
          <div className={styles.optionBlock}>
            <a href={Date.parse(new Date(props.startedAt)) - Date.parse(new Date()) < 0 ? `/communities/${props.organizationId}` : null} target="_blank" rel="noopener noreferrer" className={styles.optionTitle}>Join DevExchange</a>
            <div className={styles.optionText}>to see your Importance in action and talk to community members</div>
          </div>
        </div>
      </div>
      <div className={styles.created}>Created <span>{props.createdAt}</span></div>
      <div
        role="presentation"
        className={styles.share}
        onClick={() => toggleShare()}
      >
        <IconShareCircle />
        <span>Share</span>

        {sharePopupVisibility ? (
          <div className="post-body__share-popup">
            <ShareBlock
              link={props.link}
              postId={props.postId}
              onClickClose={toggleShare}
              repostAvailable={props.repostAvailable}
              postTypeId={props.postTypeId}
            />
          </div>
        ) : null }
      </div>
    </Fragment>
  );
};

OfferSidebar.propTypes = {
  conditions: PropTypes.shape({
    airdropStatus: PropTypes.number,
    score: PropTypes.number,
    userId: PropTypes.number,
    condition: PropTypes.objectOf(PropTypes.shape({
      authGithub: PropTypes.bool,
      authMyself: PropTypes.bool,
      followingDevExchange: PropTypes.bool,
    })),
    tokens: PropTypes.arrayOf(PropTypes.shape({
      amountClaim: PropTypes.number,
    })),
  }),
  authShowPopup: PropTypes.func.isRequired,
  rate: PropTypes.number,
  postId: PropTypes.number.isRequired,
  createdAt: PropTypes.string,
  startedAt: PropTypes.string,
  link: PropTypes.string.isRequired,
  repostAvailable: PropTypes.bool,
  postTypeId: PropTypes.number,
  cookie: PropTypes.string,
  gitHubAuthLink: PropTypes.string,
  organizationId: PropTypes.number,
};

OfferSidebar.defaultProps = {
  rate: 0,
  repostAvailable: false,
  cookie: null,
  conditions: null,
  postTypeId: 1,
  gitHubAuthLink: '',
  startedAt: '',
  createdAt: '',
  organizationId: 101,
};

export default connect(
  null,
  dispatch => ({
    authShowPopup: () => dispatch(authShowPopup()),
  }),
)(OfferSidebar);
