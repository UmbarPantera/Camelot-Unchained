/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { css } from '@csegames/linaria';

const textAreaClassname = css`
position: absolute;
top: -1000px;
`;

export const copyToClipboard = (text: string) => {
  const copyArea = document.createElement('textarea');
  copyArea.value = text;
  copyArea.setAttribute('readonly', '');
  copyArea.className = textAreaClassname;
  document.body.appendChild(copyArea);
  copyArea.select();
  document.execCommand('copy');
  document.body.removeChild(copyArea);
};

export default copyToClipboard;
