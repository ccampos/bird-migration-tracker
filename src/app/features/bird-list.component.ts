import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Bird } from '../models/bird.model';
import { birds } from '../data/birds';
import { interpolatePosition } from '../utils/migration-utils';

@Component({
  selector: 'app-bird-list',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './bird-list.component.html',
  styleUrls: ['./bird-list.component.scss']
})

export class BirdListComponent {
  @Output() birdSelected = new EventEmitter<Bird>();
  birds = birds;
  selectedBird: Bird | null = null;

  selectBird(bird: Bird) {
    this.selectedBird = bird;
    this.birdSelected.emit(bird);
  }

  ngOnInit(): void {
    const currentMonth = new Date().getMonth(); // 0 = Jan, 11 = Dec

    this.birds = this.birds.map((bird: Bird) => ({
      ...bird,
      currentPosition: interpolatePosition(bird.location, bird.destination, currentMonth)
    }));
  }

  getBirdImagePath(birdName: string): string {
    return 'assets/birds/' + birdName.toLowerCase().replace(/ /g, '-') + '.png';
  }
}