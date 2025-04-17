import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BirdListComponent } from './features/bird-list.component';
import { MapComponent } from './features/map.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    BirdListComponent,
    MapComponent
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  selectedRoute: { location: { lat: number; lon: number }, destination: { lat: number; lon: number} } | null = null;

  onBirdSelected(route: { location: { lat: number; lon: number }, destination: { lat: number; lon: number } }) {
    this.selectedRoute = route;
  }
}
