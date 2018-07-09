/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { css } from 'react-emotion';

// import { FactionColors } from 'lib/factionColors';
// import SearchableList from '../../SearchableList';
import { SortBy } from './ListHeaderItem';
// import ListHeader from './ListHeader';
// import ListItem from './ListItem';
import TeamScore from './TeamScore';
import { TeamInterface, TeamPlayer } from './ScenarioResultsContainer';
import GridView from '../../UI/Gridview';
import { ColumnDefinition, GridViewStyle } from '../../UI/Gridview/components/GridViewMain';
import {
  JobSummaryDBModel, CountPerTargetTypeDBModel,
} from '../../../../node_modules/@csegames/camelot-unchained/lib/graphql';

export const ScenarioResultStyle: Partial<GridViewStyle> = {

  // try to avoid margins. It is very likely they will break the table at some point

  container: {
    // label: 'Container',
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    width: '100%',
    height: '100%',
    padding: '5px',
    paddingBottom: '25px',
    overflow: 'hidden',
    fontSize: '16px', // defining a starting point for this.estimateColumnnWidths
    color: 'white',
  },

  tableWrapper: {
    // label: 'TableWrapper',
    display: 'flex',
    flex: '1 1 auto',
  },

  tableContainer: {
    // label: 'TableContainer',
    // flex is/has to be set via inline styles
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  headerContainer: {
    // label: 'HeaderContainer',
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'row',
    boxSizing: 'border-box',
    overflow: 'hidden', // needed to align the header with a grid with scrollbar
    // hacky, but otherwise e.g. a filter drop down menu might get cut off, because of overflow hidden
    paddingBottom: '400px',
    marginBottom: '-400px',
  },

  preGridContainer: {
    // label: 'PreGridContainer',
    flex: '1 0 auto',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  },

  header: {
    // label: 'Header',
    display: 'flex',
    flex: '1 0 auto',
    color: '#777',
    fontWeight: 'bold',
  },

  headerItem: {
    // label: 'HeaderItem',
    display: 'flex',
    flex: '1 1 auto',
    border: '1px solid white',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },

  reorderHeaderItem: {
    // label: 'ReorderHeaderItem',
    display: 'flex',
    flex: '1 1 auto',
    boxSizing: 'border-box',
    padding: '1px',
  },

  headerElements: {
    // label: 'HeaderElement',
    display: 'flex',
    flex: '1 1 auto',
    padding: '4px',
    boxSizing: 'border-box',
    userSelect: 'none',
    cursor: 'default',
    whiteSpace: 'nowrap',
    minWidth: '0',
  },

  headerName: {
    // label: 'HeaderName',
    margin: '0 5px',
  },

  sortPrio: {
    // label: 'SortPrio',
    fontSize: '10px',
  },

  columnResizer: {
    // label: 'ColumnResizer',
    flex: '0 0 auto',
    height: 'auto',
    padding: '0px',
    cursor: 'col-resize',
    border: '2px solid transparent',
    zIndex: 5,
  },

  filter: {
    // label: 'Filter',
    display: 'flex',
    flex: '1 0 auto',
  },

  filterItem: {
    // label: 'FilterItem',
    display: 'flex',
    cursor: 'default',
    flex: '1 1 auto',
    border: '1px solid white',
    boxSizing: 'border-box',
    padding: '3px 5px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  reorderFilterItem: {
    // label: 'ReorderFilterItem',
    display: 'flex',
    cursor: 'default',
    flex: '1 1 auto',
    boxSizing: 'border-box',
    padding: '4px 6px',
  },

  filterInput: {
    // label: 'FilterInput',
    flex: '1 1 auto',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    color: '#00cccc',
    padding: '0px 3px',
    boxSizing: 'border-box',
    width: '100%',
  },

  filterInputWrapper: {
    // label: 'filterInputWrapper',
    flex: '1 1 auto',
    flexDirection: 'row',
    width: '0px',
  },

  headerSeparator: {
    // label: 'HeaderSeparator',
    display: 'flex',
    flex: '1 0 auto',
    marginBottom: '10px',
  },

  gridContainer: {
    // label: 'GridContainer',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    minHeight: 0,
    overflow: 'hidden',
  },

  gridContainerXScroll: {
    overflowX: 'scroll',
  },

  gridContainerYScroll: {
    overflowY: 'scroll',
  },

  grid: {
    // label: 'Grid',
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'row',
    minWidth: 'fit-content',
  },

  gridItem: {
    // label: 'GridItem',
    display: 'flex',
    flex: '1 1 auto',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    padding: '4px',
    border: '1px solid white',
    minWidth: 'min-content',
  },

  reorderGridItem: {
    // label: 'ReorderGridItem',
    display: 'flex',
    flex: '1 1 auto',
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    padding: '5px',
  },

  row: {
    // label: 'Row',
    display: 'flex',
    flex: '1 0 auto',
  },

  expandableRow: {
    // label: 'ExpandableRow',
    display: 'flex',
    flex: '1 1 auto',
    // ':nth-child(odd)': {
    //   backgroundColor: 'rgba(0, 0, 0, 0.1)',
    //   backgroundBlendMode: 'multiply',
    // },
  },

  expandedRow: {
    // label: 'ExpandedRow',
    display: 'flex',
    flex: '1 0 auto',
    boxSizing: 'border-box',
    borderBottom: '1px solid white',
    borderRight: '1px solid white',
    borderLeft: '1px solid white',
    padding: '4px',
  },

  paginator: {
    pagination: {
      display: 'flex',
      alignSelf: 'center',
      flex: '0 0 auto',
      boxSizing: 'border-box',
      alignContent: 'center',
      justifyContent: 'center',
    },

    pageButton: {
      flex: '0 0 auto',
      fontSize: '.8em',
    },

    raisedButton: {
      button: {
        padding: '8px 18px',
        margin: '2px',
      },
      buttonDisabled: {
        margin: '5px',
      },
    },
  },

  resizeLine: {
    width: '1px',
    position: 'absolute',
    zIndex: 20,
    backgroundColor: '#777',
  },

  reorderColumn: {
    // label: 'ReorderColumn',
    position: 'absolute',
    backgroundColor: 'white',
    overflow: 'hidden',
    zIndex: 11,
  },

  noReorder: {
    backgroundColor: 'rgba(255, 51, 0, 0.1)',
  },

  selected: {
    backgroundImage: 'linear-gradient(0deg, rgba(150, 255, 100, 0.2), rgba(150, 255, 100, 0.3))',
  },

  frozen: {
    backgroundImage: 'linear-gradient(0deg, rgba(50, 100, 255, 0.2), rgba(50, 100, 255, 0.3))',
  },

  selectedFrozen: {
    backgroundImage: 'linear-gradient(0deg, rgba(0, 255, 200, 0.2), rgba(0, 255, 200, 0.2))',
  },

  rowExtender: {
    // label: 'RowExtender',
    display: 'block',
    minWidth: '25px',
    padding: '4px',
    border: '1px solid white',
  },
};


const Container = styled('div') `
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  position: relative;
  overflow: hidden;
  height: 100%;
  background: url(images/scenario-results/bg.png) no-repeat;
  background-size: cover;
  -webkit-mask-image: url(images/scenario-results/ui-mask.png);
  -webkit-mask-size: cover;
  -webkit-mask-position: bottom;
  -webkit-mask-repeat: no-repeat;
`;

const ListContainer = css`
  height: 500px;
  &::-webkit-scrollbar {
    width: 7px !important;
  }
  &::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3) !important;
  }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to bottom, #222, #333, #222) !important;
    box-shadow: none !important;
  }
`;

// const ListItemsContainer = css`
//   padding: 0px 5px 0px 5px;
//   -webkit-mask-image: linear-gradient(to top, transparent 0%, black 4%);
// `;

const NoDataText = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  font-size: 18px;
  font-family: Caudex;
  color: white;
`;

export interface ListProps {
  scenarioID: string;
  teams: TeamInterface[];
  players: TeamPlayer[];
  visible: boolean;
  status: {
    loading: boolean;
    lastError: string;
  };
}

export interface ListState {
  selectedSortBy: SortBy;
  leastToGreatest: boolean;
  searchValue: string;
}

class List extends React.Component<ListProps, ListState> {
  private listRef: HTMLDivElement;

  private columnDefs: ColumnDefinition[] = [
    {
      key: (m: TeamPlayer) =>  m.teamID.charAt(0),
      title: 'Realm',
      style: { boxSizing: 'border-box' },
    },
    {
      key: (m: TeamPlayer) => m.displayName,
      title: 'Name',
      style: { boxSizing: 'border-box' }, // only needed because code from old css-files is overwriting emotion stylesheets
    },
    {
      key: (m: TeamPlayer) => m.damage.killCount.playerCharacter,
      title: 'Kills',
      style: { boxSizing: 'border-box' },
    },
    {
      key: (m: TeamPlayer) => m.damage.deathCount.anyCharacter,
      title: 'Deaths',
      style: { boxSizing: 'border-box' },
    },
    {
      key: (m: TeamPlayer) => m.damage.killAssistCount.playerCharacter,
      title: 'Assists',
      style: { boxSizing: 'border-box' },
    },
    {
      key: (m: TeamPlayer) => m.damage.killCount.nonPlayerCharacter,
      title: 'NPC-Kills',
      style: { boxSizing: 'border-box' },
    },
    {
      key: (m: TeamPlayer) => m.damage.damageApplied.anyCharacter,
      title: 'Damage Dealt',
      style: { boxSizing: 'border-box' },
    },
    {
      key: (m: TeamPlayer) => m.damage.damageReceived.anyCharacter,
      title: 'Damage Received',
      style: { boxSizing: 'border-box' },
    },
    {
      key: (m: TeamPlayer) => m.damage.healingApplied.anyCharacter,
      title: 'Healing Dealt',
      style: { boxSizing: 'border-box' },
    },
    {
      key: (m: TeamPlayer) => m.damage.healingReceived.anyCharacter,
      title: 'Healing Received',
      style: { boxSizing: 'border-box' },
    },
    {
      key: (m: TeamPlayer) => m.score,
      title: 'Score',
      style: { boxSizing: 'border-box' },
    },
  ];

  constructor(props: ListProps) {
    super(props);
    this.state = {
      selectedSortBy: SortBy.None,
      leastToGreatest: false,
      searchValue: '',
    };
  }

  public render() {
    const { /*players, teams,*/status, visible } = this.props;
    if (true) /*!_.isEmpty(players) && !_.isEmpty(teams) && !status.loading && status.lastError === 'OK')*/ {
      // const displayedPlayers = this.getDisplayedPlayers();
      const teams: TeamInterface[] = [
        {
          teamID: 'Arthurian',
          outcome: 'Lose',
        },
        {
          teamID: 'Viking',
          outcome: 'Lose',
        },
        {
          teamID: 'Tuatha',
          outcome: 'Win',
        },
      ];

      const inputData = this.createData();
      // console.log(inputData);
      return (
        <Container>
          <TeamScore teams={/*this.props.*/teams} scenarioID={'Test-Scenario'/*this.props.scenarioID*/} />
          <GridView
            columnDefs={this.columnDefs}
            visible={visible}
            inputData={inputData}
            itemsPerPage={999}
            styles={ScenarioResultStyle}
            resizeableColumns={true}
          />
        </Container>
      );
    } else if (status.loading) {
      return (
        <Container>
          <ListContainer innerRef={(r: HTMLDivElement) => this.listRef = r}>
            <NoDataText>Fetching data for Scenario...</NoDataText>
          </ListContainer>
        </Container>
      );
    } else if (this.props.scenarioID !== '' && status.lastError !== 'OK') {
      return (
        <Container>
          <ListContainer innerRef={(r: HTMLDivElement) => this.listRef = r}>
            <NoDataText>There was an error fetching data about a recent Scenario...</NoDataText>
            <NoDataText>{status.lastError}</NoDataText>
          </ListContainer>
        </Container>
      );
    } else {
      return (
        <Container>
          <ListContainer innerRef={(r: HTMLDivElement) => this.listRef = r}>
            <NoDataText>No data for any recent Scenarios</NoDataText>
          </ListContainer>
        </Container>
      );
    }
  }

  public shouldComponentUpdate(nextProps: ListProps, nextState: ListState) {
    return this.props.scenarioID !== nextProps.scenarioID ||
      this.props.status.loading !== nextProps.status.loading ||
      this.props.status.lastError !== nextProps.status.lastError ||
      this.state.selectedSortBy !== nextState.selectedSortBy ||
      this.state.leastToGreatest !== nextState.leastToGreatest ||
      this.state.searchValue !== nextState.searchValue ||
      !_.isEqual(this.props.players, nextProps.players) ||
      !_.isEqual(this.props.teams, nextProps.teams) ||
      this.props.visible !== nextProps.visible;
  }

  /*private getDisplayedPlayers = () => {
    const players = [...this.props.players];
    const sortedPlayers = this.state.selectedSortBy !== SortBy.None ?
      players.sort((a: TeamPlayer, b: TeamPlayer) => this.sortPlayersByStat(a, b, this.state)) : players;
    return sortedPlayers;
  }

  private sortPlayersByStat = (a: TeamPlayer, b: TeamPlayer, state: ListState) => {
    switch (state.selectedSortBy) {
      case SortBy.Name: {
        if (state.leastToGreatest) {
          return b.displayName.localeCompare(a.displayName);
        }
        return a.displayName.localeCompare(b.displayName);
      }
      case SortBy.Faction: {
        if (state.leastToGreatest) {
          return b.teamID.localeCompare(a.teamID);
        }
        return a.teamID.localeCompare(b.teamID);
      }
      case SortBy.PlayerKills: {
        if (state.leastToGreatest) {
          return a.damage.killCount.playerCharacter - b.damage.killCount.playerCharacter;
        }
        return b.damage.killCount.playerCharacter - a.damage.killCount.playerCharacter;
      }
      case SortBy.PlayerAssists: {
        if (state.leastToGreatest) {
          return a.damage.killAssistCount.playerCharacter - b.damage.killAssistCount.playerCharacter;
        }
        return b.damage.killAssistCount.playerCharacter - a.damage.killAssistCount.playerCharacter;
      }
      case SortBy.NPCKills: {
        if (state.leastToGreatest) {
          return a.damage.killCount.nonPlayerCharacter - b.damage.killCount.nonPlayerCharacter;
        }
        return b.damage.killCount.nonPlayerCharacter - a.damage.killCount.nonPlayerCharacter;
      }
      case SortBy.Score: {
        if (state.leastToGreatest) {
          return a.score - b.score;
        }
        return b.score - a.score;
      }
      default: {
        if (state.leastToGreatest) {
          return a.damage[state.selectedSortBy].anyCharacter - b.damage[state.selectedSortBy].anyCharacter;
        }
        return b.damage[state.selectedSortBy].anyCharacter - a.damage[state.selectedSortBy].anyCharacter;
      }
    }
  }*/

  private createData = (): TeamPlayer[] => {
    const teamPlayers: TeamPlayer[] = [];
    for (let i = 0; i < 1000; i++) {
      const teamPlayer: TeamPlayer = {
        teamID: this.createTeamID(i),
        displayName: 'Player ' + i,
        characterType: 'PlayerCharacter',
        damage: {
          healingApplied: this.createCPTModel(i),
          healingReceived: this.createCPTModel(i),
          damageApplied: this.createCPTModel(i),
          damageReceived: this.createCPTModel(i),
          killCount: this.createCPTModel(i),
          deathCount: this.createCPTModel(i),
          killAssistCount: this.createCPTModel(i),
          createCount: this.createCPTModel(i),
        },
        score: i * 10,
        crafting: {
          blockSummary: this.createJobSummaryModel(i),
          grindSummary: this.createJobSummaryModel(i),
          makeSummary: this.createJobSummaryModel(i),
          purifySummary: this.createJobSummaryModel(i),
          repairSummary: this.createJobSummaryModel(i),
          salvageSummary: this.createJobSummaryModel(i),
          shapeSummary: this.createJobSummaryModel(i),
        },
      };
      teamPlayers.push(teamPlayer);
    }
    return teamPlayers;
  }

  private createTeamID = (i: number): string => {
    const chooseTeam = i % 3;
    switch (chooseTeam) {
      case 1: return 'Arthurian';
      case 2: return 'Viking';
      default: return 'Tuatha';
    }
  }

  private createCPTModel = (i: number): CountPerTargetTypeDBModel => {
    return ({
      self: i + i % 5,
      playerCharacter: i + i % 2 * 2,
      nonPlayerCharacter: i + i % 3 * 3,
      dummy: i + i % 5 * 5,
      anyCharacter: i + i % 7 * 7,
      resourceNode: i + i % 11 * 11,
      item: i + i % 13 * 13,
      building: i + i % 17 * 17,
    });
  }

  private createJobSummaryModel = (i: number): JobSummaryDBModel => {
    return ({
      started: i,
      canceled: i,
      collected: i,
    });
  }

  // private onSortClick = (sortBy: SortBy, leastToGreatest: boolean) => {
  //   this.setState({ searchValue: '', selectedSortBy: sortBy, leastToGreatest });
  // }

  // private onSearchChange = (value: string) => {
  //   this.setState({ searchValue: value, selectedSortBy: SortBy.None, leastToGreatest: false });
  // }
}

export default List;
