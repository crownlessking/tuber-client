import StateAllDialogs from '../../controllers/StateAllDialogs';

describe('StateAllDialogs', () => {
  describe('constructor', () => {
    it('should create a state all dialogs object', () => {
      const state = new StateAllDialogs({
        dialogs: [
          {
            id: '1',
            title: 'Dialog 1',
            description: 'Dialog 1 description',
            links: {
              self: 'http://example.com/dialogs/1'
            }
          },
          {
            id: '2',
            title: 'Dialog 2',
            description: 'Dialog 2 description',
            links: {
              self: 'http://example.com/dialogs/2'
            }
          }
        ],
        links: {
          self: 'http://example.com/dialogs'
        }
      });
      expect(state).toEqual({
        _allDialogsState: {
          dialogs: [
            {
              id: '1',
              title: 'Dialog 1',
              description: 'Dialog 1 description',
              links: {
                self: 'http://example.com/dialogs/1'
              }
            },
            {
              id: '2',
              title: 'Dialog 2',
              description: 'Dialog 2 description',
              links: {
                self: 'http://example.com/dialogs/2'
              }
            }
          ],
          links: {
            self: 'http://example.com/dialogs'
          }
        }
      });
    });
  });

  describe('state', () => {
    it('should return the state', () => {
      const state = new StateAllDialogs({
        dialogs: [
          {
            id: '1',
            title: 'Dialog 1',
            description: 'Dialog 1 description',
            links: {
              self: 'http://example.com/dialogs/1'
            }
          },
          {
            id: '2',
            title: 'Dialog 2',
            description: 'Dialog 2 description',
            links: {
              self: 'http://example.com/dialogs/2'
            }
          }
        ],
        links: {
          self: 'http://example.com/dialogs'
        }
      });
      expect(state.state).toEqual({
        dialogs: [
          {
            id: '1',
            title: 'Dialog 1',
            description: 'Dialog 1 description',
            links: {
              self: 'http://example.com/dialogs/1'
            }
          },
          {
            id: '2',
            title: 'Dialog 2',
            description: 'Dialog 2 description',
            links: {
              self: 'http://example.com/dialogs/2'
            }
          }
        ],
        links: {
          self: 'http://example.com/dialogs'
        }
      });
    });
  });
});