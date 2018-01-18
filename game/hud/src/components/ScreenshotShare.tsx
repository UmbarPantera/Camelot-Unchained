/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import { client, events, Input, jsKeyCodes } from 'camelot-unchained';
import Button from '../widgets/Crafting/components/Button';

export interface ScreenshotShareStyle extends StyleDeclaration {
  container: React.CSSProperties;
  windowTop: React.CSSProperties;
  windowTitle: React.CSSProperties;
  windowClose: React.CSSProperties;
  windowMiddle: React.CSSProperties;
  windowBottom: React.CSSProperties;
  imageContainer: React.CSSProperties;
  loginButtonContainer: React.CSSProperties;
  loginButton: React.CSSProperties;
  fbFrame: React.CSSProperties;
  twitterFrame: React.CSSProperties;
  btnTwitterLogin: React.CSSProperties;
  userText: React.CSSProperties;
  postButtonContainer: React.CSSProperties;
  postButton: React.CSSProperties;
  statusMessage: React.CSSProperties;
}

const screenshotShareStyle: StyleDeclaration = {

  container: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    position: 'relative',
  },

  windowTop: {
    flex: '0 0 auto',
    position: 'relative',
    margin: '0 4px',
    height: '46px',
    lineHeight: '32px',
    textAlign: 'center',
    overflow: 'hidden',
    color: '#fff',
    background: '#0f0f0f url(images/screenshotshare/top-middle.png) repeat-x',
    ':before': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '48px',
      height: '44px',
      content: 'url(images/screenshotshare/top-left.png)',
    },
    ':after': {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '48px',
      height: '44px',
      content: 'url(images/screenshotshare/top-right.png)',
    },
  },

  windowTitle: {
    textTransform: 'uppercase',
    color: 'rgb(182, 182, 182)',
    fontFamily: '"Cinzel", serif',
    fontSize: '13px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    cursor: 'default',
  },

  windowClose: {
    position: 'absolute',
    pointerEvents: 'auto',
    top: '8px',
    right: '14px',
    width: '13px',
    height: '13px',
    border: 'none',
    outline: 'none',
    cursor: 'pointer',
    zIndex: 999,
    background: 'url(images/screenshotshare/btn-close.png) no-repeat center center',
    filter: 'brightness(0.6)',
    ':hover': {
      filter: 'brightness(0.8)',
    },
    ':active': {
      filter: 'brightness(1.0)',
    },
  },

  windowMiddle: {
    dispaly: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    position: 'relative',
    margin: '0 4px',
    padding: '0 10px 10px 10px',
    color: '#fff',
    backgroundColor: '#0f0f0f',
    fontFamily: '"Merriweather Sans", sans-serif',
    fontSize: '12px',
  },

  windowBottom: {
    display: 'flex',
    flex: '0 0 auto',
    position: 'relative',
    margin: '-5px 4px 0 4px',
    height: '49px',
    lineHeight: '49px',
    textAlign: 'center',
    overflow: 'hidden',
    color: '#fff',
    background: 'url(images/screenshotshare/bottom-middle.png) repeat-x',
    ':before': {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '28px',
      height: '49px',
      content: 'url(images/screenshotshare/bottom-left.png)',
    },
    ':after': {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: '28px',
      height: '49px',
      content: 'url(images/screenshotshare/bottom-right.png)',
    },
  },

  imageContainer: {
    position: 'relative',
    flex: '1 1 auto',
    width: '360px',
    height: '225px',
    margin: '0 auto',
  },

  screenshotImage: {
    maxWidth: '100%',
    maxHeight: '100%',
    height: 'auto',
  },

  loginButtonContainer: {
    display: 'flex',
    flex: '0 0 auto',
  },

  loginButton: {
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fbFrame: {
    pointerEvents: 'auto',
    width: '100px',
    height: '40px',
  },

  twitterFrame: {
    width: '0px',
    height: '0px',
  },

  btnTwitterLogin: {
    pointerEvents: 'auto',
    flex: '0 0 auto',
    margin: 0,
    padding: 0,
    background: 'url(images/screenshotshare/sign-in-with-twitter-gray.png) no-repeat bottom left',
    width: '158px',
    height: '28px',
  },

  postButtonContainer: {
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '11px',
    marginBottom: '7px',
  },

  postButton: {
    fontSize: '12px',
    lineHeight: '1em',
    padding: '2px',
    margin: '2px 10px',
  },

  statusMessage: {
    position: 'absolute',
    top: '48%',
    left: '0px',
    width: '100%',
    backgroundColor: 'rgb(44, 44, 44)',
    color: '#fff',
    textAlign: 'center',
  },

};

