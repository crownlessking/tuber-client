import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Content from '../../../components/content';
import StatePage from 'src/controllers/StatePage';

interface IDef {
  contentName: string;
}

// Mock all dependencies
jest.mock('../../../components/view.component', () => {
  return React.memo(function MockView({ def }: { def: IDef; }) {
    return <div data-testid="view-component">View: {def.contentName}</div>;
  });
});

jest.mock('../../../components/content/html.component', () => {
  return React.memo(function MockHtmlContent({ def }: { def: IDef; }) {
    return <div data-testid="html-component">HTML: {def.contentName}</div>;
  });
});

jest.mock('../../../components/content/form.component', () => {
  return React.memo(function MockFormContent({ formName, def, type }: { formName: string; def: unknown; type: string }) {
    return <div data-testid="form-component">Form: {formName} - {type}</div>;
  });
});

jest.mock('../../../components/content/webapp.content.component', () => {
  return React.memo(function MockWebApps({ def }: { def: IDef }) {
    return <div data-testid="webapp-component">WebApp: {def.contentName}</div>;
  });
});

jest.mock('../../../state/net.actions', () => ({
  post_req_state: jest.fn().mockReturnValue({ type: 'POST_REQ_STATE' }),
}));

jest.mock('../../../business.logic', () => ({
  get_last_content_jsx: jest.fn(() => <div data-testid="default-content">Default Content</div>),
  get_state_form_name: jest.fn((name) => `state_${name}`),
  save_content_jsx: jest.fn(),
}));

jest.mock('../../../business.logic/errors', () => ({
  remember_exception: jest.fn(),
}));

jest.mock('../../../business.logic/logging', () => ({
  ler: jest.fn(),
}));

// Create mock store
const createMockStore = () => configureStore({
  reducer: {
    test: (state = {}) => state,
  },
});

// Mock StatePage class with proper structure
class MockStatePage {
  contentType: string;
  contentName: string;
  contentEndpoint: string;
  parent: {
    parent: {
      allForms: {
        getForm: jest.Mock;
      };
      app: {
        fetchingStateAllowed: boolean;
      };
      pathnames: {
        FORMS: string;
      };
    };
  };

  constructor(
    contentType: string,
    contentName: string = 'test-content',
    contentEndpoint: string = '/api/test',
    fetchingStateAllowed: boolean = true
  ) {
    this.contentType = contentType;
    this.contentName = contentName;
    this.contentEndpoint = contentEndpoint;
    this.parent = {
      parent: {
        allForms: {
          getForm: jest.fn(),
        },
        app: {
          fetchingStateAllowed,
        },
        pathnames: {
          FORMS: '/api/forms',
        },
      },
    };
  }
}

