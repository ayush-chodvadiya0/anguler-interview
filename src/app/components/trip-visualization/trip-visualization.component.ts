import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trip.model';

@Component({
  selector: 'app-trip-visualization',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="visualization-container">
      <div class="trips-container">
        <div *ngFor="let level of getLevels()" class="level-container" [style.top]="(level - 1) * 60 + 'px'">
          <ng-container *ngFor="let location of getUniqueLocationsForLevel(level); let i = index">
            <div class="location">{{ location.slice(0, 3) }}</div>
            <div *ngIf="i < getUniqueLocationsForLevel(level).length - 1" class="line">
              <div class="arrow"></div>
            </div>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .visualization-container {
      margin: 2rem;
      padding: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      overflow-x: auto;
    }

    .trips-container {
      position: relative;
      min-height: 200px;
    }

    .level-container {
      position: absolute;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      height: 40px;
      transition: top 0.3s ease;
      padding: 0 1rem;
    }

    .location {
      background-color: #007bff;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-weight: bold;
      text-transform: uppercase;
      white-space: nowrap;
      z-index: 1;
      min-width: 60px;
      text-align: center;
    }

    .line {
      width: 100px;
      height: 2px;
      background-color: #007bff;
      margin: 0 0.5rem;
      position: relative;
      flex-shrink: 0;
    }

    .arrow {
      position: absolute;
      right: -6px;
      top: -4px;
      width: 0;
      height: 0;
      border-left: 6px solid #007bff;
      border-top: 5px solid transparent;
      border-bottom: 5px solid transparent;
    }
  `]
})
export class TripVisualizationComponent implements OnInit {
  trips: Trip[] = [];

  constructor(private tripService: TripService) {}

  ngOnInit() {
    this.tripService.getTrips().subscribe(trips => {
      this.trips = trips;
    });
  }

  getLevels(): number[] {
    if (!this.trips.length) return [];
    const maxLevel = Math.max(...this.trips.map(trip => trip.level));
    return Array.from({ length: maxLevel }, (_, i) => i + 1);
  }

  getUniqueLocationsForLevel(level: number): string[] {
    const levelTrips = this.trips.filter(trip => trip.level === level);
    if (!levelTrips.length) return [];

    // Create an ordered set of locations
    const locations = new Set<string>();
    
    // Add all start points first
    levelTrips.forEach(trip => {
      locations.add(trip.startPoint);
    });

    // Then add all end points
    levelTrips.forEach(trip => {
      locations.add(trip.endPoint);
    });

    // Convert to array and sort based on trip order
    const locationsArray = Array.from(locations);
    
    // Sort locations based on trip sequence
    return locationsArray.sort((a, b) => {
      // Find the first trip where a or b appears as start point
      const tripWithA = levelTrips.find(trip => trip.startPoint === a);
      const tripWithB = levelTrips.find(trip => trip.startPoint === b);
      
      if (!tripWithA && !tripWithB) return 0;
      if (!tripWithA) return 1;
      if (!tripWithB) return -1;
      
      return levelTrips.indexOf(tripWithA) - levelTrips.indexOf(tripWithB);
    });
  }
} 