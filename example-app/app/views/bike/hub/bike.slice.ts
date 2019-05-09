import { createFeature, Slice } from '../../../../../package';

import { appSlice } from '../../../routing/hub/app.slice';
import { bikeNotes, BikeNotes as R } from './bike.notes';

/**
 * Creates a feature slice
 */
export const bikeSlice: Slice<R> = createFeature<R>(appSlice.bike, bikeNotes);
