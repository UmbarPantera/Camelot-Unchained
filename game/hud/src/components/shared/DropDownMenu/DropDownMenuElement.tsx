/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { cx, css } from '@csegames/linaria';
import { MenuDef, DropDownMenuCustomStyles } from '../DropDownMenu';
import MenuContainer from './DropDownMenuContainer';
import { Checkbox, CheckBoxCustomStyles } from '../Checkbox';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';


const Container = styled.div`
  display: flex;
  flex: 0 1 auto;
  box-sizing: border-box;
  background-color: #18130E;
`;


// #region Container constants
const LABEL_CONTAINER_FONT_SIZE = 36;
const LABEL_CONTAINER_PADDING_VERTICAL = 3;
const LABEL_CONTAINER_PADDING_HORIZONTAL = 8;
// #endregion

const LabelContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  font-size: ${LABEL_CONTAINER_FONT_SIZE}px;
  line-height: ${LABEL_CONTAINER_FONT_SIZE}px;
  padding: ${LABEL_CONTAINER_PADDING_VERTICAL}px ${LABEL_CONTAINER_PADDING_HORIZONTAL}px;
  color: #413735;
  box-sizing: border-box;
  border: 1px solid #413735;
  &:hover {
    cursor: pointer;
    background-color: #6A6260;
  }
  &:hover * {
    cursor: pointer;
  }

  @media (max-width: 2560px) {
    font-size: ${LABEL_CONTAINER_FONT_SIZE * MID_SCALE}px;
    line-height: ${LABEL_CONTAINER_FONT_SIZE * MID_SCALE}px;
    padding: ${LABEL_CONTAINER_PADDING_VERTICAL * MID_SCALE}px ${LABEL_CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${LABEL_CONTAINER_FONT_SIZE * HD_SCALE}px;
    line-height: ${LABEL_CONTAINER_FONT_SIZE * HD_SCALE}px;
    padding: ${LABEL_CONTAINER_PADDING_VERTICAL * HD_SCALE}px ${LABEL_CONTAINER_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

const labelContainerOpenMenu = css`
  background-color: #5c5553;
`;

const LabelText = styled.label`
  flex: 1 1 auto;
  white-space: nowrap;
  padding: ${LABEL_CONTAINER_PADDING_VERTICAL}px ${LABEL_CONTAINER_PADDING_HORIZONTAL}px;
`;

// #region SelectionCount constants
const SELECTION_COUNT_SCALE = 0.7;
const NUMBER_SCALE = 1.2;
const SELECTION_COUNT_BORDER = 2;
// #endregion

const SelectionCount = styled.div`
  overflow: hidden;
  width: ${LABEL_CONTAINER_FONT_SIZE * SELECTION_COUNT_SCALE * NUMBER_SCALE + 2 * SELECTION_COUNT_BORDER}px;
  font-size: ${LABEL_CONTAINER_FONT_SIZE * SELECTION_COUNT_SCALE}px;
  font-weight: bold;
  border-radius: 50%;
  color: rgb(0,0,0);
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 2560px) {
    width: ${LABEL_CONTAINER_FONT_SIZE * MID_SCALE * SELECTION_COUNT_SCALE * NUMBER_SCALE + 2 * SELECTION_COUNT_BORDER}px;
    font-size: ${LABEL_CONTAINER_FONT_SIZE * MID_SCALE * SELECTION_COUNT_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${LABEL_CONTAINER_FONT_SIZE * HD_SCALE * SELECTION_COUNT_SCALE * NUMBER_SCALE + 2 * SELECTION_COUNT_BORDER}px;
    font-size: ${LABEL_CONTAINER_FONT_SIZE * HD_SCALE * SELECTION_COUNT_SCALE}px;
  }
`;

const selectionCountCircle = css`
  border: ${SELECTION_COUNT_BORDER}px solid #413735;
  background-color: #413735;
`;

const ArrowContainer = styled.i`
  flex: 0 0 auto;
  padding: ${LABEL_CONTAINER_PADDING_VERTICAL}px ${LABEL_CONTAINER_PADDING_HORIZONTAL}px;
`;

const CheckBoxContainer = styled.span`
`;


export interface MenuElementCustomStyles {
  container: string;
  labelContainer: string;
  labelContainerOpenMenu: string;
  checkBoxContainer: string;
  checkBoxStyles: Partial<CheckBoxCustomStyles>;
  labelText: string;
  selectionCount: string;
  selectionCountCircle: string;
  arrowContainer: string;
}

export interface Props {
  def: MenuDef;
  renderCheckBox: (checked: boolean) => JSX.Element;
  update: (def: MenuDef) => void;
  onMenuClick: (def: MenuDef) => void;
  onSelectChange: (def: MenuDef) => void;
  showCheckBox: boolean;
  showCount: boolean;
  isMenuBarElement?: boolean;
  customStyles?: Partial<DropDownMenuCustomStyles>;
}

// tslint:disable-next-line:function-name
export function DropDownMenuElement(props: Props): JSX.Element {
  const mouseOver = React.useRef(false);
  const mouseOverTimeout = React.useRef(null);
  const [showList, setShowList] = React.useState(false);
  const [positionLeft, setPositionLeft] = React.useState(0);
  const [positionTop, setPositionTop] = React.useState(0);

  function showDropdown() {
    setShowList(true);
  }

  function hideDropDown() {
    setShowList(false);
  }

  function onMouseDownHide() {
    if (!mouseOver.current) {
      hideDropDown();
    }
  }

  function handleMouseEnter() {
    mouseOver.current = true;
    clearTimeout(mouseOverTimeout.current);
  }

  function handleMouseLeave() {
    mouseOver.current = false;
    mouseOverTimeout.current = setTimeout(() => hideDropDown(), 1500);
  }

  const onArrowClick = () => {
    if (!showList) {
      showDropdown();
      return;
    }
    hideDropDown();
  };

  function onLabelTextClick() {
    if (props.showCheckBox) {
      onCheckChange();
      return;
    }
    onArrowClick();
  }

  // close the whole open menu tree
  function onMenuClickClose(def: MenuDef) {
    if (props.onMenuClick) {
      props.onMenuClick(def);
      if (!props.showCheckBox && !(def.items && def.items.length)) {
        hideDropDown();
      }
    }
  }

  // create update function that maps the subitems to their item to update the correct part of the menuState
  function update(def: MenuDef) {
    return function(items: MenuDef[]) {
      // count how many subitems are selected. If all are selected, the item get selected, too
      let count = 0;
      items.forEach((item) => {
        if (item.selected) count += 1;
      });
      const nextDef: MenuDef = {
        ...def,
        selected: items.length === count ? true : false,
        items,
      };
      props.update(nextDef);
    };
  }

  function onCheckChange() {
    const nextDef = changeSelectionsBelow(props.def);
    props.update(nextDef);

    if (props.onSelectChange) {
      props.onSelectChange(nextDef);
    }
  }

  // calculte how subitems have to change, if the item is selected or deselected
  function changeSelectionsBelow(def: MenuDef): MenuDef {
    if (!!!def.items) {
      return ({
        ...def,
        selected: !props.def.selected,
      });
    }
    return ({
      ...def,
      selected: !props.def.selected,
      items: def.items.map(item => changeSelectionsBelow(item)),
    });
  }

  // calculate, how many elements at the bottom of this menu tree are selected
  let selectedCount = 0;

  if (props.showCheckBox && props.showCount && props.def.items && !!props.def.items.length) {
    function collectCounts(def: MenuDef) {
      if (!!def.items && !!def.items.length) {
        def.items.forEach(item => collectCounts(item));
        return;
      }
      if (def.selected) selectedCount += 1;
    }

    props.def.items.forEach(item => collectCounts(item));
  }

  // find out where to position the MenuContainer
  const measureContainer = React.useCallback((node: HTMLDivElement) => {
    if (node !== null && showList && !!props.def.items) {
      const nodeRect = node.getBoundingClientRect();
      const parentRect = node.offsetParent.getBoundingClientRect();
      const leftPosition = props.isMenuBarElement
        ? nodeRect.left - parentRect.left
        : nodeRect.width;
      const topPosition = props.isMenuBarElement
        ? nodeRect.top - parentRect.top + nodeRect.height
        : nodeRect.top - parentRect.top;
      if (leftPosition !== positionLeft) setPositionLeft(leftPosition);
      if (topPosition !== positionTop) setPositionTop(topPosition);
    }
  }, [showList]);

  // determine which arrow we need to expand/close the menu
  const show = props.isMenuBarElement ? 'down' : 'right';
  const hide = props.isMenuBarElement ? 'up' : 'left';

  const customStyles = props.customStyles && props.customStyles.menuElement;
  const renderCheckBox = (
    <Checkbox
      checked={props.def.selected}
      customStyles={customStyles && customStyles.checkBoxStyles}
      dimensions={28}
      checkSize={24}
    />
  );
  return (
    <Container
      className={customStyles && customStyles.container}
      ref={measureContainer}
      onMouseEnter={() => handleMouseEnter()}
      onMouseLeave={() => handleMouseLeave()}
    >
      <LabelContainer
        className={cx(
          customStyles && customStyles.labelContainer,
          showList && labelContainerOpenMenu,
          showList && customStyles && customStyles.labelContainerOpenMenu,
        )}
        onClick={() => { if (props.onMenuClick) props.onMenuClick(props.def); }}
      >
        {props.showCheckBox &&
          <CheckBoxContainer
            className={customStyles && customStyles.checkBoxContainer}
            onClick={() => onCheckChange()}
          >
            {props.renderCheckBox ? props.renderCheckBox(props.def.selected) : renderCheckBox}
          </CheckBoxContainer>
        }
        <LabelText
          className={customStyles && customStyles.labelText}
          onClick={() => onLabelTextClick()}
        >
          {props.def.label}
        </LabelText>
        {props.showCheckBox && props.showCount && props.def.items && !!props.def.items.length
          && <SelectionCount
            className={cx(
              customStyles && customStyles.selectionCount,
              !!selectedCount && selectionCountCircle,
              !!selectedCount && customStyles && customStyles.selectionCountCircle,
            )}
            onClick={() => onLabelTextClick()}
          >
            {selectedCount ? selectedCount : ''}
          </SelectionCount>
        }
        {props.def.items && !!props.def.items.length && <ArrowContainer
          className={cx(customStyles && customStyles.arrowContainer, `fa fa-chevron-${showList ? hide : show}`)}
          onClick={() => onArrowClick()}
        />}
      </LabelContainer>
      {showList && <MenuContainer
        defs={props.def.items}
        renderCheckBox={props.renderCheckBox}
        positionLeft={positionLeft}
        positionTop={positionTop}
        onMenuClick={props.isMenuBarElement ? onMenuClickClose : props.onMenuClick}
        onMouseDownHide={onMouseDownHide}
        update={update(props.def)}
        onSelectChange={props.onSelectChange}
        showCheckBox={props.showCheckBox}
        showCount={props.showCount}
        customStyles={props.customStyles}
      />}
    </Container>
  );
}

export default DropDownMenuElement;
