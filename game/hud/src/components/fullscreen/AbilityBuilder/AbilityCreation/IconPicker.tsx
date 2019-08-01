/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import convert from 'xml-js';
import { styled } from '@csegames/linaria/react';
import { css } from '@csegames/linaria';
import gql from 'graphql-tag';
import { uniq } from 'lodash';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { hidePopup } from 'actions/popup';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { request } from '@csegames/camelot-unchained/lib/utils/request';
import { AbilityType } from 'services/session/AbilityBuilderState';
import { IconQuery, AbilityComponent } from 'gql/interfaces';
import DropDownMenu, { MenuDef, DropDownMenuCustomStyles } from 'shared/DropDownMenu';

const ICONS_URL = 'http://camelot-unchained.s3.amazonaws.com/?prefix=game/4/icons/skills';

// #region Container constants
const CONTAINER_HEIGHT = 600;
// #endregion
const Container = styled.div`
  position: absolute;
  right: 0px;
  left: 0px;
  margin: auto;
  display: flex;
  width: 80%;
  height: ${CONTAINER_HEIGHT}px;
  background: black;
  z-index: 9999;
  transition: top 0.3s;

  &:before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border: 1px solid #EAD5F2;
    box-shadow: inset 0 0 10px 2px #704E9E, 0 0 10px 2px #6A46B3;
  }

  &.Melee:before {
    filter: hue-rotate(110deg);
  }

  &.Archery:before {
    filter: hue-rotate(-75deg);
  }

  &.Shout:before {
    filter: hue-rotate(135deg);
  }

  &.Throwing:before {
    filter: hue-rotate(-135deg);
  }

  @media (max-width: 2560px) {
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-wrap: wrap;
`;

// const Overlay = styled.div`
//   position: absolute;
//   top: 0;
//   right: 0;
//   bottom: 0;
//   left: 0;
//   background: rgba(0, 0, 0, 0.5);
//   z-index: 8;
// `;

// #region ContentContainer constants
const HEADER_CONTAINER_HEIGHT = 120;
const HEADER_CONTAINER_PADDING = 10;
const HEADER_CONTAINER_MARGIN = 10;
// #endregion
const HeaderContainer = styled.div`
  width: calc(100% - ${(HEADER_CONTAINER_MARGIN + HEADER_CONTAINER_PADDING) * 2}px);
  height: calc(${HEADER_CONTAINER_HEIGHT - (HEADER_CONTAINER_MARGIN + HEADER_CONTAINER_PADDING) * 2}px);
  padding: ${HEADER_CONTAINER_PADDING}px;
  margin: ${HEADER_CONTAINER_MARGIN}px ${HEADER_CONTAINER_MARGIN * 2}px;
  overflow: auto;

  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: none;
    background: none;
  }
  &::-webkit-scrollbar-thumb {
    border: 60px solid rgb(64,64,64);
    border-width: 7px 60px 7px 60px;
    border-image: url(../images/settings/scrollbar-thumb-ends-horizontal.png);
    border-image-slice: 4 30 4 30;
    min-width: 100px;
    box-shadow: none;
    background: none;
  }

  @meida (max-width: 2560px) {
    width: calc(100% - ${(HEADER_CONTAINER_MARGIN + HEADER_CONTAINER_PADDING) * 2 * MID_SCALE}px);
    height: calc(${(HEADER_CONTAINER_HEIGHT - (HEADER_CONTAINER_MARGIN + HEADER_CONTAINER_PADDING) * 2) * MID_SCALE}px);
    padding: ${HEADER_CONTAINER_PADDING * MID_SCALE}px;
    margin: ${HEADER_CONTAINER_MARGIN * MID_SCALE}px ${(HEADER_CONTAINER_MARGIN * MID_SCALE) * 2}px;
  }

  @media (max-width: 1920px) {
    width: calc(100% - ${(HEADER_CONTAINER_MARGIN + HEADER_CONTAINER_PADDING) * 2 * HD_SCALE}px);
    height: calc(${(HEADER_CONTAINER_HEIGHT - (HEADER_CONTAINER_MARGIN + HEADER_CONTAINER_PADDING) * 2) * HD_SCALE}px);
    padding: ${HEADER_CONTAINER_PADDING * HD_SCALE}px;
    margin: ${HEADER_CONTAINER_MARGIN * HD_SCALE}px ${(HEADER_CONTAINER_MARGIN * HD_SCALE) * 2}px;
  }
`;

