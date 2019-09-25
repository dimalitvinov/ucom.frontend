import { range } from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import styles from './styles.css';
import Transaction from './Transaction';
import Spinner from '../../Spinner';
import EmptyTransaction from './EmptyTransaction';

const Transactions = ({
  sections, showLoader, showPlaceholder, showEmptyLabel,
}) => (
  <div className={styles.transactions}>
    {showPlaceholder ? (
      <Fragment>
        {range(20).map(i => (
          <div className={styles.item} key={i}>
            <EmptyTransaction circlePick={Boolean(i % 2)} />
          </div>
        ))}
        {showEmptyLabel &&
          <div className={styles.emptyLabel}>No transactions to display at the moment</div>
        }
      </Fragment>
    ) : (
      <Fragment>
        {sections.map((section, index) => (
          <div className={styles.section} key={index}>
            <div className={styles.title}>{section.title}</div>

            {section.list.map((item, index) => (
              <div className={styles.item} key={index}>
                <Transaction {...item} />
              </div>
            ))}
          </div>
        ))}
        {showLoader &&
          <div className={styles.loader}>
            <Spinner size={40} color="rgba(0,0,0,0.2)" />
          </div>
        }
      </Fragment>
    )}
  </div>
);

Transactions.propTypes = {
  sections: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    list: PropTypes.arrayOf(PropTypes.shape(Transaction.propTypes)),
  })),
  showLoader: PropTypes.bool,
  showPlaceholder: PropTypes.bool,
  showEmptyLabel: PropTypes.bool,
};

Transactions.defaultProps = {
  sections: [],
  showLoader: true,
  showPlaceholder: false,
  showEmptyLabel: false,
};

export default Transactions;