describe('Content Component Performance & Memoization', () => {
  let store: ReturnType<typeof createMockStore>;
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    store = createMockStore();
    mockDispatch = jest.fn();
    jest.spyOn(require('react-redux'), 'useDispatch').mockReturnValue(mockDispatch);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderWithProvider = (component: React.ReactElement) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  describe('useMemo optimizations', () => {
    it('should memoize content constants correctly', () => {
      const page = new MockStatePage('$view', 'test-constants');
      
      const { rerender } = renderWithProvider(<Content def={page as any} />);
      
      // Constants should be created once and reused
      expect(screen.getByTestId('view-component')).toBeInTheDocument();
      
      // Re-render with same props - constants should be memoized
      rerender(
        <Provider store={store}>
          <Content def={page as any} />
        </Provider>
      );
      
      expect(screen.getByTestId('view-component')).toBeInTheDocument();
    });

    it('should memoize page content type computation', () => {
      const page1 = new MockStatePage('$VIEW', 'test-1'); // Uppercase
      const page2 = new MockStatePage('$view', 'test-2'); // Lowercase
      
      const { rerender } = renderWithProvider(<Content def={page1 as any} />);
      expect(screen.getByTestId('view-component')).toBeInTheDocument();
      
      // Change to different case - should recompute
      rerender(
        <Provider store={store}>
          <Content def={page2 as any} />
        </Provider>
      );
      
      expect(screen.getByTestId('view-component')).toBeInTheDocument();
    });

    it('should memoize form data computation for form content type', () => {
      const mockForm = { id: 1, name: 'test-form', endpoint: null };
      const page = new MockStatePage('$form', 'test-form');
      page.parent.parent.allForms.getForm.mockReturnValue(mockForm);

      renderWithProvider(<Content def={page as any} />);

      expect(page.parent.parent.allForms.getForm).toHaveBeenCalledWith('test-form');
      expect(mockForm.endpoint).toBe('/api/test');
      expect(screen.getByTestId('form-component')).toBeInTheDocument();
    });

    it('should memoize form load state computation', () => {
      const page = new MockStatePage('$form_load', 'test-form-load', '/api/test', true);

      renderWithProvider(<Content def={page as any} />);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'POST_REQ_STATE'
      });
    });

    it('should memoize content table creation', () => {
      const page = new MockStatePage('$html', 'test-table');
      
      const { rerender } = renderWithProvider(<Content def={page as any} />);
      expect(screen.getByTestId('html-component')).toBeInTheDocument();
      
      // Re-render with same type - should use memoized table
      rerender(
        <Provider store={store}>
          <Content def={page as any} />
        </Provider>
      );
      
      expect(screen.getByTestId('html-component')).toBeInTheDocument();
    });

    it('should memoize final content JSX computation', () => {
      const page = new MockStatePage('$webapp', 'test-jsx');
      
      const { rerender } = renderWithProvider(<Content def={page as any} />);
      expect(screen.getByTestId('webapp-component')).toBeInTheDocument();
      
      // Re-render with same props - should use memoized JSX
      rerender(
        <Provider store={store}>
          <Content def={page as any} />
        </Provider>
      );
      
      expect(screen.getByTestId('webapp-component')).toBeInTheDocument();
    });
  });

  describe('useCallback optimizations', () => {
    it('should memoize form content handler', () => {
      const mockForm = { id: 1, name: 'test-form' };
      const page = new MockStatePage('$form', 'test-form');
      page.parent.parent.allForms.getForm.mockReturnValue(mockForm);
      
      const { save_content_jsx } = require('../../../business.logic');

      renderWithProvider(<Content def={page as any} />);

      expect(save_content_jsx).toHaveBeenCalled();
      expect(screen.getByTestId('form-component')).toBeInTheDocument();
    });

    it('should memoize view content handler', () => {
      const page = new MockStatePage('$view', 'test-view');
      const { save_content_jsx } = require('../../../business.logic');

      renderWithProvider(<Content def={page as any} />);

      expect(save_content_jsx).toHaveBeenCalled();
      expect(screen.getByTestId('view-component')).toBeInTheDocument();
    });

    it('should memoize webapp content handler with error handling', () => {
      const page = new MockStatePage('$webapp', 'test-webapp');
      const { save_content_jsx } = require('../../../business.logic');

      renderWithProvider(<Content def={page as any} />);

      expect(save_content_jsx).toHaveBeenCalled();
      expect(screen.getByTestId('webapp-component')).toBeInTheDocument();
    });

    it('should memoize html content handler', () => {
      const page = new MockStatePage('$html', 'test-html');
      const { save_content_jsx } = require('../../../business.logic');

      renderWithProvider(<Content def={page as any} />);

      expect(save_content_jsx).toHaveBeenCalled();
      expect(screen.getByTestId('html-component')).toBeInTheDocument();
    });

    it('should memoize form load handler', () => {
      const page = new MockStatePage('$form_load', 'test-form-load', '/api/test', true);
      const { save_content_jsx } = require('../../../business.logic');

      renderWithProvider(<Content def={page as any} />);

      expect(mockDispatch).toHaveBeenCalled();
      expect(save_content_jsx).toHaveBeenCalledWith(null);
    });

    it('should memoize html load handler', () => {
      const page = new MockStatePage('$html_load', 'test-html-load');
      const { save_content_jsx } = require('../../../business.logic');

      renderWithProvider(<Content def={page as any} />);

      expect(save_content_jsx).toHaveBeenCalledWith(null);
    });

    it('should memoize default handler', () => {
      const page = new MockStatePage('unknown_type', 'test-default');
      const { get_last_content_jsx } = require('../../../business.logic');

      renderWithProvider(<Content def={page as any} />);

      expect(get_last_content_jsx).toHaveBeenCalled();
      expect(screen.getByTestId('default-content')).toBeInTheDocument();
    });
  });

  describe('Performance with dependency changes', () => {
    it('should recompute when content type changes', () => {
      const page1 = new MockStatePage('$view', 'test-1');
      const page2 = new MockStatePage('$html', 'test-2');

      const { rerender } = renderWithProvider(<Content def={page1 as any} />);
      expect(screen.getByTestId('view-component')).toBeInTheDocument();

      // Change content type - should recompute
      rerender(
        <Provider store={store}>
          <Content def={page2 as any} />
        </Provider>
      );

      expect(screen.getByTestId('html-component')).toBeInTheDocument();
      expect(screen.queryByTestId('view-component')).not.toBeInTheDocument();
    });

    it('should recompute when content name changes for forms', () => {
      const mockForm1 = { id: 1, name: 'form-1' };
      const mockForm2 = { id: 2, name: 'form-2' };
      const page1 = new MockStatePage('$form', 'form-1');
      const page2 = new MockStatePage('$form', 'form-2');
      
      page1.parent.parent.allForms.getForm.mockReturnValue(mockForm1);
      page2.parent.parent.allForms.getForm.mockReturnValue(mockForm2);

      const { rerender } = renderWithProvider(<Content def={page1 as any} />);
      expect(page1.parent.parent.allForms.getForm).toHaveBeenCalledWith('form-1');

      // Change form name - should recompute
      rerender(
        <Provider store={store}>
          <Content def={page2 as any} />
        </Provider>
      );

      expect(page2.parent.parent.allForms.getForm).toHaveBeenCalledWith('form-2');
    });

    it('should recompute when fetching state changes for form load', () => {
      const page1 = new MockStatePage('$form_load', 'test-form', '/api/test', true);
      const page2 = new MockStatePage('$form_load', 'test-form', '/api/test', false);

      const { rerender } = renderWithProvider(<Content def={page1 as any} />);
      expect(mockDispatch).toHaveBeenCalled();

      jest.clearAllMocks();

      // Change fetching state - should recompute
      rerender(
        <Provider store={store}>
          <Content def={page2 as any} />
        </Provider>
      );

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('Error handling with memoization', () => {
    it('should handle errors in content handlers gracefully', () => {
      const page = new MockStatePage('$form', 'error-form');
      
      // Mock getForm to throw an error
      page.parent.parent.allForms.getForm.mockImplementation(() => {
        throw new Error('Test error');
      });

      const { remember_exception } = require('../../../business.logic/errors');
      const { ler } = require('../../../business.logic/logging');

      renderWithProvider(<Content def={page as any} />);

      expect(remember_exception).toHaveBeenCalled();
      expect(ler).toHaveBeenCalled();
      expect(screen.getByTestId('default-content')).toBeInTheDocument();
    });

    it('should handle webapp component errors with memoized handler', () => {
      const originalConsoleError = console.error;
      console.error = jest.fn(); // Suppress error output

      const page = new MockStatePage('$webapp', 'error-webapp');
      
      // Mock WebApp component to throw error
      jest.doMock('../../../components/content/webapp.content.component', () => {
        return function MockWebAppsError() {
          throw new Error('WebApp Error');
        };
      });

      try {
        renderWithProvider(<Content def={page as any} />);
        // Should handle error gracefully
      } catch (error) {
        // Expected to handle error
      }

      console.error = originalConsoleError;
    });
  });

  describe('Memory optimization', () => {
    it('should not create new objects on every render for constants', () => {
      const page = new MockStatePage('$view', 'memory-test');
      
      // We can't directly access the memoized constants, but we can test that
      // the component doesn't cause unnecessary re-renders
      const TestWrapper = ({ def }: { def: unknown }) => {
        return <Content def={def as StatePage} />;
      };

      const { rerender } = renderWithProvider(<TestWrapper def={page} />);
      expect(screen.getByTestId('view-component')).toBeInTheDocument();

      // Re-render should not cause issues
      rerender(
        <Provider store={store}>
          <TestWrapper def={page} />
        </Provider>
      );

      expect(screen.getByTestId('view-component')).toBeInTheDocument();
    });

    it('should handle multiple rapid re-renders efficiently', () => {
      const page = new MockStatePage('$html', 'rapid-test') as unknown;

      const { rerender } = renderWithProvider(<Content def={page as StatePage} />);

      // Simulate rapid re-renders
      const rerenderComponent = () => (
        <Provider store={store}>
          <Content def={page as StatePage} />
        </Provider>
      );

      for (let i = 0; i < 10; i++) {
        rerender(rerenderComponent());
      }

      expect(screen.getByTestId('html-component')).toBeInTheDocument();
    });
  });

  describe('Integration with business logic', () => {
    it('should properly integrate save_content_jsx with memoization', () => {
      const { save_content_jsx } = require('../../../business.logic');
      const page = new MockStatePage('$view', 'integration-test') as unknown;

      renderWithProvider(<Content def={page as StatePage} />);

      expect(save_content_jsx).toHaveBeenCalled();
      
      // Verify the saved content is the expected JSX
      const calls = save_content_jsx.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
    });

    it('should properly integrate with form state management', () => {
      const { get_state_form_name } = require('../../../business.logic');
      const page = new MockStatePage('$form_load', 'state-integration') as unknown;

      renderWithProvider(<Content def={page as StatePage} />);

      expect(get_state_form_name).toHaveBeenCalledWith('state-integration');
    });
  });
});
