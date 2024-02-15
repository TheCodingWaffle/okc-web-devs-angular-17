import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { SwapiService } from '../common/services/swapi.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [MatButtonModule, MatListModule, MatIconModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly state = this.swapi.state.asReadonly();

  constructor(private router: Router, private swapi: SwapiService) {}

  goBack() {
    this.swapi.setActivePerson(null);
    this.router.navigate(['/login']);
  }
}
