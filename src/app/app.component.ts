import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  tempUsers = [{ name: 'Joep Kockelkorn', id: 2 }, { name: 'Stijn Swaanen', id: 3 }, { name: 'Karim Maassen', id: 4 }];
  filteredUsers$ = new ReplaySubject();
  searching = false;

  ctrl = new FormControl();

  onFilter(filter: string) {
    this.searching = true;
    setTimeout(() => {
      const filtered = this.tempUsers.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()));
      // console.log(filtered);
      this.filteredUsers$.next(filtered);
      this.searching = false;
    }, 1000);
  }
}
