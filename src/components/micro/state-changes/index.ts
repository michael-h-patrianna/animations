import type { AnimationComponentMap } from '@/types/animation';

import { StateChangesAvatarOnline } from './StateChangesAvatarOnline';
import { StateChangesBadgeComplete } from './StateChangesBadgeComplete';
import { StateChangesCardHover } from './StateChangesCardHover';
import { StateChangesCardSelect } from './StateChangesCardSelect';
import { StateChangesChipEntry } from './StateChangesChipEntry';
import { StateChangesChipExit } from './StateChangesChipExit';
import { StateChangesEmptyToPopulated } from './StateChangesEmptyToPopulated';
import { StateChangesEnableDisable } from './StateChangesEnableDisable';
import { StateChangesErrorToSuccess } from './StateChangesErrorToSuccess';
import { StateChangesListItemActivate } from './StateChangesListItemActivate';
import { StateChangesListItemSuccess } from './StateChangesListItemSuccess';
import { StateChangesListSort } from './StateChangesListSort';
import { StateChangesLoadingToLoaded } from './StateChangesLoadingToLoaded';
import { StateChangesPillGlow } from './StateChangesPillGlow';
import { StateChangesSelectedState } from './StateChangesSelectedState';
import { StateChangesTabChange } from './StateChangesTabChange';
import { StateChangesValidationFail } from './StateChangesValidationFail';
import { StateChangesValidationPass } from './StateChangesValidationPass';

export { StateChangesAvatarOnline } from './StateChangesAvatarOnline';
export { StateChangesBadgeComplete } from './StateChangesBadgeComplete';
export { StateChangesCardHover } from './StateChangesCardHover';
export { StateChangesCardSelect } from './StateChangesCardSelect';
export { StateChangesChipEntry } from './StateChangesChipEntry';
export { StateChangesChipExit } from './StateChangesChipExit';
export { StateChangesEmptyToPopulated } from './StateChangesEmptyToPopulated';
export { StateChangesEnableDisable } from './StateChangesEnableDisable';
export { StateChangesErrorToSuccess } from './StateChangesErrorToSuccess';
export { StateChangesListItemActivate } from './StateChangesListItemActivate';
export { StateChangesListItemSuccess } from './StateChangesListItemSuccess';
export { StateChangesListSort } from './StateChangesListSort';
export { StateChangesLoadingToLoaded } from './StateChangesLoadingToLoaded';
export { StateChangesPillGlow } from './StateChangesPillGlow';
export { StateChangesSelectedState } from './StateChangesSelectedState';
export { StateChangesTabChange } from './StateChangesTabChange';
export { StateChangesValidationFail } from './StateChangesValidationFail';
export { StateChangesValidationPass } from './StateChangesValidationPass';

export const microStateChangesAnimations: AnimationComponentMap = {
  'state-changes__avatar-online': StateChangesAvatarOnline,
  'state-changes__badge-complete': StateChangesBadgeComplete,
  'state-changes__card-hover': StateChangesCardHover,
  'state-changes__card-select': StateChangesCardSelect,
  'state-changes__chip-entry': StateChangesChipEntry,
  'state-changes__chip-exit': StateChangesChipExit,
  'state-changes__empty-to-populated': StateChangesEmptyToPopulated,
  'state-changes__enable-disable': StateChangesEnableDisable,
  'state-changes__error-to-success': StateChangesErrorToSuccess,
  'state-changes__list-item-activate': StateChangesListItemActivate,
  'state-changes__list-item-success': StateChangesListItemSuccess,
  'state-changes__list-sort': StateChangesListSort,
  'state-changes__loading-to-loaded': StateChangesLoadingToLoaded,
  'state-changes__pill-glow': StateChangesPillGlow,
  'state-changes__selected-state': StateChangesSelectedState,
  'state-changes__tab-change': StateChangesTabChange,
  'state-changes__validation-fail': StateChangesValidationFail,
  'state-changes__validation-pass': StateChangesValidationPass
};
