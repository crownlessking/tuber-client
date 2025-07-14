import AbstractState from './AbstractState';
import IStateAllIcons from '../interfaces/IStateAllIcons';
import IStateIcon from '../interfaces/IStateIcon';
import State from './State';
import StateIcon from './StateIcon';

export default class StateAllIcons extends AbstractState {
  private _allIconsState: IStateAllIcons;
  private _parentDef?: State;

  constructor(allIconsState: IStateAllIcons, parent?: State) {
    super();
    this._allIconsState = allIconsState;
    this._parentDef = parent;
  }

  /** Get a copy of all icons definition. */
  get state(): IStateAllIcons { 
    return this._allIconsState; 
  }

  /** Chain-access to root definition. */
  get parent(): State { 
    return this._parentDef || new State(); 
  }

  get props(): any { 
    return this.die('Not implemented yet.', {}); 
  }

  get theme(): any { 
    return this.die('Not implemented yet.', {}); 
  }

  /**
   * Get an icon state by name.
   *
   * @param iconName the name/key of the icon
   * @returns the icon state or null if not found
   */
  getIconState = (iconName: string): IStateIcon => {
    return this._allIconsState[iconName] || this._allIconsState['no_icon'];
  };

  /**
   * Get an icon controller instance.
   *
   * @param iconName the name/key of the icon
   * @returns StateIcon instance or null if icon not found
   */
  iconAt = (iconName: string): StateIcon => {
    const iconState = this.getIconState(iconName);
    return new StateIcon(iconState, this);
  };

  /**
   * Get an icon controller instance by name.
   * Alias for iconAt method.
   *
   * @param iconName the name/key of the icon
   * @returns StateIcon instance or null if icon not found
   */
  getIcon = (iconName: string): StateIcon => {
    return this.iconAt(iconName);
  };

  /**
   * Check if an icon exists in the collection.
   *
   * @param iconName the name/key of the icon
   * @returns true if icon exists, false otherwise
   */
  hasIcon = (iconName: string): boolean => {
    return iconName in this._allIconsState;
  };

  /**
   * Get all available icon names.
   *
   * @returns array of icon names
   */
  getIconNames = (): string[] => {
    return Object.keys(this._allIconsState);
  };

  /**
   * Get the count of available icons.
   *
   * @returns number of icons in the collection
   */
  get iconCount(): number {
    return Object.keys(this._allIconsState).length;
  };

  /**
   * Add or update an icon in the collection.
   *
   * @param iconName the name/key for the icon
   * @param iconData the icon state data
   */
  setIcon = (iconName: string, iconData: IStateIcon): void => {
    this._allIconsState[iconName] = iconData;
  };

  /**
   * Remove an icon from the collection.
   *
   * @param iconName the name/key of the icon to remove
   * @returns true if icon was removed, false if it didn't exist
   */
  removeIcon = (iconName: string): boolean => {
    if (this.hasIcon(iconName)) {
      delete this._allIconsState[iconName];
      return true;
    }
    return false;
  };

  /**
   * Get all icons as an array of [name, StateIcon] pairs.
   *
   * @returns array of [iconName, StateIcon] tuples
   */
  getAllIcons = (): [string, StateIcon][] => {
    return Object.entries(this._allIconsState).map(([name, iconState]) => [
      name,
      new StateIcon(iconState, this)
    ]);
  };

  /**
   * Search for icons by name pattern.
   *
   * @param pattern string or regex pattern to match against icon names
   * @returns array of matching icon names
   */
  searchIcons = (pattern: string | RegExp): string[] => {
    const iconNames = this.getIconNames();
    if (typeof pattern === 'string') {
      return iconNames.filter(name => name.includes(pattern));
    }
    return iconNames.filter(name => pattern.test(name));
  };
}