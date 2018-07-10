/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { css } from 'react-emotion';

import { FactionColors } from 'lib/factionColors';
import SearchableList from '../../SearchableList';
import { SortBy } from './ListHeaderItem';
import ListHeader from './ListHeader';
import ListItem from './ListItem';
import TeamScore from './TeamScore';
import { TeamInterface, TeamPlayer } from './ScenarioResultsContainer';
import {
  JobSummaryDBModel, CountPerTargetTypeDBModel,
} from '../../../../node_modules/@csegames/camelot-unchained/lib/graphql';

const Container = styled('div')`
  position: relative;
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

const ListItemsContainer = css`
  padding: 0px 5px 0px 5px;
  -webkit-mask-image: linear-gradient(to top, transparent 0%, black 4%);
`;

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
  constructor(props: ListProps) {
    super(props);
    this.state = {
      selectedSortBy: SortBy.None,
      leastToGreatest: false,
      searchValue: '',
    };
  }

  public render() {
    const { /*players, teams,*/ status, visible } = this.props;
    if (true) {
      const displayedPlayers = this.getDisplayedPlayers();
      return (
        <Container>
          <TeamScore teams={this.createTeams()} scenarioID={this.props.scenarioID} />
          <ListHeader onSearchChange={this.onSearchChange} onSortClick={this.onSortClick} {...this.state} />
          <SearchableList
            visible={visible}
            containerClass={ListContainer}
            listItemsContainerClass={ListItemsContainer}
            searchValue={this.state.searchValue}
            searchKey={'displayName'}
            listItemsData={displayedPlayers}
            listItemHeight={40}
            extraItemsRendered={10}
            renderListItem={(player: any, searchIncludes, isVisible, i) => {
              const colors = FactionColors[player.teamID];
              return (
                <ListItem
                  key={i}
                  player={player}
                  searchIncludes={searchIncludes}
                  isVisible={isVisible}
                  backgroundColor={colors ? colors.backgroundColor : 'transparent'}
                />
              );
            }}>
          </SearchableList>
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

  private getDisplayedPlayers = () => {
    const players = this.createData();
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
  }

  private onSortClick = (sortBy: SortBy, leastToGreatest: boolean) => {
    this.setState({ searchValue: '', selectedSortBy: sortBy, leastToGreatest });
  }

  private onSearchChange = (value: string) => {
    this.setState({ searchValue: value, selectedSortBy: SortBy.None, leastToGreatest: false });
  }

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

  private createTeams = (): TeamInterface[] => {
    return [
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
  }
}

export default List;
