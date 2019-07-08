import { endsWith, clamp } from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutBase, Content } from '../../components/Layout';
import TextInput from '../../components/TextInput';
import { TableUsers } from '../../components/Table';
import * as usersPageActions from '../../actions/pages/users';
import withLoader from '../../utils/withLoader';
import { addErrorNotificationFromResponse } from '../../actions/notifications';
import Pagination from '../../components/Pagination';
import Footer from '../../components/Footer';
import urls from '../../utils/urls';
import styles from './styles.css';

const Users = ({ location, history }) => {
  const urlParams = new URLSearchParams(location.search);
  const page = urlParams.get('page') || 1;
  const perPage = clamp(urlParams.get('perPage') || 20, 50);
  const orderBy = urlParams.get('orderBy') || '-current_rate';
  const userName = urlParams.get('userName') || '';
  const state = useSelector(state => state.pages.users);
  const dispatch = useDispatch();

  const getData = async (page, perPage, orderBy, userName, append) => {
    try {
      await withLoader(dispatch(usersPageActions.getUsers(page, perPage, orderBy, userName, append)));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }
  };

  const changePage = (page, perPage, orderBy, userName) => {
    history.push(urls.getUsersPagingUrl({
      page, perPage, orderBy, userName,
    }));
  };

  useEffect(() => {
    getData(page, perPage, orderBy, userName);
    window.scrollTo(0, 0);
  }, [location.search]);

  useEffect(() => (
    () => {
      dispatch(usersPageActions.reset());
    }
  ), []);

  return (
    <LayoutBase>
      <Content>
        <div className={styles.header}>
          <h1 className={styles.title}>People</h1>
          <div className={styles.search}>
            <TextInput
              placeholder="Search"
            />
          </div>
        </div>
        <div className={styles.table}>
          <TableUsers
            startIndex={Number(((page - 1) * perPage) + 1)}
            userIds={state.ids}
            orderBy={orderBy}
            onSort={(col) => {
              changePage(
                page,
                perPage,
                endsWith(orderBy, col.name) ? col.reverse ? `-${col.name}` : col.name : `-${col.name}`,
                userName,
              );
            }}
          />
        </div>

        <Pagination
          {...state.metadata}
          onClickShowMore={() => {
            getData(
              state.metadata.page + 1,
              perPage,
              orderBy,
              userName,
              true,
            );
          }}
          onChange={(page) => {
            changePage(
              page,
              perPage,
              orderBy,
              userName,
            );
          }}
        />

        <Footer />
      </Content>
    </LayoutBase>
  );
};

Users.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Users;