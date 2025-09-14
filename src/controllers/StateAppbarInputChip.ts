import { TStateAllChips, TStateChips } from '../interfaces/IState';
import AbstractState from './AbstractState';
import State from './State';
import StateFormItemCustomChip from './templates/StateFormItemCustomChip';

interface IConfigure {
  template?: string;
  route?: string;
}

export default class StateAppbarInputChip extends AbstractState {
  private _route?: string;
  private _template?: string;

  constructor(private _allChipState: TStateAllChips,
    private _parentDef?: State
  ) {
    super();
  }

  get state(): TStateAllChips { return this._allChipState; }
  get parent(): State {
    return this._parentDef ?? (this._parentDef = new State());
  }
  get props(): unknown { return this.die('\'props\' not implemented yet.', {}); }
  get theme(): unknown { return this.die('\'theme\' not implemented yet.', {}); }

  configure = ({ template, route }: IConfigure) => {
    this._route = route;
    this._template = template;
  };

  getRouteChipsState(route: string): TStateChips {
    return this._allChipState[route] ?? [];
  }

  private _breakPath(path: string): string[] {
    const fixedPath = path.replace(/^\/|\/$/, '');
    const parts = fixedPath.split('/');
    return parts;
  }

  /**
   * Gathers information about the template and route to determine if the
   * a chip should be added to the search field.  
   * The template and route must have the same first part and the same number
   * of parts.
   *
   * @param tpl papthnames with placeholders e.g. endpoint/:page/:id
   * @param route current route pathnames
   * @returns 
   */
  private _tplRouteAnal(tpl: string, route: string): {
    tplParts: string[],
    routeParts: string[],
    match: boolean
  } {
    const anal = {
      'tplParts': this._breakPath(tpl),
      'routeParts': this._breakPath(route),
      'match': false
    };
    anal.match = anal.tplParts.length === anal.routeParts.length
      && anal.tplParts[0] === anal.routeParts[0];
    return anal;
  }

  get(): StateFormItemCustomChip<this>[]|null {
    if (!this._route || !this._template) {
      this.ler('call StateAppbarInputChip.configure() first.', null);
      return null;
    }
    const anal = this._tplRouteAnal(this._template, this._route);
    if (!anal.match) { return null; }
    const routeParts = [ ...anal.routeParts ];
    routeParts.shift();
    const chips: StateFormItemCustomChip<this>[] = [];
    const routeChipsState = this.getRouteChipsState(this._route);

    for (const id of routeParts) { // The id is in the URL pathnames
      const chipState = routeChipsState[id];
      chips.push(
        new StateFormItemCustomChip<this>(chipState, this)
      );
    }
  
    return chips;
  }

  alwaysGet(): StateFormItemCustomChip[] {
    return this.get() ?? [];
  }

}