// #region ContentContainer constants
const CONTENT_CONTAINER_PADDING = 10;
const CONTENT_CONTAINER_MARGIN = 10;
// #endregion
const ContentContainer = styled.div`
  width: calc(100% - ${(CONTENT_CONTAINER_MARGIN + CONTENT_CONTAINER_PADDING) * 2}px);
  height: calc(100% - ${(CONTENT_CONTAINER_MARGIN + CONTENT_CONTAINER_PADDING) * 2 + HEADER_CONTAINER_HEIGHT}px);
  padding: ${CONTENT_CONTAINER_PADDING}px;
  margin: ${CONTENT_CONTAINER_MARGIN}px ${CONTENT_CONTAINER_MARGIN * 2}px;
  overflow: auto;

  @meida (max-width: 2560px) {
    width: calc(100% - ${(CONTENT_CONTAINER_MARGIN + CONTENT_CONTAINER_PADDING) * 2 * MID_SCALE}px);
    height: calc(100% - ${
      ((CONTENT_CONTAINER_MARGIN + CONTENT_CONTAINER_PADDING) * 2 + HEADER_CONTAINER_HEIGHT) * MID_SCALE
    }px);
    padding: ${CONTENT_CONTAINER_PADDING * MID_SCALE}px;
    margin: ${CONTENT_CONTAINER_MARGIN * MID_SCALE}px ${(CONTENT_CONTAINER_MARGIN * MID_SCALE) * 2}px;
  }

  @media (max-width: 1920px) {
    width: calc(100% - ${(CONTENT_CONTAINER_MARGIN + CONTENT_CONTAINER_PADDING) * 2 * HD_SCALE}px);
    height: calc(100% - ${
      ((CONTENT_CONTAINER_MARGIN + CONTENT_CONTAINER_PADDING) * 2 + HEADER_CONTAINER_HEIGHT) * HD_SCALE
    }px);
    padding: ${CONTENT_CONTAINER_PADDING * HD_SCALE}px;
    margin: ${CONTENT_CONTAINER_MARGIN * HD_SCALE}px ${(CONTENT_CONTAINER_MARGIN * HD_SCALE) * 2}px;
  }
`;

// #region Icon constants
const ICON_DIMENSIONS = 100;
const ICON_MARGIN = 5;
// #endregion
const Icon = styled.img`
  width: ${ICON_DIMENSIONS}px;
  height: ${ICON_DIMENSIONS}px;
  margin: ${ICON_MARGIN}px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    filter: brightness(150%);
  }

  @media (max-width: 2560px) {
    width: ${ICON_DIMENSIONS * MID_SCALE}px;
    height: ${ICON_DIMENSIONS * MID_SCALE}px;
    margin: ${ICON_MARGIN * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ICON_DIMENSIONS * HD_SCALE}px;
    height: ${ICON_DIMENSIONS * HD_SCALE}px;
    margin: ${ICON_MARGIN * HD_SCALE}px;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

// #region LoadingIcon constants
const LOADING_ICON_DIMENSIONS = 300;
// #endregion
const LoadingIcon = styled.video`
  width: ${LOADING_ICON_DIMENSIONS}px;
  height: ${LOADING_ICON_DIMENSIONS}px;
  object-fit: cover;
  filter: brightness(0) invert(1);
  opacity: 0.2;

  @media (max-width: 2560px) {
    width: ${LOADING_ICON_DIMENSIONS * MID_SCALE}px;
    height: ${LOADING_ICON_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${LOADING_ICON_DIMENSIONS * HD_SCALE}px;
    height: ${LOADING_ICON_DIMENSIONS * HD_SCALE}px;
  }
`;

const query = gql`
  query IconQuery($class: String!) {
    game {
      abilityComponents(class: $class) {
        display {
          name,
          iconURL,
        }
      }
    }
  }
`;

const iconPickerMenu: MenuDef[] = [
  {
    label: 'Healers',
    items: [
      { label: 'Empath' },
      { label: 'Physician' },
      { label: 'Stonehealer' },
    ],
  },
  {
    label: 'Archers',
    items: [
      { label: 'Forest Stalker', id: 'ForestStalker' },
      { label: 'Blackguard' },
      { label: `Winter's Shadow`, id: 'WintersShadow' },
    ],
  },
  {
    label: 'Heavy Fighters',
    items: [
      { label: 'Fianna' },
      { label: 'Black Knight', id: 'BlackKnight' },
      { label: 'Mjölnir', id: 'Mjolnir' },
    ],
  },
  {
    label: 'Mages',
    items: [
      { label: 'Druid' },
      { label: 'Flame Warden', id: 'FlameWarden' },
      { label: 'Wave Weaver', id: 'WaveWeaver' },
    ],
  },
  {
    label: 'All Icons', id: 'All',
  },
];

export const defaultIconPickerMenuStyles: Partial<DropDownMenuCustomStyles> = {
  menuElement: {
    labelContainer: css`
      background-color: #211b17;
      font-family: TradeWinds;
      color: #cebd9d;
      &:hover {
        background-color: #665d4e;
      }
    `,
    selectionCount: css`
      color: #211b17;
    `,
    selectionCountCircle: css`
      background-color: #b3a588;
      border-color: #b3a588;
    `,
    labelContainerOpenMenu: css`
      background-color: #403a31;
    `,
    checkBoxStyles: {
      container: css`
        background-color: #b3a588;
      `,
      check: css`
        color: #211b17;
      `,
    },
  },
  menuContainer: css`
    background-color: #211b17;
  `,
};

