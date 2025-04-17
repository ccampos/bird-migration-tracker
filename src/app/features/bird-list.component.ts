import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Bird } from '../models/bird.model';

@Component({
  selector: 'app-bird-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './bird-list.component.html',
  styleUrls: ['./bird-list.component.scss']
})

export class BirdListComponent {
  @Output() birdSelected = new EventEmitter<{ location: { lat: number; lon: number }, destination: { lat: number; lon: number } }>();

  selectBird(bird: Bird) {
    this.birdSelected.emit({
      location: bird.location,
      destination: bird.destination
    });
  }

  birds = [
    {
      name: 'Arctic Tern',
      species: 'Sterna Paradisaea',
      region: 'Arctic → Antarctica',
      season: 'Summer to Winter',
      location: { lat: 71.7069, lon: -42.6043 }, // Greenland
      destination: { lat: -77.8419, lon: 166.6863 } // Ross Island, Antarctica
    },
    {
      name: 'Swainson\'s Hawk',
      species: 'Buteo Swainsoni',
      region: 'North America → South America',
      season: 'Fall',
      location: { lat: 39.5501, lon: -105.7821 }, // Colorado, USA
      destination: { lat: -34.6037, lon: -58.3816 } // Buenos Aires, Argentina
    },
    {
      name: 'Barn Swallow',
      species: 'Hirundo Rustica',
      region: 'Northern Hemisphere → Southern Hemisphere',
      season: 'Spring and Fall',
      location: { lat: 50.1109, lon: 8.6821 }, // Frankfurt, Germany
      destination: { lat: -33.9249, lon: 18.4241 } // Cape Town, South Africa
    }
  ];
}