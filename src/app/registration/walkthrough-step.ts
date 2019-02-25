import { EventEmitter } from '@angular/core';

export interface WalkthroughStep<T> {
  completed: EventEmitter<T>;
}