export interface Props {
  top: number;
  selectedAbilityType: AbilityType;
  ownComponents: AbilityComponent.Fragment[];
  onIconClick: (icon: string) => void;
  onCloseIconPicker: () => void;
}

export interface State {
  icons: string[];
  iconsByClass: { [archetype: string]: string[] };
  selectedArchetypes: string[];
}

export class IconPicker extends React.PureComponent<Props, State> {
  private mouseOver: boolean;
  constructor(props: Props) {
    super(props);
    this.state = {
      icons: [],
      iconsByClass: { [Archetype[game.selfPlayerState.classID]]: this.getIconUrls(props.ownComponents) },
      selectedArchetypes: [Archetype[game.selfPlayerState.classID]],
    };
  }

  public render() {
    return (
      <>
        {/* <Overlay onClick={this.props.onCloseIconPicker} /> */}
        <Container
          style={{ top: this.props.top }}
          className={this.props.selectedAbilityType.name}
          onMouseOver={this.onMouseOver}
          onMouseLeave={this.onMouseLeave}
        >
          <Wrapper>
            {this.state.selectedArchetypes.map((archetype) => {
              if (!!this.state.iconsByClass[archetype]) return;
              if (archetype === 'All') {
                this.initializeIcons();
                return;
              }
              const handleQueryResult = this.handleQueryResult(archetype);
              return (<GraphQL
                key={archetype}
                query={{
                  query,
                  variables: {
                    class: archetype,
                  },
                }}
                onQueryResult={handleQueryResult}
              />);
            })}
            <HeaderContainer>
              <DropDownMenu
                defs={iconPickerMenu}
                selectedItems={this.state.selectedArchetypes}
                showCheckBox={true}
                showCount={true}
                getSelectedDefs={this.getSelectedDefs}
                customStyles={defaultIconPickerMenuStyles}
              />
            </HeaderContainer>
            {!this.state.iconsByClass &&
              <LoadingContainer>
                <LoadingIcon src='images/loading-realms.webm' autoPlay loop muted />
              </LoadingContainer>
            }
            {this.state.iconsByClass &&
              <ContentContainer className={'cse-ui-scroller-thumbonly'}>
                {this.state.selectedArchetypes.map(archetype => this.renderArchetype(archetype))}
              </ContentContainer>
            }
          </Wrapper>
        </Container>
      </>
    );
  }

  public componentDidMount() {
    window.addEventListener('mousedown', this.handleMouseDown);
  }

  public componentWillUnmount() {
    window.removeEventListener('mousedown', this.handleMouseDown);
  }

  private getSelectedDefs = (selectedDefs: MenuDef[]) => {
    const selectedArchetypes = selectedDefs.map(def => def.id ? def.id : def.label);
    this.setState((prevState: State) => {
      const remainingArchetypes = prevState.selectedArchetypes.filter(
        archetype => selectedArchetypes.indexOf(archetype) !== -1,
      );
      const newArchetypes = selectedArchetypes.filter(archetype => prevState.selectedArchetypes.indexOf(archetype) === -1);
      return { selectedArchetypes: [...remainingArchetypes, ...newArchetypes] };
    });
  }

  private renderArchetype = (archetype: string) => {
    return (
      this.state.iconsByClass[archetype]
      && this.state.iconsByClass[archetype].map((icon, index) =>
        <Icon
          key={index}
          src={icon}
          onClick={() => this.onIconClick(icon)}
        />)
    );
  }

  private getIconUrls = (components: IconQuery.AbilityComponents[]): string[] => {
    const icons: string[] = [];
    components.forEach((component: IconQuery.AbilityComponents) => {
      icons.push(component.display.iconURL);
    });
    return uniq(icons);
  }

  private onMouseOver = () => {
    this.mouseOver = true;
  }

  private onMouseLeave = () => {
    this.mouseOver = false;
  }

  private handleMouseDown = () => {
    if (this.mouseOver) return;

    this.props.onCloseIconPicker();
  }

  private handleQueryResult = (archetype: string) => {
    return (graphql: GraphQLResult<IconQuery.Query>) => {
      if (graphql.loading || !graphql.data) return graphql;
      this.setState((prevState: State) => ({
        iconsByClass: {
          ...prevState.iconsByClass,
          [archetype]: this.getIconUrls(graphql.data.game.abilityComponents),
        }}),
      );
    };
  }

  private initializeIcons = async () => {
    const res = await request('get', ICONS_URL);

    // Comes in as xml. Need to convert to json.
    const data = JSON.parse(convert.xml2json(res.data));
    const icons: string[] = [];
    const elements = data.elements[0].elements;
    elements.slice(5, elements.length).forEach((element: any) => {
      icons.push('http://camelot-unchained.s3.amazonaws.com/' + element.elements[0].elements[0].text);
    });
    this.setState((prevState: State) => ({
      iconsByClass: {
        ...prevState.iconsByClass,
        ['All']: icons,
      }}),
    );
  }

  private onIconClick = (icon: string) => {
    hidePopup();
    this.props.onIconClick(icon);
  }
}
