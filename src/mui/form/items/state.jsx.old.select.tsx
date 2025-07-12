import { get_field_value } from './_items.common.logic'
import { RootState } from '../../../state'
import { useSelector } from 'react-redux'
import StateFormItemSelect from '../../../controllers/templates/StateFormItemSelect'
import { set_default_value } from './_items.default.values.common.logic'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import TextField from '@mui/material/TextField'
import { NAME_NOT_SET } from '../../../constants'

interface IJsonSelectProps {
  def: StateFormItemSelect
}

export default function StateJsxSelect ({ def: select }: IJsonSelectProps) {
  const { name, onChange: handleChange } = select
  set_default_value(select, select.parent.name)
  const formsData = useSelector<RootState>(state => state.formsData)

  const getValue = () => {
    return get_field_value(formsData, select.parent.name, select.name)
  }

  return name ? (
    <FormControl {...select.formControlProps}>
      <InputLabel {...select.inputLabelProps}>
        { select.text }
      </InputLabel>
      <Select
        {...select.props}
        value={getValue()}
        onChange={handleChange(name)}
      >
        <MenuItem value=''></MenuItem>
        {select.has.items.map((item, i) => (
          <MenuItem value={item.value} key={`select-menu-item${i}`}>
            { item.title || item.value }
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{ select.has.helperText }</FormHelperText>
    </FormControl>
  ) : (
    <TextField value={`SELECT ${NAME_NOT_SET}`} disabled />
  )
}
