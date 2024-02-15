import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Person } from '../models/person.model';
import { BaseStateService } from './base-state-service';

const SWAPI_PEOPLE_URL_PAGE_1 = 'https://swapi.dev/api/people/';

/**
 * A simple state service that uses the SWAPI api.
 * The class @extends BaseStateService to add state
 * functionality.
 *
 * @class
 * @implements {SwapiState}
 * @see {@link https://swapi.dev/documentation}
 */
@Injectable({
  providedIn: 'root',
})
export class SwapiService extends BaseStateService<SwapiState> {
  constructor(private http: HttpClient) {
    super();
    this.fetchSwapiPersons();
  }

  override initializeState(): void {
    this.setState({
      people: new Array<Person>(),
      loading: true,
      loggedInPerson: null,
    });
  }

  /**
   * Will update the state to the person whos name mataches,
   * or will set to null.
   *
   * @param personName name of the person to lookup and set.
   */
  setActivePerson(personName: string | null) {
    const loggedInPerson = this.state().people.find(
      (person) => person.name === personName
    );

    const loggedInPersonImageUrl = this.imageUrl(loggedInPerson);
    this.setState({ loggedInPerson, loggedInPersonImageUrl });
  }

  /**
   * Recursively calls the SWAPI/people, until it reaches
   * the end of the paginated collection, and appends all
   * results into the service state.
   *
   * @param pageUrl Url to the SWAPI person endpoint
   *
   * @see {@link https://swapi.dev/documentation#people}
   */
  private fetchSwapiPersons(pageUrl = SWAPI_PEOPLE_URL_PAGE_1) {
    this.http.get<any>(pageUrl).subscribe((resp) => {
      const newPersons: Person[] = resp?.results;
      this.updatePeopleList(newPersons);

      if (resp.next) {
        this.fetchSwapiPersons(resp.next);
      } else {
        this.setState({ loading: false });
      }
    });
  }

  /**
   * Adds a collection of @type {Person} to the existing
   * SwapiState.people, sorts them alphabetically, and
   * updates the state with the result.
   *
   * @param newPeople collection to add to existing SwapiState.people
   */
  private updatePeopleList(newPeople: Array<Person>) {
    let people = this.state().people;
    people.push.apply(people, newPeople);
    people = people.sort((a, b) => (a.name < b.name ? -1 : 1));
    this.setState({ people });
  }

  /**
   * SWAPI doesn't return an ID, but there is an ID embedded
   * at the end of the @type {Person} url. This strips that ID
   * and parses a url pointing to the local image.
   *
   * @param person the Person whos image is needed
   * @returns the Asset url for the person
   */
  private imageUrl(person: Person | undefined): string {
    if (!person?.url) return '';

    const result = person.url?.split(/[-/]/);
    const personId = result[5];

    return '/assets/people/' + personId + '.jpg';
  }
}

/**
 * Interface for the state used in the @type {SwapiService}
 *
 * @interface
 */
export interface SwapiState {
  people: Array<Person>;
  loading: boolean;
  loggedInPerson: Person | null;
  loggedInPersonImageUrl: string;
}
