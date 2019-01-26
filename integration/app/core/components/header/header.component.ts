import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import {
  aboutSlice,
  appSlice,
  automobileSlice,
  bikeSlice,
  bolidSlice
} from '../../../routing/slices';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  /**
   * Declares component's property
   * which will keep imported slices.
   * Autocomplete saved anyway
   */
  public slices: any;

  public ngOnInit(): void {
    /**
     * Nothing special.
     * Fill in slices.
     * Component will get access to use
     * slices in template
     */
    this.slices = {
      aboutSlice,
      appSlice,
      automobileSlice,
      bikeSlice,
      bolidSlice
    };
  }
}
