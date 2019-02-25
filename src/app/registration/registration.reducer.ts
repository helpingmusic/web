import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AboutForm } from 'app/registration/about/about.component';

import { ContactForm } from 'app/registration/contact/contact.component';
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
  profile?: StepValidity;
  done?: StepValidity;
}

export const initialState: State = {};

export function reducer(state = initialState, action: RegistrationActions): State {
  switch (action.type) {

    // Will reset existing data of registration if different user
    case RegistrationActionTypes.NewRegistration:
      const { userId } = action.payload;
      return userId !== state.userId ? { userId } : state;

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

export const selectRegistrationStepValidity = createSelector(
  selectRegistrationState,
  (state: State) => ({
    contact: Boolean(state.contact && state.contact._completed),
    subscription: Boolean(state.subscription && state.subscription._completed),
    about: Boolean(state.about && state.about._completed),
    profile: Boolean(state.profile && state.profile._completed),
    done: Boolean(state.done && state.done._completed),
  })
);
