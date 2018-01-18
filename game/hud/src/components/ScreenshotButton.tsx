/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import * as React from 'react';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import { events } from 'camelot-unchained';


export interface ScreenShotButtonStyles {
  container: React.CSSProperties;
  screenshotButton: React.CSSProperties;
  buttonActive: React.CSSProperties;
}

const screenshotButtonStyle: StyleDeclaration = {
  container: {
    flex: '1 1 auto',
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },

  screenshotButton: {
    position: 'absolute',
    left: '0px',
    bottom: '0px',
    width: '67px',
    height: '61px',
    background: 'url(images/screenshotshare/building-camera-icon.png) no-repeat bottom left',
    pointerEvents: 'auto',
    cursor: 'pointer',
  },

  buttonActive: {
    width: '100%',
    height: '100%',
  },
};

export interface ScreenshotButtonProps {
  visible: boolean;
}

export interface ScreenshotButtonState {
  visible: boolean;
  blinking: boolean;
}

export class ScreenshotButton extends React.Component<ScreenshotButtonProps, ScreenshotButtonState> {
  constructor(props: ScreenshotButtonProps) {
    super(props);
    this.state = {
      visible: props.visible || false,
      blinking: false,
    };
  }

  public render() {
    if (!this.state.visible) return null;
    const ss = StyleSheet.create(screenshotButtonStyle);
    return (
      <div className={css(ss.container)}>
        <div
          className={css(ss.screenshotButton)}
          onClick={() => this.onClick()}
        >
          {this.state.blinking ? <img src={'images/active-frame.gif'} className={css(ss.buttonActive)} /> : null}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    events.on('hudnav--navigate', (name: string) => {
      if (name === 'screenshotbutton') {
        if (!this.state.visible) {
          this.setState({ visible: true });
        } else {
          this.setState({ visible: false });
        }
      }
    });
  }

  private onClick = () => {
    this.setState({ blinking: true });
    events.fire('hudnav--navigate', 'screenshotshare');
    setTimeout(() => {
      this.setState({ blinking: false });
    }, 1000);
  }

}

export default ScreenshotButton;
