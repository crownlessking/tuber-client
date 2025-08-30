import { CSSProperties } from 'react';
import AbstractState from '../../controllers/AbstractState';

describe('AbstractState', () => {

  class ConcreteState extends AbstractState {
    get parent(): Record<string, unknown> { return {}; }
    get state(): Record<string, unknown> { return {}; }
    get props(): Record<string, unknown> { return {}; }
    get theme(): CSSProperties { return {}; }
  }

  it('is an abstract class', () => {
    expect(AbstractState).toBeInstanceOf(Function);
    expect(() => new ConcreteState()).toThrowError();
  });

  it('has a parent getter', () => {
    const state = new ConcreteState();
    expect(state.parent).toEqual({});
  });

  it('has a state getter', () => {
    const state = new ConcreteState();
    expect(state.state).toEqual({});
  });

  it('has a props getter', () => {
    const state = new ConcreteState();
    expect(state.props).toEqual({});
  });

  it('has a theme getter', () => {
    const state = new ConcreteState();
    expect(state.theme).toEqual({});
  });

});
