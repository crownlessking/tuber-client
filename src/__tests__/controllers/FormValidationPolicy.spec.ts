import FormValidatationPolicy from '../../controllers/FormValidationPolicy';
import IStateForm from '../../interfaces/IStateForm';
import { formsAdd, formsRemove } from '../../slices/forms.slice';
import { redux } from '../../state';

describe('FormValidationPolicy', () => {
  const formName = 'testForm';
  let policy: FormValidatationPolicy;

  beforeAll(() => {
    redux.store.dispatch(formsAdd({
      name: formName,
      form: {
        items: [
          {
            type: 'text',
            name: 'name',
            label: 'Name',
            has: {
              required: true,
              requiredMessage: 'The name is required.'
            }
          }
        ],
      } as IStateForm
    }));
    policy = new FormValidatationPolicy(redux, formName);
  });

  afterAll(() => {
    redux.store.dispatch(formsRemove(formName));
  });

  it('should initialize form validation policy', () => {
    policy.emit('name', 'Name is required.');
    expect(policy).toBeDefined();
    expect(policy.e).toBeDefined();
  });

  it('should emit error message', () => {
    policy.emit('name', 'Name is required.');
    expect(policy.e.getMessage('name')).toBe('Name is required.');
  });

  it('should mute error message', () => {
    policy.mute('name');
    expect(policy.e).toBeDefined();
  });

  it('should get filtered form data', () => {
    const formData = policy.getFilteredData();
    expect(formData).toBeDefined();
  });

  it('should get form data', () => {
    const formData = policy.getFormData();
    expect(formData).toBeDefined();
  });
});