const descriptionStyles: StyleDeclaration = {

  input: {
    pointerEvents: 'auto',
    color: '#d3d3d3',
    padding: '5px',
    border: 'solid 1px rgb(39, 39, 39)',
    background: 'rgb(39, 39, 39)',
    boxShadow: 'inset 0 0 20px 5px rgba(0, 0, 0, 0.75)',
    outline: 'none',
  },

  inputWrapper: {
    margin: '0 10px',
  },

};

export interface ScreenshotShareProps {
  visible: boolean;
}

export interface ScreenshotShareState {
  visible: boolean;
  twitterLoggedIn: boolean;
  // fbLoggedIn: boolean;
  imgLoaded: boolean;
  description: string;
  statusMessage: string;
  postedOnFB: boolean;
  postedOnTwitter: boolean;
}

export class ScreenshotShare extends React.Component<ScreenshotShareProps, ScreenshotShareState> {
  private imgRef: any;
  private twitterFrameRef: any;
  private fbFrameRef: any;
  private imageData: any;
  private postingOnFB: boolean;

  constructor(props: ScreenshotShareProps) {
    super(props);

    this.state = {
      visible: props.visible || false,
      twitterLoggedIn: false,
      // fbLoggedIn: false,
      imgLoaded: false,
      description: '',
      statusMessage: '',
      postedOnFB: false,
      postedOnTwitter: false,
    };
  }

  public render() {
    if (!this.state.visible) return null;
    const ss = StyleSheet.create(screenshotShareStyle);
    return (
      <div className={css(ss.container)}>
        <div className={css(ss.windowTop)}>
          <div className={css(ss.windowTitle)}>Share Screenshot</div>
          <div
            className={css(ss.windowClose)}
            onClick={() => this.hideScreenshotShare()}
          />
        </div>
        <div className={css(ss.windowMiddle)}>
          <div className={css(ss.imageContainer)}>
            <div className={css(ss.statusMessage)}>
              {this.state.statusMessage ? this.state.statusMessage : null}
            </div>
            <img className={css(ss.screenshotImage)} ref={r => this.imgRef = r} />
          </div>
          <div className={css(ss.loginButtonContainer)}>
            <div className={css(ss.loginButton)}>
              <iframe
                className={css(ss.fbFrame)}
                src={'http://camelotunchained.com/fb/FacebookScreenshot.html'}
                frameBorder={'0'}
                ref={r => this.fbFrameRef = r}
              ></iframe>
            </div>
            {this.renderTwitterLoginButton(ss)}
            <iframe
              className={css(ss.twitterFrame)}
              src={'http://camelotunchained.com/twitter/Twitter.html'}
              frameBorder={'0'}
              ref={r => this.twitterFrameRef = r}
            ></iframe>
          </div>
          <Input
            onChange={ (e: React.FormEvent<HTMLInputElement>) => this.onDescriptionChange(e)}
            type={'text'}
            placeholder={'Talk about what you have built here...'}
            value={this.state.description}
            styles={descriptionStyles}
          />
        </div>
        <div className={css(ss.windowBottom)}>
          <div className={css(ss.postButtonContainer)}>
            <Button
              key={'Post-to-FB'}
              // the script at http://camelotunchained.com/fb/FacebookScreenshot.js seems to have no way to check or report,
              // if we are logged in to Facebook, so we need to disable this check for now.
              disabled={!(
                this.state.imgLoaded /*&&
                this.state.fbLoggedIn*/ &&
                !this.state.postedOnFB &&
                this.state.statusMessage !== 'Uploading image'
              )}
              onClick={() => this.postFacebook()}
              style={{ button: screenshotShareStyle.postButton }}
            >
              Post to Facebook
            </Button>
            <Button
              key={'Post-to-Twitter'}
              disabled={!(
                this.state.imgLoaded &&
                this.state.twitterLoggedIn &&
                !this.state.postedOnTwitter &&
                this.state.statusMessage !== 'Uploading image'
              )}
              onClick={() => this.postTwitter()}
              style={{ button: screenshotShareStyle.postButton }}
            >
              Post to Twitter
            </Button>
          </div>
        </div>
      </div>
    );
  }

