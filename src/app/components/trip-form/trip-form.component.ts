import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'app-trip-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="tripForm" (ngSubmit)="onSubmit()" class="trip-form">
      <div class="form-group">
        <label for="startPoint">Start Point:</label>
        <input 
          id="startPoint" 
          type="text" 
          formControlName="startPoint"
          placeholder="Enter start point"
          [class.error]="isFieldInvalid('startPoint')"
        >
        <div class="error-message" *ngIf="isFieldInvalid('startPoint')">
          <span *ngIf="tripForm.get('startPoint')?.errors?.['required']">Start point is required</span>
          <span *ngIf="tripForm.get('startPoint')?.errors?.['minlength']">Start point must be at least 3 characters</span>
          <span *ngIf="tripForm.get('startPoint')?.errors?.['pattern']">Start point should only contain letters</span>
        </div>
      </div>

      <div class="form-group">
        <label for="endPoint">End Point:</label>
        <input 
          id="endPoint" 
          type="text" 
          formControlName="endPoint"
          placeholder="Enter end point"
          [class.error]="isFieldInvalid('endPoint')"
        >
        <div class="error-message" *ngIf="isFieldInvalid('endPoint')">
          <span *ngIf="tripForm.get('endPoint')?.errors?.['required']">End point is required</span>
          <span *ngIf="tripForm.get('endPoint')?.errors?.['minlength']">End point must be at least 3 characters</span>
          <span *ngIf="tripForm.get('endPoint')?.errors?.['pattern']">End point should only contain letters</span>
          <span *ngIf="tripForm.get('endPoint')?.errors?.['sameAsStart']">End point cannot be same as start point</span>
        </div>
      </div>

      <button type="submit" [disabled]="!tripForm.valid || isSubmitting">Add Trip</button>
    </form>
  `,
  styles: [`
    .trip-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      margin: 1rem;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-weight: bold;
      color: #333;
    }

    input {
      padding: 0.5rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    input.error {
      border-color: #dc3545;
    }

    .error-message {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    button {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s;
    }

    button:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }

    button:hover:not(:disabled) {
      background-color: #0056b3;
    }
  `]
})
export class TripFormComponent {
  tripForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private tripService: TripService
  ) {
    this.tripForm = this.fb.group({
      startPoint: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]],
      endPoint: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-Z\s]+$/)
      ]]
    }, { validators: this.validatePoints });
  }

  validatePoints(group: FormGroup) {
    const start = group.get('startPoint')?.value?.toLowerCase();
    const end = group.get('endPoint')?.value?.toLowerCase();
    
    if (start && end && start === end) {
      group.get('endPoint')?.setErrors({ sameAsStart: true });
      return { samePoints: true };
    }
    
    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.tripForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched)) : false;
  }

  onSubmit() {
    if (this.tripForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const { startPoint, endPoint } = this.tripForm.value;
      
      // Capitalize first letter of each word
      const formattedStart = this.formatLocationName(startPoint);
      const formattedEnd = this.formatLocationName(endPoint);
      
      this.tripService.addTrip(formattedStart, formattedEnd);
      this.tripForm.reset();
      this.isSubmitting = false;
    } else {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.tripForm.controls).forEach(key => {
        const control = this.tripForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  private formatLocationName(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
} 