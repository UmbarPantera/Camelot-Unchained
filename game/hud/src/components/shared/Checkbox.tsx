/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { cx } from '@csegames/linaria';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

export interface ContainerProps {
  dimensions: number;
}

// #region Container constants
const CONTAINER_DEFAULT_DIMENSIONS = 28;
const CONTAINER_BORDER_RADIUS = 2;
// #endregion
const Container = styled.div<React.HTMLAttributes<HTMLDivElement> & ContainerProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props: ContainerProps) => props.dimensions}px;
  height: ${(props: ContainerProps) => props.dimensions}px;
  font-size: ${(props: ContainerProps) => props.dimensions}px;
  border-radius: ${CONTAINER_BORDER_RADIUS}px;
  background-color: #f2ddcb;
  cursor: pointer;
  user-select: none;

  @media (max-width: 2560px) {
    width: ${(props: ContainerProps) => props.dimensions * MID_SCALE}px;
    height: ${(props: ContainerProps) => props.dimensions * MID_SCALE}px;
    font-size: ${(props: ContainerProps) => props.dimensions * MID_SCALE}px;
    border-radius: ${CONTAINER_BORDER_RADIUS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${(props: ContainerProps) => props.dimensions * HD_SCALE }px;
    height: ${(props: ContainerProps) => props.dimensions * HD_SCALE}px;
    font-size: ${(props: ContainerProps) => props.dimensions * HD_SCALE}px;
    border-radius: ${CONTAINER_BORDER_RADIUS * HD_SCALE}px;
  }
`;

const Check = styled.span`
  color: #5b3329;
`;

export interface CheckBoxCustomStyles {
  container: string;
  check: string;
}

export interface Props {
  checked: boolean;
  dimensions?: number;
  customStyles?: Partial<CheckBoxCustomStyles>;
}

// tslint:disable-next-line:function-name
export function Checkbox(props: Props) {
  return (
    <Container
      className={props.customStyles && props.customStyles.container}
      dimensions={props.dimensions ? props.dimensions : CONTAINER_DEFAULT_DIMENSIONS}
    >
      {props.checked && <Check className={cx('fa fa-check', props.customStyles && props.customStyles.check)}></Check>}
    </Container>
  );
}
