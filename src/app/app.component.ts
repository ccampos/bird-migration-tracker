import { Component } from '@angular/core';
import { LayoutComponent } from './layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent],
  template: `<app-layout />`
})
export class AppComponent { }