  public renderTwitterLoginButton = (ss: StyleDeclaration): JSX.Element => {
    if (this.state.twitterLoggedIn) return null;
    return (
      <div className={css(ss.loginButton)}>
        <button className={css(ss.btnTwitterLogin)} onClick={this.twitterLogin}></button>
      </div>
    );
  }

  public componentDidMount() {
    client.OnReceiveScreenShot((screenShotString) => {
      this.setState({
        imgLoaded: false,
        postedOnFB: false,
        postedOnTwitter: false,
      });
      this.imageData = screenShotString;
      this.imgRef.setAttribute('src', 'data:image/png;base64,' + this.imageData);
      this.imgRef.onload = () => {
        this.setState({ imgLoaded: true });
      };
    });

    this.listenForEvents();
    this.addEventListeners();
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('message', this.enablePost);
  }

  private addEventListeners = () => {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('message', this.enablePost, false);
  }

  private listenForEvents = () => {
    events.on('hudnav--navigate', (name: string) => {
      if (name === 'screenshotshare') {
        if (!this.state.visible) {
          client.RequestInputOwnership();
          client.TakeScreenshot();
          this.setState({ visible: true, statusMessage: '' });
        } else {
          client.ReleaseInputOwnership();
          this.setState({ visible: false });
        }
      }
    });
  }

  private onKeyDown = (e: KeyboardEvent) => {
    if (e.which === jsKeyCodes.ESC && this.state.visible) {
      this.hideScreenshotShare();
    }
  }

  private hideScreenshotShare = () => {
    events.fire('hudnav--navigate', 'screenshotshare');
  }

  private twitterLogin = () => {
    this.twitterFrameRef.contentWindow.postMessage('Signin', 'http://camelotunchained.com');
  }

  private postFacebook = () => {
    this.postingOnFB = true;
    this.setState({ statusMessage: 'Uploading image' });
    if (this.state.imgLoaded) {
      const dataUrl = 'data:image/png;base64,' + this.imageData;
      this.fbFrameRef.contentWindow.postMessage(
        { image: dataUrl, message: this.state.description }, 'http://camelotunchained.com',
      );
    }
  }

  private postTwitter = () => {
    this.postingOnFB = false;
    this.setState({ statusMessage: 'Uploading image' });
    if (this.state.imgLoaded) {
      const dataUrl = 'data:image/png;base64,' + this.imageData;
      this.twitterFrameRef.contentWindow.postMessage({
        image: dataUrl, message: this.state.description,
      }, 'http://camelotunchained.com');
    }
  }

  private onDescriptionChange = (e: React.FormEvent<HTMLInputElement>) => {
    this.setState({ description: e.currentTarget.value });
  }

  private enablePost = (evt: any) => {
    const target = evt.data;
    console.log('Target: ' + target);
    if (target === 'Twitter') {
      this.setState({ twitterLoggedIn: true });
    // Facebook / the script used is not reporting the login atm
    /*} else if (target === 'Facebook') {
      this.setState({ fbLoggedIn: true });*/
    } else if (target === 'Success') {
      if (this.postingOnFB) {
        this.setState({ postedOnFB: true });
      } else {
        this.setState({ postedOnTwitter: true });
      }
      this.setState({ statusMessage: 'Post successful!' });
      setTimeout(() => {
        this.setState({ statusMessage: '' });
      }, 5000);
    } else if (target === 'Failure') {
      this.setState({ statusMessage: 'Post failed!' });
      setTimeout(() => {
        this.setState({ statusMessage: '' });
      }, 5000);
    }
  }
}

export default ScreenshotShare;
