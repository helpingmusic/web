import { AbstractControl, ValidatorFn } from '@angular/forms';

/**
 * Confirm that all given fields match
 * @param fields - field names to compare
 */

export function fieldMatcher(...fields: string[]): ValidatorFn {
  return (ctrl: AbstractControl): {[key: string]: any} | null => {
    const match = fields.every((f) => ctrl.get(f).value === ctrl.get(fields[0]).value);
    if (!match) {
      ctrl.get(fields[fields.length - 1]).setErrors({ match: true })
    }
    return null;
  }
}

