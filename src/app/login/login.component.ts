import { Component, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { Person } from '../common/models/person.model';
import { SwapiService } from '../common/services/swapi.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly state = this.swapi.state.asReadonly();

  filteredPeople: Signal<Person[]>;
  personControl = new FormControl('', [Validators.required]);

  constructor(private router: Router, private swapi: SwapiService) {

    /**
     * Create an observable for the control when its value changes.
     */
    const filteredPeople$ = this.personControl.valueChanges.pipe(
      startWith(''),
      map((person) => this.filterPeople(person))
    );

    /**
     * Convert the above observable to a signal.
     * 
     * toSginal() is used to convert the observable to a signal.
     *
     * There is no longer a need for the template to use the
     * async pipe with an ngIf directive.
     *
     * The siganal will also auto unsubscribe when the observable
     * is destroyed.
     * 
     * An @param initialValue is provided since the signal subscribes
     * immediately and the Observable would return undefined.
     */
    this.filteredPeople = toSignal(filteredPeople$, { initialValue: [] });
  }

  /**
   * Set the active profile in state, and navigate
   * to the profile page.
   */
  onSubmit(): void {
    this.swapi.setActivePerson(this.personControl.value);
    this.router.navigate(['/profile']);
  }

  /**
   * Filter the collection of people by comparing the users
   * entered text with the @type {Person} name.
   *
   * @param value user entered value
   * @returns Collection of Persons
   */
  private filterPeople(value: string | null): Person[] {
    const people = this.swapi.state().people;
    if (!value) {
      return people;
    }
    const filterValue = value.toLowerCase();

    return people.filter((person) =>
      person.name.toLowerCase().includes(filterValue)
    );
  }
}
