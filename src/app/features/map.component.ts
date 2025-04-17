import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, OnChanges {
  @ViewChild('mapViewDiv', { static: true }) mapViewEl!: ElementRef;
  @Input() route: { location: { lat: number; lon: number }, destination: { lat: number; lon: number } } | null = null;

  private mapView!: MapView;
  private graphicsLayer = new GraphicsLayer();

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
  }

  ngOnChanges(): void {
    if (this.route && this.mapView) {
      const { location, destination } = this.route;

      this.mapView.goTo({
        center: [location.lon, location.lat],
        zoom: 3
      });

      // Clear existing graphics
      this.graphicsLayer.removeAll();

      // Marker at origin
      const marker = new Graphic({
        geometry: {
          type: 'point',
          x: location.lon,
          y: location.lat
        },
        symbol: {
          type: 'simple-marker',
          color: 'red',
          size: '12px',
          outline: {
            color: 'white',
            width: 1
          }
        }
      })

      const line = new Graphic({
        geometry: {
          type: 'polyline',
          paths: [
            [
              [location.lon, location.lat],
              [destination.lon, destination.lat]
            ]
          ]
        },
        symbol: {
          type: 'simple-line',
          color: 'blue',
          width: 2
        }
      });

      this.graphicsLayer.addMany([marker, line]);
    }
  }
}
