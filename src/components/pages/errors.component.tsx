import { useState } from 'react';
import {
  CardContent, Grid, IconButton, InputAdornment, Paper, Toolbar, 
  Typography
} from '@mui/material';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { styled } from '@mui/material/styles';
import { Fragment } from 'react';
import JsonapiError from '../../controllers/jsonapi.error';
import StatePage from '../../controllers/StatePage';
import { IJsonapiError } from '../../interfaces/IJsonapi';
import {
  color_json_code,
  format_json_code,
  get_errors_list
} from '../../business.logic/errors';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

interface IPageErrorsProps {
  def: StatePage;
}

type TSetLastSelected = <T>($class: T) => void;

interface IHive {
  selected_id?: string;
  filter?: string;
  setSelected?: TSetLastSelected;
  setState?: (state: string) => void;
}

interface IErrorListItemProp {
  errorState: IJsonapiError;
  /** data shared between detail & error components */
  hive: IHive;
}

const styles = {
  errorCardHover: {
    '&:hover': {
      backgroundColor: '#f0f8ff',
      cursor: 'pointer'
    },
  },
  errorCardClicked: {
    '&:hover': {
      backgroundColor: '#f0f8ff',
      cursor: 'pointer'
    },
    backgroundColor: '#d7ecff !important'
  }
};

type TClasses = keyof typeof styles;

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 20,
  border: `2px solid ${theme.palette.grey[300]}`,
  backgroundColor: theme.palette.grey[300],
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
  flexGrow: 1,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const ErrorList = styled('div')(() => ({
  flexGrow: 1,
  overflowY: 'scroll',
  height: 'calc(100vh - 107px)',
}));

const ErrorJsonWrapper = styled('div')(() => ({
  position: 'relative',
  fontFamily: 'monospace',
  fontWeight: 'bold',
  overflowWrap: 'anywhere',
}));

/** Highlight all occurence of a substring into a value */
const highlight = (str: string, regex: string) => {
  const regularExp = new RegExp(regex, 'g');
  return str.replace(
    regularExp,
    match => `<span style="background-color: yellow">${match}</span>`
  );
};

/** Same as the highlight function but returns a JSX.Element. */
const Highlight = ({
  value,
  regex
}: { value: string, regex: string }): JSX.Element => {
  const regularExp = new RegExp(regex, 'g');
  return <span dangerouslySetInnerHTML={{
    __html: value.replace(
      regularExp,
      match => `<span style="background-color: yellow">${match}</span>`
    )
  }} />;
};

/** Highlight all matches found as substring into json. */
const jsonWithMatches = (state: string, filters: string[]): string => {
  let highlightedState = state;
  filters.forEach(filter => {
    highlightedState = highlight(highlightedState, filter);
  })
  return highlightedState;
};

/** Highlight all matches found as substring in code. */
const CodeWithMatches = ({
  code,
  matches
}: { code: string, matches: string[] }): JSX.Element => {
  return <Highlight value={code} regex={matches.join('|')} />;
};

const IdWithMatches = ({
  id,
  matches
}: { id: string, matches: string[] }) => {
  return <Highlight value={id} regex={matches.join('|')} />;
};

const TitleWithMatches = ({
  title,
  matches
}: { title: string, matches: string[] }) => {
  return (
    <Typography variant='subtitle2' component='div'>
      <Highlight value={title} regex={matches.join('|')} />
    </Typography>
  );
};

/** List of errors in the left column. */
function ErrorListItem({ errorState: errorJson, hive }: IErrorListItemProp): JSX.Element | null {
  const error = new JsonapiError(errorJson);
  const [ $class, setClass ] = useState<TClasses>('errorCardHover');

  const onPaperClick = () => {
    if (error.id !== hive.selected_id) {
      hive.setSelected && hive.setSelected<TClasses>('errorCardHover');
      setClass('errorCardClicked');
      if (hive.filter) {
        // const highlightedJson = color_json_code(error.json)
        const jsonStr = format_json_code(error.json);
        const json = jsonWithMatches(jsonStr, hive.filter.split(/\s+/));
        hive.setState && hive.setState(json);
      } else {
        const json = color_json_code(error.json);
        hive.setState && hive.setState(json);
      }
      hive.selected_id = error.id;
      hive.setSelected = setClass as TSetLastSelected;
    }
  };

  if (hive.filter) {
    const filterWords = hive.filter?.split(' ') || [];
    const json = JSON.stringify(error.json);
    const jsonMatches = filterWords.filter(w => json.includes(w));
    if (jsonMatches.length === 0) {
      return ( null );
    }
    const idMatches = filterWords.filter(w => error.id.includes(w));
    const codeMatches = filterWords.filter(w => error.code.includes(w));
    const titleMatches = filterWords.filter(w => error.title.includes(w));

    return (
      <Paper square sx={styles[$class]} onClick={onPaperClick}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
            <IdWithMatches id={error.id} matches={idMatches} />
            :
            <CodeWithMatches code={error.code} matches={codeMatches} />
          </Typography>
          <TitleWithMatches title={error.title} matches={titleMatches} />
        </CardContent>
      </Paper>
    );
  }

  return (
    <Paper square sx={styles[$class]} onClick={onPaperClick}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color='text.secondary' gutterBottom>
          {error.id}:{error.code}
        </Typography>
        <Typography variant='subtitle2' component='div'>{error.title}</Typography>
      </CardContent>
    </Paper>
  );
}

function ErrorBody({ hive }: { hive: IHive }): JSX.Element | null {
  const [ json, setJson ] = useState<string>('');
  hive.setState = setJson;
  return json ? (
    <Grid
      xs={true}
      sx={{
        height: '100vh', // 'calc(100vh - 64px)'
        p: 2,
      }}
      item
    >
      <Toolbar />
      <ErrorJsonWrapper
        dangerouslySetInnerHTML={{
          __html: json
        }}
      />
    </Grid>
  ) : ( null );
}

/** Error page */
export default function PageErrors({ def: page }: IPageErrorsProps) {
  const errors = get_errors_list();
  const [ filter, setFilter ] = useState<string>('');

  let i = 0;
  while (i < errors.length) {
    errors[i].id = ''+i;
    i++;
  }

  const handleSearchChange = (e: any) => {
    setFilter(e.target.value);
    hive.setSelected && hive.setSelected<TClasses>('errorCardHover');
    hive.setState && hive.setState('');
  };

  const handleClearFilter = () => {
    setFilter('');
    hive.setSelected && hive.setSelected<TClasses>('errorCardHover');
    hive.setState && hive.setState('');
  };

  const hive: IHive = { filter };

  return (
    <Fragment>
      <Grid container spacing={0}>
        <Grid md={3} sx={{ pl: 1 }} item>
          <Toolbar />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Filter..."
              inputProps={{ 'aria-label': 'filter' }}
              fullWidth
              value={filter}
              onChange={handleSearchChange}
              endAdornment={
                <InputAdornment position="end">
                  {filter ?
                    <IconButton
                      aria-label="clear"
                      size="small"
                      sx={{ mr: 1 }}
                      onClick={handleClearFilter}
                    >
                      <ClearOutlinedIcon color='error' />
                    </IconButton> : ( null )
                  }
                </InputAdornment>
              }
            />
          </Search>
          <ErrorList>
            {errors.slice(0).reverse().map((e, i) => (
              <ErrorListItem key={`e-${i}`} errorState={e} hive={hive} />
            ))}
          </ErrorList>
        </Grid>
        <ErrorBody hive={hive} />
      </Grid>
    </Fragment>
  );
}
