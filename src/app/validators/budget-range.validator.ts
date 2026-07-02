import { AbstractControl, ValidationErrors } from '@angular/forms';

export function budgetRangeValidator(control: AbstractControl): ValidationErrors | null {
  const budgetMin = control.get('budgetMin')?.value;
  const budgetMax = control.get('budgetMax')?.value;

  if (budgetMin === null || budgetMax === null || budgetMin === '' || budgetMax === '') {
    return null;
  }

  return Number(budgetMax) >= Number(budgetMin) ? null : { budgetRange: true };
}
