import { Fragment, useEffect, MouseEvent } from 'react';
import { useDispatch } from 'react-redux';
import JsonSelect from './state.jsx.select/default';
import StateJsxSelectNative from './state.jsx.select/native';
import StateJsxRadio from './state.jsx.radio';
import StateJsxSingleSwitch from './state.jsx.single.switch';
import StateJsxSwitch from './state.jsx.switch';
import StateJsxCheckboxes from './state.jsx.checkboxes';
import StateJsxTextfield from './state.jsx.textfield';
import JsonPicker from './state.jsx.picker';
import * as C from '../../../constants';
import { post_req_state } from '../../../state/net.actions';
import { ICheckboxesData, update_checkboxes } from './_items.common.logic';
import {
  BOOL_TRUEFALSE,
  BOOL_ONOFF,
  BOOL_YESNO,
} from '../../../constants';
import StateForm from '../../../controllers/StateForm';
import StateFormItem from '../../../controllers/StateFormItem';
import StateJsxFormItemGroup from '../state.jsx.form.item.group';
import StateFormItemSelect from '../../../controllers/templates/StateFormItemSelect';
import StateFormItemRadio from '../../../controllers/templates/StateFormItemRadio';
import { StateJsxIcon } from '../../state.jsx.icons';
import { AppDispatch, default_callback } from '../../../state';
import { formsDataClear } from '../../../slices/formsData.slice';
import StateFormItemGroup from '../../../controllers/StateFormItemGroup';
import IStateFormItemGroup from '../../../interfaces/IStateFormItemGroup';
import FormLabel from '@mui/material/FormLabel';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import set_all_default_values from './_items.default.values.common.logic';
import StateFormItemSwitch from '../../../controllers/templates/StateFormItemSwitch';
import StateFormItemInput from '../../../controllers/templates/StateFormItemInput';
import StateJsxPhoneInput from './state.jsx.phone.input';
import StateFormItemCheckbox from '../../../controllers/templates/StateFormItemCheckbox';
import { remember_exception } from '../../../business.logic/errors';
import {
  get_styled_div,
  StateJsxHtmlA,
  StateJsxHtml,
  StateJsxHtmlTag
} from './state.jsx.html';
import { get_bool_type } from '../_form.common.logic';
import StateJsxButton from './state.jsx.button';
import { log } from '../../../business.logic/logging';

interface IRecursiveFormBuilder {
  form: StateForm;
  items?: StateFormItem['items'];
  depth?: number;
}

interface IItemTable {
  [constant: string]: (
    item: StateFormItem,
    key: string | number
  ) => JSX.Element | JSX.Element[];
}

const itemsWithDefaultValues: StateFormItem[] = [];

