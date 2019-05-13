import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Element } from 'react-scroll';
import urls from '../utils/urls';
import { getUserById } from '../store/users';
import { addUsers, updateUser } from '../actions/users';
import { selectUser } from '../store/selectors/user';
import Popup from '../components/Popup/';
import Content from '../components/Popup/Content';
import VerticalMenu from '../components/VerticalMenu/index';
import styles from './Profile.css';
import TextInput from '../components/TextInput';
import Textarea from '../components/Textarea';
import Button from '../components/Button/index.jsx';
import Avatar from '../components/EntryHeader/Avatar';
import SocialNetworks from '../components/SN';
import { userFormHandleSubmit } from '../actions/userForm';
import { validator } from '../utils/validateFields';

const Profile = (props) => {
  // if (!props.user.id) {
  //   return <Redirect to="/" />;
  // }

  const owner = getUserById(props.users, props.user.id);

  if (!owner) {
    return null;
  }

  const [userData, setUserData] = useState(owner);
  const [errors, setErrors] = useState({});
  const [isSubmited, setIsSubmited] = useState(false);

  useEffect(() => {
    setUserData({
      ...userData,
      id: owner.id,
      firstName: owner.firstName,
      avatarFilename: owner.avatarFilename,
      about: owner.about,
      personalWebsiteUrl: owner.personalWebsiteUrl,
      usersSources: owner.usersSources || [],
    });
  }, (owner));

  // useEffect(() => {
  //   try {
  //     validator(userData);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, (isSubmited));

  const onChange = (key, value) => {
    // console.log('key: ', key);
    // console.log('value: ', value);
    console.log('userData: ', userData);
    setUserData({ ...userData, key: { ...value } });
    // setUserData(data);
    console.log('userData: ', userData);
    // try {
    //   validator(userData);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  const saveProfile = () => {
    // props.userFormHandleSubmit();
    try {
      setErrors(validator(userData));
      console.log('aaa: ', errors);
    } catch (error) {
      setErrors({ ...errors, error });
      console.log(error);
    }
    // console.log('id: ', userData.id);
    // props.updateUser(userData);
    // return <Redirect to={`/user/${this.props.user.id}`} />;
  };


  return (
    <div className={styles.page}>
      <Popup onClickClose={props.onClickClose}>
        <Content onClickClose={() => {}}>
          <div className={styles.profile}>
            <div className={styles.sidebar}>
              <VerticalMenu
                sticky
                sections={[
                  { name: 'PersonalInfo', title: 'Personal info' },
                  { name: 'AboutMe', title: 'About Me' },
                  { name: 'Links', title: 'Links' },
                ]}
              />
              {owner ? (
                <Fragment>
                  <div className={styles.btnSave}>
                    <Button
                      onClick={() => saveProfile()}
                    >
                      Save Changes
                    </Button>
                  </div>
                  <div className={styles.link}>Go to <a href="#">Account Settings</a></div>
                </Fragment>
              ) : (
                <div className={styles.btnSave}><Button red>Create</Button></div>
              )}
            </div>
            <div className={styles.content}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveProfile();
                }}
              >
                <div className={styles.header}>
                  <h2 className={styles.title}>{owner ? 'Edit Your Profile' : 'Your Profile'}</h2>
                  <p>Few words about profile its how it will affect autoupdates and etc. Maybe some tips)</p>
                </div>

                <div>
                  <Element name="PersonalInfo" className={styles.section}>
                    <h3 className={styles.title}>Personal Info</h3>
                    <div className={styles.field}>
                      <div className={styles.label}>Avatar</div>
                      <div className={styles.avatarBlock}>
                        <div className={styles.avatar}>
                          <Avatar
                            src={urls.getFileUrl(owner.avatarFilename)}
                            changeEnabled
                            onChange={async (file) => {
                              // setUserData({ ...userData, avatarFilename: file.preview });
                              props.addUsers([{
                                id: +userData.id,
                                avatarFilename: file.preview,
                              }]);
                              props.updateUser({
                                avatarFilename: file,
                              });
                            }}
                          />
                        </div>
                        <div>
                          Drag and drop. We support JPG, PNG or GIF files. Max file size 0,5 Mb.
                        </div>
                      </div>
                    </div>
                    <div className={classNames(styles.field, styles.fieldRequired)}>
                      <div className={styles.label}>Displayed name</div>
                      <div className={styles.inputBlock}>
                        <TextInput
                          topLabel
                          isRequired
                          placeholder="Nickname or name, maybe emoji…"
                          // className={styles.input}
                          error={errors.firstName}
                          value={userData.firstName}
                          onChange={value => setUserData({ ...userData, firstName: value })}
                        />
                      </div>
                    </div>
                  </Element>
                  <Element name="AboutMe" className={styles.section}>
                    <h3 className={styles.title}>About Me</h3>
                    <div className={styles.textarea}>
                      <Textarea
                        placeholder="Your story, what passions you — something you want others to know about you"
                        rows={6}
                        value={userData.about}
                        onChange={value => setUserData({ ...userData, about: value })}
                        isMentioned
                      />
                    </div>
                  </Element>
                  <Element name="Links" className={styles.section}>
                    <h3 className={styles.title}>Links</h3>
                    <div className={styles.field}>
                      <div className={styles.label}>My Website</div>
                      <div className={styles.inputBlock}>
                        <TextInput
                        // className={styles.input}
                          error={errors.personalWebsiteUrl}
                          value={userData.personalWebsiteUrl}
                          onChange={value => setUserData({ ...userData, personalWebsiteUrl: value })}
                        />
                      </div>
                    </div>
                    <SocialNetworks
                      fields={userData.usersSources}
                      onChange={value => setUserData({ ...userData, usersSources: value })}
                      errors={errors}
                    />
                  </Element>
                </div>
              </form>
            </div>
          </div>
        </Content>
      </Popup>
    </div>
  );
};

Profile.propTypes = {
  users: PropTypes.objectOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
  updateUser: PropTypes.func.isRequired,
  addUsers: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    users: state.users,
    user: selectUser(state),
    userData: state.userData,
  }),
  dispatch => bindActionCreators({
    addUsers,
    updateUser,
    userFormHandleSubmit,
  }, dispatch),
)(Profile);
