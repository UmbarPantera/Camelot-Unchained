/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LayoutMode } from '../../../components/HUDDrag';
import ScreenshotButton from '../../../components/ScreenshotButton';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 9,
      offset: 10,
    },
    y: {
      anchor: 9,
      offset: -30,
    },
    size: {
      width: 67,
      height: 61,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.ScreenshotButton,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: ScreenshotButton,
  props: {},
};
