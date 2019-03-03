import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AboutForm } from 'app/registration/about/about.component';

import { ContactForm } from 'app/registration/contact/contact.component';
import { ProfileForm } from 'app/registration/profile/profile.component';
import { BillingForm } from 'app/registration/subscription/subscription.component';
import { RegistrationActions, RegistrationActionTypes } from './registration.actions';

interface StepValidity {
  _completed: boolean;
}

export interface State {
  userId?: string;
  contact?: ContactForm & StepValidity;
  subscription?: BillingForm & StepValidity;
  about?: AboutForm & StepValidity;
  profile?: ProfileForm & StepValidity;
  done?: StepValidity;
}

export const initialState: State = {};

export function reducer(state = initialState, action: RegistrationActions): State {
  switch (action.type) {

    // Will reset existing data of registration if different user
    case RegistrationActionTypes.NewRegistration:
      const { userId } = action.payload;
      const newState = userId !== state.userId ? { userId } : state;
      console.log('newState', newState);
      return newState;

    case RegistrationActionTypes.StepUpdate: {
      const { step, data } = action.payload;
      return { ...state, [step]: { ...state[step], ...data } };
    }

    case RegistrationActionTypes.StepCompletion: {
      const { step } = action.payload;
      return { ...state, [step]: { ...state[step], _completed: true } };
    }

    default:
      return state;
  }
}

export const selectRegistrationState = createFeatureSelector('registration');

export const selectRegistrationUserId = createSelector(
  selectRegistrationState,
  (state: State) => state.userId,
);

export const selectRegistrationStepValidity = createSelector(
  selectRegistrationState,
  (state: State) => {
    // Also require each previous step
    console.log(state);

    const contact = Boolean(state.contact && state.contact._completed);
    const subscription = Boolean(state.subscription && state.subscription._completed) && contact;
    const about = Boolean(state.about && state.about._completed) && subscription;
    const profile = Boolean(state.profile && state.profile._completed) && about;
    const done = Boolean(state.done && state.done._completed) && profile;

    return {
      contact,
      subscription,
      about,
      profile,
      done
    }
  }
);
