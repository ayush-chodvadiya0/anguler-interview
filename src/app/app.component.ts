import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TripFormComponent } from './components/trip-form/trip-form.component';
import { TripVisualizationComponent } from './components/trip-visualization/trip-visualization.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TripFormComponent, TripVisualizationComponent],
  template: `
    <div class="container">
      <h1>Trip Planner</h1>
      <app-trip-form></app-trip-form>
      <app-trip-visualization></app-trip-visualization>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'Trip Planner';
} 