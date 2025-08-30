import { dataActions as a } from '../../slices/data.slice';
import store from '../../state';

const { dispatch } = store;

describe('dataSlice', () => {

  it('insert array element at the beginning', () => {
    dispatch(a.dataStack({ endpoint: 'bookmark', data: { id: 1, title: 'test' } }));
    expect(store.getState().data.bookmark[0].attributes.title).toBe('test');
  });

  it('should store a collection but will replace the existing one', () => {
    dispatch(a.dataStoreCol({ endpoint: 'bookmark', collection: [] }));
    expect(store.getState().data.bookmark).toEqual([]);
  });

  it('Store a collection by accumulation 1', () => {
    dispatch(a.dataQueueCol({ endpoint: 'bookmark', collection: [] }));
    expect(store.getState().data.bookmark).toEqual([]);
  });

  it('Store a collection by accumulation 2', () => {
    dispatch(a.dataStackCol({ endpoint: 'bookmark', collection: [] }));
    expect(store.getState().data.bookmark).toEqual([]);
  });

  it('Store a collection by accumulation 3', () => {
    dispatch(a.dataLimitQueueCol({
      endpoint: 'bookmark',
      collection: [],
      pageSize: 10,
      limit: 10
    }));
    expect(store.getState().data.bookmark).toEqual([]);
  });

  it('Store a collection by accumulation 4', () => {
    dispatch(a.dataLimitStackCol({
      endpoint: 'bookmark',
      collection: [],
      pageSize: 10,
      limit: 10
    }));
    expect(store.getState().data.bookmark).toEqual([]);
  });

  it('Deletes a collection', () => {
    dispatch(a.dataRemoveCol('bookmark'));
    expect(store.getState().data.bookmark).toEqual([]);
  });

  it('Save changes to a single resouce', () => {
    dispatch(a.dataUpdateByIndex({
      endpoint: 'bookmark',
      index: 0,
      resource: { id: '1', type: 'bookmarks' }
    }));
    expect(store.getState().data.bookmark[0].attributes.title).toBe('test');
  });

  it('Delete resource by index', () => {
    dispatch(a.dataDeleteByIndex({
      endpoint: 'bookmark',
      index: 0,
      resource: {
        id: '1',
        type: 'bookmarks',
        attributes: {
          title: 'test'
        }
      }
    }));
    expect(store.getState().data.bookmark).toEqual([]);
  });

  it('Modified a single data member', () => {
    dispatch(a.dataSetAttrByIndex({
      endpoint: 'bookmark',
      index: 0,
      prop: 'title',
      val: 'test'
    }));
    expect(store.getState().data.bookmark[0].attributes.title).toBe('test');
  });

  it('Modified a single data member by name', () => {
    dispatch(a.dataUpdateByName({
      collectionName: 'bookmark',
      name: 'title',
      resource: {
        id: '1',
        type: 'bookmarks',
        attributes: {
          title: 'test'
        }
      }
    }));
    expect(store.getState().data.bookmark[0].attributes.title).toBe('test');
  });

  it('Modified a single data member by id', () => {
    dispatch(a.dataUpdateById({
      collectionName: 'bookmark',
      id: '1',
      resource: {
        id: '1',
        type: 'bookmarks',
        attributes: {
          title: 'test'
        }
      }
    }));
    expect(store.getState().data.bookmark[0].attributes.title).toBe('test');
  });
});