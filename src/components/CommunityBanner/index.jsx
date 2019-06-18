import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React from 'react';
import styles from './styles.css';
import Button from '../Button/index';
import urls from '../../utils/urls';
import { authShowPopup } from '../../actions/auth';

const CommunityBanner = ({ authorized, authShowPopup, forCommunity }) => (
  <div className={styles.communityBanner}>
    <div className={styles.logo}>
      {forCommunity ? (
        <svg width="190" height="124" viewBox="0 0 190 124" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M80.3001 15.3209C79.9561 15.5568 79.6962 15.763 79.5164 15.9171C79.0293 16.3343 78.6029 16.8259 78.1794 17.314L78.1793 17.3141C78.0207 17.4969 77.8625 17.6792 77.7017 17.857C68.7864 23.6493 66.3392 32.8039 65.9895 39.8417C65.8268 43.116 66.0998 46.0906 66.4416 48.3568C65.1865 49.3389 64.3402 50.6703 63.8525 52.1353C62.8607 55.1147 63.2312 58.9726 64.4352 63.6071C65.3984 67.3144 66.4271 70.0845 67.6037 72.0395C68.2896 73.1793 69.3512 74.561 70.8753 75.4261C71.8975 79.4141 73.6777 83.784 76.7588 87.7091C76.7081 88.0519 76.6469 88.4235 76.5736 88.8102C76.3414 90.0358 76.0495 91.0634 75.7581 91.7964C75.6284 91.8531 75.4905 91.9131 75.3446 91.9762C74.1289 92.5021 72.3589 93.2435 70.1732 94.0916C65.7906 95.7919 59.7897 97.8997 53.2641 99.5624C46.1529 101.375 42.4916 106.523 40.7928 111.573C39.4094 115.686 39.3935 119.758 39.3839 124H0.0249296C-0.0661692 116.319 0.121715 107.96 0.121715 107.96C-0.284084 102.179 0.203546 90.5017 10.2997 87.9289C23.8461 84.4774 35.0835 79.2155 35.0835 79.2155C37.3035 76.1499 37.7003 69.7311 37.7003 69.7311C33.4613 65.1602 31.5813 59.4377 30.7907 54.5972C30.5095 54.8042 30.1872 54.9419 29.8312 54.9328C28.5583 54.906 26.8526 53.0386 25.0137 45.9609C22.6991 37.0512 24.8711 35.2944 26.9719 35.3104L27.0687 35.311C27.469 35.3132 27.5644 35.3137 27.9565 35.4317L27.9618 35.2371C27.9618 35.2371 21.7342 14.4145 36.7137 5.25869L38.5014 3.28236C38.5014 3.28236 41.1518 0.82346 47.7337 0.837864C50.7246 0.845233 53.6567 0.691486 55.857 0.236273C56.7364 0.054054 57.6265 -0.0189673 58.5096 0.00414507C64.6907 0.161242 70.6121 4.98737 71.6554 9.64568C71.6554 9.64568 71.7463 9.63864 71.912 9.63864C73.0647 9.63647 77.8135 9.96343 80.3001 15.3209ZM189.839 124C190.163 117.435 189.897 107.96 189.897 107.96L189.85 107.97C190.258 102.193 189.775 90.501 179.674 87.9302C166.237 84.5052 154.702 78.7344 154.516 78.6413L154.515 78.6404C152.624 75.414 152.273 69.7307 152.273 69.7307L152.045 69.7448C156.339 65.1223 158.217 59.3211 158.994 54.4414C159.309 54.7235 159.684 54.9288 160.11 54.9308C161.386 54.9362 163.104 53.0972 164.959 45.9589C167.281 37.0244 165.091 35.2816 162.983 35.3084C162.682 35.3121 162.383 35.3513 162.099 35.4119L162.108 35.3508L162.113 35.3191C168.002 10.5759 155.728 9.63496 153.775 9.63864C153.61 9.63864 153.519 9.64568 153.519 9.64568C152.476 4.98737 146.554 0.161242 140.373 0.00414507C139.49 -0.0189673 138.6 0.054054 137.721 0.236273C135.52 0.691486 132.588 0.845233 129.597 0.837864C123.015 0.82346 120.365 3.28236 120.365 3.28236L118.577 5.25869C114.901 7.50549 112.502 10.4549 110.975 13.6267C112.114 14.207 113.178 14.8806 114.148 15.6165C116.192 17.1679 118.067 19.1913 119.321 21.5284C121.64 22.098 124.643 23.4434 127.076 26.5854C130.542 31.0619 131.936 38.0149 130.12 48.4357C131.309 49.4018 132.122 50.6897 132.598 52.1063C133.601 55.0915 133.23 58.9602 132.023 63.6053C131.052 67.3416 130.015 70.1294 128.824 72.0899C128.105 73.2732 126.971 74.7179 125.335 75.5589C124.328 79.4335 122.603 83.6555 119.666 87.4755C119.711 87.7963 119.766 88.148 119.831 88.5179C120.021 89.5844 120.266 90.5755 120.542 91.3701C120.67 91.4298 120.805 91.4928 120.948 91.5588C122.202 92.1378 124.014 92.9466 126.237 93.8601C130.697 95.6931 136.739 97.9182 143.195 99.5638C150.311 101.375 153.971 106.529 155.669 111.582C156.427 113.839 156.829 116.151 157.02 118.295L157.033 118.292L157.035 118.469C157.147 119.8 157.135 121.122 157.123 122.447C157.118 122.964 157.114 123.482 157.116 124H189.839ZM152.188 124C152.546 118.104 151.87 106.857 141.987 104.342C128.551 100.917 117.017 95.1468 116.829 95.053L116.828 95.052C114.937 91.8257 114.586 86.1424 114.586 86.1424L114.358 86.1564C118.652 81.534 120.53 75.7328 121.307 70.8531C121.622 71.1351 121.997 71.3404 122.423 71.3424C123.699 71.3478 125.417 69.5089 127.272 62.3705C129.594 53.4361 127.404 51.6933 125.296 51.7201C124.995 51.7237 124.696 51.7629 124.411 51.8236L124.419 51.771L124.425 51.7308C130.315 26.9875 118.041 26.0466 116.088 26.0503C115.923 26.0503 115.832 26.0573 115.832 26.0573C114.789 21.399 108.867 16.5729 102.686 16.4158C101.803 16.3927 100.913 16.4657 100.033 16.6479C97.8332 17.1031 94.9011 17.2569 91.9102 17.2495C85.3282 17.2351 82.6779 19.694 82.6779 19.694L80.8902 21.6703C65.9107 30.8262 72.1383 51.6487 72.1383 51.6487L72.1329 51.8433C71.7409 51.7253 71.6454 51.7248 71.2451 51.7226L71.1483 51.7221C69.0475 51.706 66.8756 53.4629 69.1901 62.3725C71.0291 69.4502 72.7348 71.3177 74.0076 71.3445C74.3637 71.3535 74.686 71.2158 74.9672 71.0088C75.7577 75.8494 77.6378 81.5718 81.8768 86.1427C81.8768 86.1427 81.48 92.5616 79.26 95.6272C79.26 95.6272 68.0225 100.889 54.4762 104.341C44.592 106.859 43.9171 118.104 44.2739 124H152.188Z" fill="white" />
        </svg>
      ) : (
        <svg width="128" height="121" viewBox="0 0 128 121" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M87.0751 81.7202C87.1232 82.0652 87.1818 82.4434 87.2524 82.8412C87.4562 83.9882 87.7196 85.054 88.0163 85.9086C88.154 85.9728 88.2998 86.0406 88.4534 86.1115C89.8019 86.7342 91.751 87.604 94.1414 88.5864C98.9383 90.5578 105.436 92.9506 112.379 94.7204C120.031 96.6686 123.968 102.211 125.793 107.645C126.609 110.073 127.041 112.559 127.246 114.865L127.26 114.862L127.263 115.052C127.383 116.483 127.37 117.905 127.357 119.33V119.33C127.352 119.886 127.347 120.442 127.35 121H0.736328C0.746714 116.437 0.763819 112.059 2.25158 107.636C4.07846 102.205 8.01593 96.6678 15.6636 94.7189C22.6815 92.9308 29.135 90.664 33.8483 88.8353C36.1989 87.9234 38.1023 87.126 39.4098 86.5605C39.5668 86.4926 39.7151 86.4281 39.8545 86.3671C40.1679 85.5788 40.4818 84.4737 40.7315 83.1555C40.8103 82.7397 40.8761 82.3401 40.9306 81.9714C37.6171 77.7502 35.7027 73.0506 34.6034 68.7618C32.9643 67.8315 31.8226 66.3456 31.0849 65.1198C29.8196 63.0173 28.7133 60.0382 27.6774 56.0513C26.3826 51.0671 25.9842 46.9182 27.0508 43.7141C27.5752 42.1385 28.4854 40.7067 29.8352 39.6505C29.4676 37.2133 29.174 34.0143 29.3489 30.493C29.725 22.9243 32.3569 13.0791 41.9448 6.84988C42.1177 6.65866 42.2879 6.46252 42.4585 6.26586C42.9139 5.74095 43.3725 5.21234 43.8963 4.76364C44.4335 4.30342 45.6357 3.40994 47.5934 2.60207C52.3866 0.624149 58.0324 0.437663 63.435 0.259212C65.3182 0.197009 67.1718 0.135782 68.9495 0C73.5584 0.11813 77.8541 1.94694 81.1403 4.4404C83.3391 6.10881 85.3547 8.28489 86.7035 10.7983C89.1974 11.4108 92.4274 12.8577 95.0435 16.2367C98.7706 21.0509 100.271 28.5284 98.3169 39.7354C99.5965 40.7744 100.47 42.1594 100.982 43.6829C102.061 46.8933 101.662 51.0538 100.364 56.0493C99.32 60.0675 98.2039 63.0656 96.9231 65.1739C96.15 66.4465 94.9306 68.0002 93.1714 68.9046C92.088 73.0715 90.2327 77.612 87.0751 81.7202Z" fill="white" />
        </svg>
      )}
    </div>

    {forCommunity ? (
      <div className={styles.title}>Run<br />Your<br />Community</div>
    ) : (
      <div className={styles.title}>Join<br />Community</div>
    )}

    <div className={styles.button}>
      <Button
        strech
        red
        big
        cap
        url={authorized ? urls.getOrganizationCrerateUrl() : undefined}
        onClick={authorized ? undefined : () => authShowPopup(urls.getOrganizationCrerateUrl())}
      >
        Get started
      </Button>
    </div>
  </div>
);

CommunityBanner.propTypes = {
  authorized: PropTypes.bool.isRequired,
  authShowPopup: PropTypes.func.isRequired,
  forCommunity: PropTypes.bool,
};

CommunityBanner.defaultProps = {
  forCommunity: true,
};

export default connect(
  state => ({
    authorized: Boolean(state.user.data.id),
  }),
  {
    authShowPopup,
  },
)(CommunityBanner);
