import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import { Bird } from '../models/bird.model';
import * as geometryEngine from '@arcgis/core/geometry/geometryEngine';
import Polyline from '@arcgis/core/geometry/Polyline';
import Point from '@arcgis/core/geometry/Point';
import TextSymbol from '@arcgis/core/symbols/TextSymbol';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, OnChanges {
  @ViewChild('mapViewDiv', { static: true }) mapViewEl!: ElementRef;
  @Input() selectedBird: Bird | null = null;

  private mapView!: MapView;
  private graphicsLayer = new GraphicsLayer();
  private animationIntervalId: any;

  ngOnInit(): void {
    const map = new Map({
      basemap: 'topo-vector'
    });

    map.add(this.graphicsLayer);

    this.mapView = new MapView({
      container: this.mapViewEl.nativeElement,
      map,
      center: [-98.5795, 39.8283], // Center of USA
      zoom: 3
    });

    const currentMonth = new Date().getMonth();
  }

  ngOnChanges(): void {
    if (this.selectedBird && this.mapView) {
      this.graphicsLayer.removeAll();

      this.animateBird(this.selectedBird);
    }
  }

  ngOnDestroy(): void {
    if (this.animationIntervalId) {
      clearInterval(this.animationIntervalId);
    }
  }

  private animateBird(bird: Bird): void {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let label = new Graphic({
      geometry: new Point({ longitude: 0, latitude: 0 }), // placeholder
      symbol: new TextSymbol({
        text: '', // to be set dynamically
        color: 'black',
        haloColor: 'white',
        haloSize: '1px',
        font: {
          size: 12,
          family: 'sans-serif'
        },
        yoffset: 20 // so it appears above the bird
      })
    });

    this.graphicsLayer.add(label);

    const geoLine = new Polyline({
      paths: [
        [
          [bird.location.lon, bird.location.lat],
          [0, 0], // midpoint forces arc over the globe
          [bird.destination.lon, bird.destination.lat]
        ]
      ]
    });

    const curvedLine = geometryEngine.geodesicDensify(geoLine, 5000) as Polyline;
    const path = curvedLine.paths[0]; // Get array of [lon, lat] pairs

    const filteredPath = path.filter((point: number[], index: number, arr: number[][]) => {
      if (index === 0) return true;
      const [lon1, lat1] = arr[index - 1];
      const [lon2, lat2] = point;

      const distance = Math.sqrt((lon2 - lon1) ** 2 + (lat2 - lat1) ** 2);
      return distance > 0.01; // Adjust threshold if needed
    });

    // Draw the curved line once
    const lineGraphic = new Graphic({
      geometry: curvedLine,
      symbol: {
        type: 'simple-line',
        color: 'blue',
        width: 0.5,
        style: 'dash'
      }
    });

    this.graphicsLayer.add(lineGraphic);

    const marker = new Graphic({
      geometry: new Point({ longitude: 0, latitude: 0 }), // placeholder
      symbol: {
        type: 'picture-marker',
        url: 'assets/bird-icon.png',
        width: '32px',
        height: '32px'
      }
    });

    this.graphicsLayer.add(marker);

    this.animationIntervalId && clearInterval(this.animationIntervalId);

    let step = 0;
    let monthStep = 0;
    this.animationIntervalId = setInterval(() => {
      if (step >= filteredPath.length) step = 0;

      const [lon, lat] = filteredPath[step];
      label.geometry = new Point({ longitude: lon, latitude: lat });
      if (step % Math.floor(filteredPath.length / 12) === 0) {
        (label.symbol as TextSymbol).text = monthNames[monthStep % 12];
        monthStep++;
      }

      marker.geometry = new Point({ longitude: lon, latitude: lat });

      this.mapView?.goTo({
        center: [lon, lat],
        zoom: 3
      });

      step++;
    }, 50);
  }
}
