import JsonapiRequest from '../../business.logic/jsonapi.request';

describe('jsonapi.request.ts', () => {

  describe('JsonapiRequest', () => {
    it('should create a jsonapi request object', () => {
      const request = new JsonapiRequest('type', { attr: 'value' })
      expect(request).toEqual({
        _request: {
          data: {
            type: 'type',
            attributes: { attr: 'value' }
          }
        }
      });
    });
  });

});