import PropTypes from 'prop-types';
import { Element } from 'react-scroll';
import { pick, cloneDeep, uniqBy } from 'lodash';
import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';
import Menu from './Menu';
import DropzoneWrapper from '../DropzoneWrapper';
import IconOrganization from '../Icons/Organization';
import IconRemove from '../Icons/Remove';
import IconCover from '../Icons/Cover';
import TextInput from '../TextInput';
import Textarea from '../TextareaAutosize';
import EntryCard from '../EntryCard';
import urls from '../../utils/urls';
import { getUserName } from '../../utils/user';
import Button from '../Button/index';
import SearchInput from '../SearchInput';
import Validate from '../../utils/validate';
import UserPick from '../UserPick/UserPick';
import { getUsersTeamStatusById } from '../../utils/organization';
import api from '../../api';
import { validUrl, extractSitename } from '../../utils/url';
import withLoader from '../../utils/withLoader';
import {
  addSuccessNotification,
  addValidationErrorNotification,
  addErrorNotification,
  addErrorNotificationFromResponse,
} from '../../actions/notifications';
import { updateOrganization, createOrganization } from '../../actions/organizations';
import { SOURCE_TYPE_EXTERNAL, SOURCE_TYPE_INTERNAL } from '../../utils/constants';
import { entityHasCover, entityAddCover, entityGetCoverUrl } from '../../utils/entityImages';
import EmbedService from '../../utils/embedService';
import styles from './styles.css';

const defaultOrg = {
  title: '',
  nickname: '',
  avatarFilename: '',
  about: '',
  country: '',
  city: '',
  email: '',
  phoneNumber: '',
  personalWebsiteUrl: '',
  socialNetworks: [],
  usersTeam: [],
  partnershipSources: [],
  communitySources: [],
  entityImages: {},
};

const ORG_EDITABLE_PROPS = ['id', ...Object.keys(defaultOrg)];