const RecursiveFormItems = (props: IRecursiveFormBuilder) => {
  const form = props.form;
  const depth = props.depth ?? 0;
  const dispatch = useDispatch<AppDispatch>();

  /** Saves texfield value to the store */
  const onUpdateInputData = (form: StateForm) =>
    (input: StateFormItem) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
  dispatch({
    type: 'formsData/formsDataUpdate',
    payload: {
      formName: form.name,
      name: input.name,
      value: e.target.value
    }
  });

  /** Saves the form field value to the store. */
  const onUpdateFormData = (form: StateForm) =>
    (name: string) =>
    (e: any) =>
  dispatch({
    type: 'formsData/formsDataUpdate',
    payload: {
      formName: form.name,
      name,
      value: e.target.value
    }
  });

  /** Saves the date value to the store. */
  const onUpdateFormDatetime = (form: StateForm) => 
    (name: string) =>
    (date: Date) =>
  {
    dispatch({
      type: 'formsData/formsDataUpdate',
      payload: {
        formName: form.name,
        name,
        value: date.toLocaleString('en-US')
      }
    });
  }

  /** Saves checkboxes values to the Redux store. */
  const onHandleCheckbox = (form: StateForm) =>
    (name: string, data: ICheckboxesData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    data.value = e.target.name;
    data.checked = e.target.checked;
    update_checkboxes(data);
    dispatch({
      type: 'formsData/formsDataUpdate',
      payload: {
        formName: form.name,
        name,
        value: data.checkedValues
      }
    });
  }

  /** Save switches value to the Redux store. */
  const handleChangeSingleSwitch = (form: StateForm) =>
    (name: string, value: any) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const map: {[x: string]: () => void} = {
      [BOOL_TRUEFALSE]: () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: form.name,
          name,
          value: e.target.checked ? 'true' : 'false'
        }
      }),
      [BOOL_ONOFF]: () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: form.name,
          name,
          value: e.target.checked ? 'on' : 'off'
        }
      }),
      [BOOL_YESNO]: () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: form.name,
          name,
          value: e.target.checked ? 'yes' : 'no'
        }
      }),
      'DEFAULT': () => dispatch({
        type: 'formsData/formsDataUpdate',
        payload: {
          formName: form.name,
          name,
          value: e.target.checked
        }
      })
    }
    map[get_bool_type(value)]()
  }

  const handleChangeMultipleSwitches = (form: StateForm) =>
    (name: string, data: ICheckboxesData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    data.value = e.target.name;
    data.checked = e.target.checked;
    update_checkboxes(data);
    dispatch({
      type: 'formsData/formsDataUpdate',
      payload: {
        formName: form.name,
        name,
        value: data.checkedValues
      }
    });
  }

  /** A default form submission callback if none was provided */
  const onFormSubmitDefault = (form: StateForm) =>
    () =>
    (e: MouseEvent) =>
  {
    e.preventDefault();

    // if there are errors, do not submit the form
    const errors = form.parent.parent.formsDataErrors;
    if (errors.getCount(form.name) > 0) {
      return;
    }

    // if there are no errors, submit the form
    const formsData = form.parent.parent.formsData;
    const body = formsData.get(form.name);
    if (formsData.state[form.name] === undefined) {
      return;
    }
    if (body) {
      dispatch(post_req_state(form.endpoint, body));
      dispatch(formsDataClear(form.name));
    }
  }

  const textItem = (item: StateFormItem, key: string|number) => {
    item.onChange = onUpdateInputData(form);
    return <StateJsxTextfield key={`json-text-field${depth}-${key}`} def={item} />;
  }

  const dateTimePickerItem = (item: StateFormItem, key: string|number) => {
    item.onChange = onUpdateFormDatetime(form);
    return <JsonPicker key={`datetime-picker${depth}-${key}`} def={item} />;
  }

  const groupItem = (def: StateFormItem, key: string|number) => {
    const groupItemDef = new StateFormItemGroup(
      def.state as IStateFormItemGroup,
      def.parent
    );
    return (
      <StateJsxFormItemGroup key={`group${depth}-${key}`} def={groupItemDef}>
        <RecursiveFormItems
          key={`group-recursion${depth}-${key}`}
          form={form}
          items={groupItemDef.items}
          depth={depth + 1}
        />
      </StateJsxFormItemGroup>
    );
  }

  const itemsTable: IItemTable = {
    [C.HTML]: (item: StateFormItem, key: string|number) => (
      <StateJsxHtml key={`html${depth}-${key}`} def={item} />
    ),
    [C.HTML_TAG]: (item: StateFormItem, key: string|number) => (
      <StateJsxHtmlTag key={`html-tag${depth}-${key}`} def={item} />
    ),
    [C.A]: (item: StateFormItem, key: string|number) => {
      item.onClick = item.hasNoOnClickCallback
        ? default_callback
        : item.onClick
      return <StateJsxHtmlA def={item} key={`a${depth}-${key}`} />;
    },
    [C.SUBMIT]: (item: StateFormItem, key: string|number) => {
      item.onClick = item.hasNoOnClickCallback
        ? onFormSubmitDefault(form)
        : item.onClick
        return <StateJsxButton key={`submit${depth}-${key}`} def={item} />;
    },
    [C.STATE_BUTTON]: (item: StateFormItem, key: string|number) => (
      <StateJsxButton key={`json-button${depth}-${key}`} def={item} />
    ),
    [C.BREAK_LINE]: (_item: StateFormItem, key: string|number) => (
      <br key={`break-line${depth}-${key}`} />
    ),
    [C.HORIZONTAL_LINE]: (_item: StateFormItem, key: string|number) => (
      <hr key={`horizontal-line${depth}-${key}`} />
    ),
    [C.STATE_SELECT]: (item: StateFormItem, key: string|number) => {
      const jsonSelectDef = new StateFormItemSelect(item.state, item.parent);
      jsonSelectDef.onChange = onUpdateFormData(form);
      return (
        <JsonSelect
          key={`json-select${depth}-${key}`}
          def={jsonSelectDef}
        />
      );
    },
    [C.STATE_SELECT_NATIVE]: (item: StateFormItem, key: string|number) => {
      const jsonSelectDef = new StateFormItemSelect(item.state, item.parent);
      jsonSelectDef.onChange = onUpdateFormData(form);
      return (
        <StateJsxSelectNative
          key={`json-select${depth}-${key}`}
          def={jsonSelectDef}
        />
      );
    },
    [C.TEXT]: textItem,
    [C.NUMBER]: textItem,
    [C.PASSWORD]: textItem,
    [C.TEXTFIELD]: textItem,
    [C.TEXTAREA]: textItem,
    [C.PHONE_INPUT]: (def: StateFormItem, key: string|number) => {
      const inputDef = new StateFormItemInput(def.state, def.parent);
      inputDef.onChange = onUpdateFormData(form);
      return (
        <StateJsxPhoneInput
          def={inputDef}
          key={`phone${depth}-${key}`}
        />
      );
    },
    [C.RADIO_BUTTONS]: (item: StateFormItem, key: string|number) => {
      const radioDef = new StateFormItemRadio(item.state, item.parent);
      radioDef.onChange = onUpdateFormData(form);
      return (
        <StateJsxRadio
          key={`radio-button${depth}-${key}`}
          def={radioDef}
        />
      );
    },
    [C.CHECKBOXES]: (item: StateFormItem, key: string|number) => {
      const checkboxesDef = new StateFormItemCheckbox(item.state, item.parent);
      checkboxesDef.onChange = onHandleCheckbox(form);
      return (
        <StateJsxCheckboxes
          key={`json-checkboxes${depth}-${key}`}
          def={checkboxesDef}
        />
      );
    },
    [C.SWITCH]: (item: StateFormItem, key: string|number) => {
      const switchDef = new StateFormItemSwitch(item.state, item.parent);
      switchDef.onChange = handleChangeMultipleSwitches(form);
      return <StateJsxSwitch key={`switch${depth}-${key}`} def={switchDef} />;
    },
    [C.SINGLE_SWITCH]: (item: StateFormItem, key: string|number) => {
      const switchDef = new StateFormItemSwitch(item.state, item.parent);
      switchDef.onChange = handleChangeSingleSwitch(form);
      return (
        <StateJsxSingleSwitch
          key={`switch${depth}-${key}`}
          def={switchDef}
        />
      );
    },
    [C.DESKTOP_DATE_TIME_PICKER]: dateTimePickerItem,
    [C.MOBILE_DATE_TIME_PICKER]: dateTimePickerItem,
    [C.TIME_PICKER]: dateTimePickerItem,
    [C.DATE_TIME_PICKER]: dateTimePickerItem,
    [C.BOX]: groupItem,
    [C.STACK]: groupItem,
    [C.LOCALIZED]: groupItem,
    [C.FORM_GROUP]: groupItem,
    [C.FORM_CONTROL]: groupItem,
    [C.FORM_CONTROL_LABEL]: groupItem,
    [C.INDETERMINATE]: groupItem,
    [C.FORM_LABEL]: (item: StateFormItem, key: string|number) => (
      <FormLabel
        {...item.props}
        key={`form-label${depth}-${key}`}
      >
        { item.text }
      </FormLabel>
    ),
    [C.FORM_HELPER_TEXT]: (item: StateFormItem, key: string|number) => (
      <FormHelperText
        key={`form-helper-text${depth}-${key}`}
      >
        { item.text }
      </FormHelperText>
    ),
    [C.INPUT_LABEL]: (item: StateFormItem, key: string|number) => (
      <InputLabel
        key={`input-label${depth}-${key}`}
      >
        { item.text }
      </InputLabel>
    ),
    [C.ICON]: (item: StateFormItem, key: string|number) => (
      <StateJsxIcon key={`icon${depth}-${key}`} def={item.has} />
    ),
    [C.DIV]: (item: StateFormItem, key: string|number) => {
      const StyledDiv = get_styled_div();
      return (
        <StyledDiv key={`div${depth}-${key}`} {...item.props}>
          <RecursiveFormItems
            key={`div-recursion${depth}-${key}`}
            form={form}
            items={item.items}
            depth={depth + 1}
          />
        </StyledDiv>
      );
    },
    [C.BAD_FORM_ITEM]: (item: StateFormItem, key: string|number) => (
      <div key={key}>BAD FORM ITEM {item.name}</div>
    )
  }

  return (
    <Fragment>
      {(props.items || form.items).map((item, i) => {
        try {
          item.has.defaultValue && itemsWithDefaultValues.push(item);
          return itemsTable[item.type.toLowerCase()](item, i);
        } catch (e: any) {
          const message = `Form item type (${item.type}) does not exist.`;
          remember_exception(e);
          log(message);
          return (
            <div key={`bad-field${depth}-${i}`}>
              ❌ BAD FIELD <em>"{item.type}"</em>
            </div>
          );
        }
      })}
    </Fragment>
  )
}

export default function FormItems ({ def: form }:{ def: StateForm }) {
  const dispatch = useDispatch<AppDispatch>();
 
  useEffect(() => {
    set_all_default_values(itemsWithDefaultValues)
  }, [ dispatch ]);

  return <RecursiveFormItems form={form} />;
}
