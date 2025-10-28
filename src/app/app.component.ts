import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmDeleteComponent } from './features/layouts/confirm.delete/confirm.delete.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ConfirmDeleteComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'geopacking-frontend';
}
