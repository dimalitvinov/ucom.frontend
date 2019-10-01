import PropTypes from 'prop-types';
import React from 'react';
import styles from './styles.css';
import * as Icons from '../../../Icons';

const Memo = ({ text }) => {
  if (!text) {
    return null;
  }

  return (
    <div className={styles.memo}>
      <div className={styles.header}>
        <Icons.Message /> Memo
      </div>
      <div className={styles.body}>{text}</div>
    </div>
  );
};

Memo.propTypes = {
  text: PropTypes.string,
};

Memo.defaultProps = {
  text: undefined,
};

export default Memo;
