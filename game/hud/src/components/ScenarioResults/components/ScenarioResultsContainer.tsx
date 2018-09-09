/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { events, client, soundEvents } from '@csegames/camelot-unchained';
import { GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import ScenarioResultsView from './ScenarioResultsView';
import { CharacterOutcomeDBModel, ScenarioSummaryDBModel, ScenarioOutcome, ProgressionCharacterType } from 'gql/interfaces';
import {
  JobSummaryDBModel, CountPerTargetTypeDBModel,
} from '@csegames/camelot-unchained/lib/graphql';


export interface TeamInterface {
  teamID: string;
  outcome: ScenarioOutcome;
}

export interface TeamPlayer extends CharacterOutcomeDBModel {
  teamID: string;
}

export interface ScenarioResultsContainerProps {
  graphql: GraphQLResult<{ scenariosummary: ScenarioSummaryDBModel }>;
  scenarioID: string;
}

export interface ScenarioResultsContainerState {
  visible: boolean;
}

class ScenarioResultsContainer extends React.Component<ScenarioResultsContainerProps, ScenarioResultsContainerState> {
  private pollingInterval: any;
  private participants: TeamPlayer[] = [];
  private teams: TeamInterface[] = [];

  constructor(props: ScenarioResultsContainerProps) {
    super(props);
    setTimeout(
      () => {
        this.participants = this.createData();
        this.teams = this.createTeams();
        this.forceUpdate();
      },
      5000);

    this.state = {
      visible: false,
    };
  }

  public render() {
    const { graphql } = this.props;
    const participantsAndTeams = this.getParticipantsAndTeams(graphql.data && graphql.data.scenariosummary);
    return (
      <ScenarioResultsView
        visible={this.state.visible}
        participants={participantsAndTeams ? participantsAndTeams.participants : []}
        teams={participantsAndTeams ? participantsAndTeams.teams : []}
        onCloseClick={this.toggleVisibility}
        status={{ loading: graphql.loading, lastError: graphql.lastError }}
        scenarioID={this.props.scenarioID}
      />
    );
  }

  public componentDidMount() {
    events.on('hudnav--navigate', (name: string) => {
      if (name === 'scenario-results') {
        this.toggleVisibility();
      }
    });
  }

  public shouldComponentUpdate(nextProps: ScenarioResultsContainerProps, nextState: ScenarioResultsContainerState) {
    return this.props.scenarioID !== nextProps.scenarioID ||
      this.state.visible !== nextState.visible ||
      !_.isEqual(this.props.graphql, nextProps.graphql);
  }

  public componentWillUpdate(nextProps: ScenarioResultsContainerProps, nextState: ScenarioResultsContainerState) {
    const scenarioIDChanged = this.props.scenarioID !== nextProps.scenarioID;
    const visibilityChanged = this.state.visible !== nextState.visible;
    if (scenarioIDChanged || visibilityChanged) {
      this.props.graphql.refetch();
    }

    const prevTeamOutcome = this.props.graphql.data && this.props.graphql.data.scenariosummary &&
      this.props.graphql.data.scenariosummary.teamOutcomes;
    const nextTeamOutcome = nextProps.graphql.data && nextProps.graphql.data.scenariosummary &&
      nextProps.graphql.data.scenariosummary.teamOutcomes;
    if ((!prevTeamOutcome || _.isEmpty(prevTeamOutcome)) && (nextTeamOutcome && !_.isEmpty(nextTeamOutcome))) {
      if (!this.state.visible && !nextState.visible) {
        this.toggleVisibility();
      }
    }

    if (nextProps.graphql.data && nextProps.graphql.data.scenariosummary && _.isEmpty(nextTeamOutcome)) {
      if (!this.pollingInterval) {
        this.pollingInterval = setInterval(() => this.props.graphql.refetch(), 5000);
      }
    } else {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  public componentWillUnmount() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private toggleVisibility = () => {
    if (!this.state.visible) {
      client.RequestInputOwnership();
    } else {
      client.PlaySoundEvent(soundEvents.PLAY_MUSIC_SCENARIO_END_CLOSEWINDOW);
      client.ReleaseInputOwnership();
    }
    this.setState({ visible: !this.state.visible });
  }

  private getParticipantsAndTeams = (scenarioSummary: ScenarioSummaryDBModel) => {
    /*if (scenarioSummary) {
      let participants: TeamPlayer[] = [];
      let teams: TeamInterface[] = [];
      _.forEach(scenarioSummary.teamOutcomes, (_teamOutcome) => {
        participants = participants.concat(_.map(_teamOutcome.participants, participant =>
          ({ ...participant, teamID: _teamOutcome.teamID })));
        teams = teams.concat({ teamID: _teamOutcome.teamID, outcome:  _teamOutcome.outcome });
      });

      return {
        participants,
        teams,
      };
    }*/
    return {
      participants: this.participants,
      teams: this.teams,
    };
  }

  private createData = (): TeamPlayer[] => {
    const teamPlayers: TeamPlayer[] = [];
    for (let i = 0; i < 1000; i++) {
      const teamPlayer: TeamPlayer = {
        teamID: this.createTeamID(i),
        displayName: 'Player ' + i,
        characterType: ProgressionCharacterType.PlayerCharacter,
        damage: {
          healingApplied: this.createCPTModel(i),
          healingReceived: this.createCPTModel(i),
          damageApplied: this.createCPTModel(i),
          damageReceived: this.createCPTModel(i),
          killCount: this.createCPTModel(i),
          deathCount: this.createCPTModel(i),
          killAssistCount: this.createCPTModel(i),
          createCount: this.createCPTModel(i),
          woundsApplied: this.createCPTModel(i),
          woundsHealedApplied: this.createCPTModel(i),
          woundsHealedReceived: this.createCPTModel(i),
          woundsReceived: this.createCPTModel(i),
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
        outcome: ScenarioOutcome.Lose,
      },
      {
        teamID: 'Viking',
        outcome: ScenarioOutcome.Lose,
      },
      {
        teamID: 'Tuatha',
        outcome: ScenarioOutcome.Win,
      },
    ];
  }
}

export default ScenarioResultsContainer;
