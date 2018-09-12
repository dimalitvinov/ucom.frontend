import Validator from 'validatorjs';
import * as rules from './../utils/validators/';
import { validateArrayUrls, isEmptyStrings } from './../utils/validators/custom';
import { validatorRules } from './../utils/constants';

rules.registerPhoneNumber.rule(Validator, /^[\d -]*$/);

const getInitialState = () => ({
  errors: {
    userSources: {
      isValid: false,
      results: [],
    },
  },
  isValid: false,
});

const user = (state = getInitialState(), action) => {
  switch (action.type) {
    case 'SET_USER':
      return Object.assign({}, state, action.payload);
    case 'REMOVE_USER':
      return getInitialState();

    case 'CHANGE_USER_FIELD': {
      const { field, value, validationRules } = action.payload;
      const data = {
        ...state.data,
        [field]: value,
      };

      const validation = new Validator(data, validatorRules.user[validationRules]);

      validation.passes();

      return {
        ...state,
        ...data,
        errors: {
          ...state.errors,
          [field]: validation.errors.get([field]),
        },
      };
    }

    case 'ADD_USER_PERSONAL_SITE': {
      const { userSources } = state;
      if (!Array.isArray(userSources)) {
        return {
          ...state,
          userSources: [userSources].concat({
            sourceUrl: '',
          }),
        };
      }
      return {
        ...state,
        userSources: state.userSources.concat({
          sourceUrl: '',
        }),
      };
    }

    case 'REMOVE_USER_PERSONAL_SITE': {
      const index = action.payload;

      const returnSources = () => {
        const possibleNewSources = [
          ...state.userSources.slice(0, index),
          ...state.userSources.slice(index + 1),
        ];

        if (possibleNewSources.length !== 0) {
          return possibleNewSources;
        }
        return [
          ...state.userSources.slice(0, index),
          ...state.userSources.slice(index + 1),
        ].concat('');
      };

      return {
        ...state,
        userSources: returnSources(),
        errors: {
          ...state.errors,
          userSources: {
            ...state.errors.userSources,
            results: [
              ...state.errors.userSources.results.slice(0, -1),
            ],
          },
        },
      };
    }

    case 'CHANGE_USER_PERSONAL_SITE': {
      const { index, value } = action.payload;
      const { userSources } = state;

      const returnSources = () => {
        if (!Array.isArray(userSources)) {
          return [{ sourceUrl: value }];
        }
        if (index > userSources.length) {
          return [...userSources, { sourceUrl: value }];
        }
        return userSources.map((source, sourceIndex) => (sourceIndex === index ? { ...source, sourceUrl: value } : source));
      };

      const data = {
        userSources: returnSources(),
      };

      const sourcesUrls = data.userSources.map(source => source.sourceUrl);

      return {
        ...state,
        ...data,
        errors: {
          ...state.errors,
          userSources: isEmptyStrings(sourcesUrls) ? undefined : validateArrayUrls(sourcesUrls),
        },
      };
    }

    case 'ADD_USER_EDUCATION_ITEM': {
      const returnUserEducations = () => {
        if (Array.isArray(state.userEducations)) {
          return state.userEducations.concat({
            endDate: null,
            startDate: null,
            isCurrent: false,
            degree: '',
            speciality: '',
            title: '',
          });
        }
        return [];
      };
      return {
        ...state,
        userEducations: returnUserEducations(),
      };
    }

    case 'CHANGE_USER_EDUCATION_ITEM': {
      const { index } = action.payload;
      const { userEducations } = state;
      const fieldKey = Object.keys(action.payload).filter(key => key !== 'index')[0];
      const fieldValue = action.payload[fieldKey];
      const value = {
        [fieldKey]: fieldValue,
      };
      const returnUserEducations = () => {
        if (index > userEducations.length) {
          return [...userEducations, value];
        }
        return userEducations.map((userEducation, userEducationIndex) => {
          if (userEducationIndex === index) {
            return {
              ...userEducation,
              ...value,
            };
          }
          return userEducation;
        });
      };

      return {
        ...state,
        userEducations: returnUserEducations(),
      };
    }

    case 'REMOVE_USER_EDUCATION_ITEM': {
      const index = action.payload;

      const returnUserEducations = () => {
        const possibleNewUserEducations = [
          ...state.userEducations.slice(0, index),
          ...state.userEducations.slice(index + 1),
        ];

        if (possibleNewUserEducations.length !== 0) {
          return possibleNewUserEducations;
        }
        return [
          ...state.userEducations.slice(0, index),
          ...state.userEducations.slice(index + 1),
        ].concat({
          endDate: null,
          startDate: null,
          isCurrent: false,
          degree: '',
          speciality: '',
          title: '',
        });
      };

      return {
        ...state,
        userEducations: returnUserEducations(),
      };
    }

    case 'ADD_USER_JOB_ITEM': {
      const returnUserJobs = () => {
        if (Array.isArray(state.userJobs)) {
          return state.userJobs.concat({
            endDate: null,
            startDate: null,
            isCurrent: false,
            title: '',
            position: '',
          });
        }
        return [];
      };
      return {
        ...state,
        userJobs: returnUserJobs(),
      };
    }

    case 'CHANGE_USER_JOB_ITEM': {
      const { index } = action.payload;
      const fieldKey = Object.keys(action.payload).filter(key => key !== 'index')[0];
      const fieldValue = action.payload[fieldKey];
      const value = {
        [fieldKey]: fieldValue,
      };
      const { userJobs } = state;

      const returnUserJobs = () => {
        if (index > userJobs.length) {
          return [...userJobs, value];
        }
        return userJobs.map((userJob, userJobIndex) => {
          if (userJobIndex === index) {
            return {
              ...userJob,
              ...value,
            };
          }
          return userJob;
        });
      };
      return {
        ...state,
        userJobs: returnUserJobs(),
      };
    }

    case 'ADD_USER_REMOVE_ITEM': {
      const index = action.payload;

      const returnUserJobs = () => {
        const possibleNewUserJobs = [
          ...state.userJobs.slice(0, index),
          ...state.userJobs.slice(index + 1),
        ];

        if (possibleNewUserJobs.length !== 0) {
          return possibleNewUserJobs;
        }
        return [
          ...state.userJobs.slice(0, index),
          ...state.userJobs.slice(index + 1),
        ].concat({
          endDate: null,
          startDate: null,
          isCurrent: false,
          title: '',
          position: '',
        });
      };

      return {
        ...state,
        userJobs: returnUserJobs(),
      };
    }

    case 'VALIDATE_PROFILE_FORM': {
      const validation = new Validator(state, validatorRules.user[action.payload]);
      const passes = validation.passes();
      const shouldValidateSources = action.payload === 'contactsRules';
      if (shouldValidateSources) {
        const sourcesUrls = state.userSources.map(source => source.sourceUrl);
        const validUrls = state.errors.userSources
          && (validateArrayUrls(sourcesUrls).isValid || isEmptyStrings(sourcesUrls));
        return {
          ...state,
          isValid: passes && validUrls,
          errors: {
            ...validation.errors.all(),
            userSources: state.errors.userSources,
          },
        };
      }
      return {
        ...state,
        isValid: passes,
        errors: {
          ...validation.errors.all(),
          userSources: state.errors.userSources,
        },
      };
    }

    case 'CLEAR_PROFILE_FORM_ERRORS': {
      return {
        ...state,
        ...getInitialState(),
      };
    }

    default:
      return state;
  }
};

export default user;