const OrganizationProfile = ({
  owner,
  organization,
  onSuccess,
}) => {
  const [data, setData] = useState({});
  const [errors, setErrors] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [edited, setEdited] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(undefined);
  const [adminSearchVisible, setAdminSearchVisible] = useState(false);
  const [partnersSearchVisible, setPartnersSearchVisible] = useState(false);
  const dispatch = useDispatch();

  const validate = (data) => {
    const { errors, isValid } = Validate.validateOrganization(data);

    setErrors(errors);

    return isValid;
  };

  const setDataAndValidate = (data) => {
    setEdited(true);
    setData(data);
    validate(data);
  };

  const submit = async (data) => {
    const isValid = validate(data);

    setSubmited(true);

    if (!isValid) {
      dispatch(addValidationErrorNotification());
    }

    if (!isValid || loading) {
      return;
    }

    setLoading(true);

    try {
      const result = await withLoader(data.id ? dispatch(updateOrganization(data)) : dispatch(createOrganization(data)));
      dispatch(addSuccessNotification(data.id ? 'Community has been saved' : 'Community has been created'));
      setTimeout(() => onSuccess(result), 0);
    } catch (err) {
      setErrors(Validate.parseResponseError(err.response));
      dispatch(addValidationErrorNotification());
    }

    setLoading(false);
  };

  const uploadAndSetCover = async (file) => {
    let result;

    setLoading(true);

    try {
      result = await withLoader(api.uploadOneImage(file));
    } catch (err) {
      dispatch(addErrorNotificationFromResponse(err));
    }

    if (result) {
      try {
        const entityImages = entityAddCover(data.entityImages, result.files[0]);
        setDataAndValidate({ ...data, entityImages });
      } catch (err) {
        dispatch(addErrorNotification(err.message));
      }
    }

    setLoading(false);
  };

  const getDataFromOrg = () => {
    const data = {
      ...defaultOrg,
      ...cloneDeep(pick(organization, ORG_EDITABLE_PROPS)),
    };

    if (data.socialNetworks) {
      data.socialNetworks = data.socialNetworks.filter(item => item.sourceUrl);
    }

    setData(data);
  };

  useEffect(() => {
    getDataFromOrg();
  }, [organization]);

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        submit(data);
      }}
    >
      <div className={styles.grid}>
        <div className={`${styles.sidebar} ${styles.organization}`}>
          <Menu
            create={!data.id}
            sections={[
              { title: 'General', name: 'general' },
              { title: 'Board', name: 'board' },
              { title: 'About', name: 'about' },
              { title: 'Contacts', name: 'contacts' },
              { title: 'Links', name: 'links' },
              { title: 'Location', name: 'cocation' },
            ]}
            submitDisabled={loading}
            submitVisible={edited}
          />
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>{data.id ? 'Edit Community Profile' : 'New Community'}</h2>

          <Element
            name="general"
            className={styles.section}
          >
            <h3 className={styles.subTitle}>General</h3>

            <div className={styles.field}>
              <div className={styles.label}>Cover</div>
              <div className={styles.data}>
                <DropzoneWrapper
                  className={styles.cover}
                  accept="image/jpeg, image/png"
                  onChange={uploadAndSetCover}
                >
                  {entityHasCover(data.entityImages) ? (
                    <img src={entityGetCoverUrl(data.entityImages)} alt="" />
                  ) : (
                    <IconCover />
                  )}
                </DropzoneWrapper>
              </div>
            </div>

            <div className={`${styles.field} ${styles.block}`}>
              <div className={styles.label}>Emblem</div>
              <div className={styles.data}>
                <DropzoneWrapper
                  className={styles.upload}
                  accept="image/jpeg, image/png, image/gif"
                  onChange={(avatarFilename) => {
                    setAvatarPreview(URL.createObjectURL(avatarFilename));
                    setDataAndValidate({ ...data, avatarFilename });
                  }}
                >
                  <div className={`${styles.uploadIcon} ${styles.org}`}>
                    {avatarPreview || data.avatarFilename ? (
                      <UserPick src={avatarPreview || urls.getFileUrl(data.avatarFilename)} size={100} shadow organization />
                    ) : (
                      <IconOrganization />
                    )}
                  </div>
                  <div className={styles.uploadText}>
                    Drag and drop. We support JPG, PNG or GIF files. Max file size 0,5 Mb.
                  </div>
                </DropzoneWrapper>
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>Community Name</div>
              <div className={styles.data}>
                <TextInput
                  submited={submited}
                  placeholder="Choose Nice Name"
                  value={data.title}
                  error={errors && errors.title}
                  onChange={(title) => {
                    setDataAndValidate({ ...data, title });
                  }}
                />
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>Community Link</div>
              <div className={styles.data}>
                <TextInput
                  submited={submited}
                  placeholder="datalightsus"
                  prefix="u.community/"
                  value={data.nickname}
                  error={errors && errors.nickname}
                  onChange={(nickname) => {
                    setDataAndValidate({ ...data, nickname });
                  }}
                />
              </div>
            </div>
          </Element>

          <Element
            name="board"
            className={styles.section}
          >
            <h3 className={styles.subTitle}>Board</h3>

            <div className={`${styles.field} ${styles.block}`}>
              <div className={styles.label}>Owner</div>
              <div className={styles.data}>
                {owner &&
                  <EntryCard
                    disableRate
                    avatarSrc={urls.getFileUrl(owner.avatarFilename)}
                    url={urls.getUserUrl(owner.id)}
                    title={getUserName(owner)}
                    nickname={owner.accountName}
                  />
                }
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>Administrators</div>
              <div className={`${styles.data} ${styles.entrys}`}>
                {data.usersTeam && data.usersTeam.map((item, index) => (
                  <div
                    key={index}
                    className={styles.entry}
                  >
                    <EntryCard
                      disableRate
                      avatarSrc={urls.getFileUrl(item.avatarFilename)}
                      url={urls.getUserUrl(item.id)}
                      title={getUserName(item)}
                      nickname={item.accountName}
                    />
                    <span className={styles.adminStatus}>{getUsersTeamStatusById(item.usersTeamStatus)}</span>
                    <span
                      role="presentation"
                      className={`${styles.remove} ${styles.medium}`}
                      onClick={() => {
                        const { usersTeam } = data;
                        usersTeam.splice(index, 1);
                        setDataAndValidate({ ...data, usersTeam });
                      }}
                    >
                      <IconRemove />
                    </span>
                  </div>
                ))}
                {adminSearchVisible &&
                  <SearchInput
                    autoFocus
                    value={[]}
                    onChange={(users) => {
                      const user = users[0];
                      const usersTeam = uniqBy(data.usersTeam.concat(user).filter(i => i.id !== owner.id), 'id');
                      setDataAndValidate({ ...data, usersTeam });
                      setAdminSearchVisible(false);
                    }}
                  />
                }
                <div>
                  <Button
                    small
                    type="button"
                    disabled={adminSearchVisible}
                    onClick={() => setAdminSearchVisible(true)}
                  >
                    Add Admin
                  </Button>
                </div>
              </div>
            </div>
          </Element>

          <Element
            name="about"
            className={styles.section}
          >
            <h3 className={styles.subTitle}>About</h3>

            <Textarea
              rows={5}
              submited={submited}
              placeholder="Main idea — something you want others to know about this community…"
              className={styles.textarea}
              value={data.about}
              error={errors && errors.about}
              onChange={(about) => {
                setDataAndValidate({ ...data, about });
              }}
            />
          </Element>

          <Element
            name="contacts"
            className={styles.section}
          >
            <h3 className={styles.subTitle}>Contacts</h3>

            <div className={styles.field}>
              <div className={styles.label}>Email</div>
              <div className={styles.data}>
                <TextInput
                  type="email"
                  submited={submited}
                  placeholder="example@mail.com"
                  value={data.email}
                  error={errors && errors.email}
                  onChange={(email) => {
                    setDataAndValidate({ ...data, email });
                  }}
                />
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>Phone Number</div>
              <div className={styles.data}>
                <TextInput
                  type="tel"
                  submited={submited}
                  placeholder="8 800 200 06 00 88 88"
                  value={data.phoneNumber}
                  error={errors && errors.phoneNumber}
                  onChange={(phoneNumber) => {
                    setDataAndValidate({ ...data, phoneNumber });
                  }}
                />
              </div>
            </div>
          </Element>

          <Element
            name="links"
            className={styles.section}
          >
            <h3 className={styles.subTitle}>Links</h3>

            <div className={styles.field}>
              <div className={styles.label}>Community Website</div>
              <div className={styles.data}>
                <TextInput
                  submited={submited}
                  placeholder="http://example.com"
                  value={data.personalWebsiteUrl}
                  error={errors && errors.personalWebsiteUrl}
                  onChange={(personalWebsiteUrl) => {
                    setDataAndValidate({ ...data, personalWebsiteUrl });
                  }}
                />
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>Social Networks</div>
              <div className={`${styles.data} ${styles.entrys}`}>
                {data.socialNetworks && data.socialNetworks.map((item, index) => (
                  <div className={`${styles.entry} ${styles.input}`} key={index}>
                    <TextInput
                      submited={submited}
                      placeholder="http://example.com"
                      value={item.sourceUrl}
                      error={errors && errors.socialNetworks && errors.socialNetworks[index] && errors.socialNetworks[index].sourceUrl}
                      onChange={(sourceUrl) => {
                        const { socialNetworks } = data;
                        socialNetworks[index].sourceUrl = sourceUrl;
                        setDataAndValidate({ ...data, socialNetworks });
                      }}
                    />
                    <span
                      role="presentation"
                      className={styles.remove}
                      onClick={() => {
                        const { socialNetworks } = data;
                        socialNetworks.splice(index, 1);
                        setDataAndValidate({ ...data, socialNetworks });
                      }}
                    >
                      <IconRemove />
                    </span>
                  </div>
                ))}

                <div>
                  <Button
                    small
                    type="button"
                    onClick={() => {
                      const { socialNetworks } = data;
                      socialNetworks.push({
                        sourceUrl: '',
                        sourceTypeId: 0,
                      });
                      setDataAndValidate({ ...data, socialNetworks });
                    }}
                  >
                    {data.socialNetworks && data.socialNetworks.length > 0 ? 'Add Another' : 'Add Network'}
                  </Button>
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>Partners</div>
              <div className={`${styles.data} ${styles.entrys}`}>
                {data.communitySources && data.communitySources.map((item, index) => (
                  <div
                    key={index}
                    className={styles.entry}
                  >
                    <EntryCard
                      disableRate
                      organization
                      disableSign={item.sourceType === SOURCE_TYPE_EXTERNAL}
                      isExternal={item.sourceType === SOURCE_TYPE_EXTERNAL}
                      avatarSrc={urls.getFileUrl(item.avatarFilename)}
                      url={item.sourceType === SOURCE_TYPE_EXTERNAL ? item.sourceUrl : urls.getOrganizationUrl(item.entityId)}
                      title={item.title}
                      nickname={item.sourceType === SOURCE_TYPE_EXTERNAL ? item.sourceUrl : item.nickname}
                    />
                    <span
                      role="presentation"
                      className={`${styles.remove} ${styles.medium}`}
                      onClick={() => {
                        const { communitySources } = data;
                        communitySources.splice(index, 1);
                        setDataAndValidate({ ...data, communitySources });
                      }}
                    >
                      <IconRemove />
                    </span>
                  </div>
                ))}

                {data.partnershipSources && data.partnershipSources.map((item, index) => (
                  <div
                    key={index}
                    className={styles.entry}
                  >
                    <EntryCard
                      disableRate
                      organization
                      disableSign={item.sourceType === SOURCE_TYPE_EXTERNAL}
                      isExternal={item.sourceType === SOURCE_TYPE_EXTERNAL}
                      avatarSrc={urls.getFileUrl(item.avatarFilename)}
                      url={item.sourceType === SOURCE_TYPE_EXTERNAL ? item.sourceUrl : urls.getOrganizationUrl(item.entityId)}
                      title={item.title}
                      nickname={item.sourceType === SOURCE_TYPE_EXTERNAL ? item.sourceUrl : item.nickname}
                    />
                    <span
                      role="presentation"
                      className={`${styles.remove} ${styles.medium}`}
                      onClick={() => {
                        const { partnershipSources } = data;
                        partnershipSources.splice(index, 1);
                        setDataAndValidate({ ...data, partnershipSources });
                      }}
                    >
                      <IconRemove />
                    </span>
                  </div>
                ))}

                {partnersSearchVisible &&
                  <SearchInput
                    autoFocus
                    organization
                    value={[]}
                    placeholder="Find community"
                    loadOptions={async (q) => {
                      if (validUrl(q)) {
                        try {
                          const data = await EmbedService.getDataFromUrl(q);
                          return [{
                            title: data.title,
                            description: data.description,
                            sourceUrl: q,
                            sourceType: SOURCE_TYPE_EXTERNAL,
                          }];
                        } catch (err) {
                          return [{
                            title: extractSitename(q),
                            description: extractSitename(q),
                            sourceUrl: q,
                            sourceType: SOURCE_TYPE_EXTERNAL,
                          }];
                        }
                      }

                      try {
                        const data = await api.searchCommunity(q);
                        return data.slice(0, 20);
                      } catch (err) {
                        return [];
                      }
                    }}
                    onChange={(organizations) => {
                      const organization = {
                        ...organizations[0],
                        sourceType: organizations[0].sourceType || SOURCE_TYPE_INTERNAL,
                      };
                      const partnershipSources = data.partnershipSources.concat(organization);
                      setDataAndValidate({ ...data, partnershipSources });
                      setPartnersSearchVisible(false);
                    }}
                  />
                }
                <div>
                  <Button
                    small
                    type="button"
                    disabled={partnersSearchVisible}
                    onClick={() => setPartnersSearchVisible(true)}
                  >
                    {[...(data.partnershipSources || []), ...(data.communitySources || [])].length > 0 ? 'Add Another' : 'Add Partner'}
                  </Button>
                </div>
              </div>
            </div>
          </Element>

          <Element
            name="cocation"
            className={styles.section}
          >
            <h3 className={styles.subTitle}>Location</h3>

            <div className={styles.field}>
              <div className={styles.label}>Country</div>
              <div className={styles.data}>
                <TextInput
                  submited={submited}
                  value={data.country}
                  error={errors && errors.country}
                  onChange={(country) => {
                    setDataAndValidate({ ...data, country });
                  }}
                />
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.label}>City</div>
              <div className={styles.data}>
                <TextInput
                  submited={submited}
                  value={data.city}
                  error={errors && errors.city}
                  onChange={(city) => {
                    setDataAndValidate({ ...data, city });
                  }}
                />
              </div>
            </div>
          </Element>
        </div>
      </div>
    </form>
  );
};

OrganizationProfile.propTypes = {
  owner: PropTypes.objectOf(PropTypes.any),
  organization: PropTypes.objectOf(PropTypes.any).isRequired,
  onSuccess: PropTypes.func.isRequired,
};

OrganizationProfile.defaultProps = {
  owner: undefined,
};

export default OrganizationProfile;
