import { Action } from '@ngrx/store';

export enum RegistrationActionTypes {
  NewRegistration = '[Registration] New',
  StepUpdate = '[Registration] Step Update',
  StepCompletion = '[Registration] Step Completion',
}

export class NewRegistration implements Action {
  readonly type = RegistrationActionTypes.NewRegistration;
  constructor(public payload: { userId: string }) {}
}

export class StepUpdate implements Action {
  readonly type = RegistrationActionTypes.StepUpdate;
  constructor(public payload: { step: string, data: any }) {}
}

export class StepCompletion implements Action {
  readonly type = RegistrationActionTypes.StepCompletion;
  constructor(public payload: { step: string }) {}
}

export type RegistrationActions = StepCompletion
  | NewRegistration
  | StepUpdate;
