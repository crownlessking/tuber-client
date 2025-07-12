import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import React, { Fragment, useCallback, useMemo } from 'react';
import { SHORTENED_NOTE_MAX_LENGTH } from '../../tuber.config';
import { IBookmark } from '../../tuber.interfaces';
import { get_platform_icon_src, shorten_text } from '../../_tuber.common.logic';
import BookmarkActionsToolbar from './list.actions';

interface IBookmarkProps {
  children: IBookmark;
  handleOnClick: (bookmark: IBookmark) => (e: React.MouseEvent) => void;
  handleExpandDetailIconOnClick: (annotation: IBookmark, i: number)
    => (e: React.MouseEvent)
    => void;
  index: number;
}

const StyledListItem = styled(ListItem)(() => ({
  float: 'left'
}));

const NoteGrid = styled(Grid)(() => ({
  display: 'flex'
}));

const NoteWrapper = styled('div')(() => ({
  position: 'relative',
  flex: 1
}));

const Note = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(3),
  // maxWidth: theme.spacing(50),
}));

const TitleWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',
}));

const Title = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  fontSize: '1.13rem',
  color: theme.palette.primary.main,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    textDecoration: 'underline',
    cursor: 'pointer'
  }
}));

const PlatformIcon = styled('img')(() => ({
  width: '1.5rem',
  height: '1.5rem',
  margin: '0.25rem 0.5rem 0 0',
  // position: 'absolute',
  // top: 0,
}));

const ExpandNoteIconWrapper = styled('a')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'absolute',
  left: 0,
  top: 0,
  textDecoration: 'none',
  color: theme.palette.grey[500],
}));

const ExpandNoteIcon = styled(PlayArrowIcon)(() => ({
  width: '1.5rem',
  height: '1.5rem',
}));

// Optimized Bookmark component with React.memo for performance
const Bookmark = React.memo<IBookmarkProps>(({ children: bookmark, index: i, handleOnClick, handleExpandDetailIconOnClick }) => {
  // Memoize platform icon source
  const platformIconSrc = useMemo(() => get_platform_icon_src(bookmark.platform), [bookmark.platform]);
  
  // Memoize shortened note text
  const shortenedNote = useMemo(() => shorten_text(bookmark.note), [bookmark.note]);
  
  // Memoize whether note should show expand button
  const shouldShowExpandButton = useMemo(() => 
    bookmark.note && bookmark.note.length > SHORTENED_NOTE_MAX_LENGTH, 
    [bookmark.note]
  );
  
  // Memoized click handlers
  const handleBookmarkClick = useCallback((e: React.MouseEvent) => {
    handleOnClick(bookmark)(e);
  }, [handleOnClick, bookmark]);
  
  const handleExpandClick = useCallback((e: React.MouseEvent) => {
    handleExpandDetailIconOnClick(bookmark, i)(e);
  }, [handleExpandDetailIconOnClick, bookmark, i]);

  return (
    <StyledListItem disablePadding>
      <Stack sx={{ position: 'relative' }}>
        <Grid container direction='column'>
          <TitleWrapper>
            <PlatformIcon src={platformIconSrc} />
            <Title href='#' onClick={handleBookmarkClick}>
              <ListItemText primary={bookmark.title} />
            </Title>
          </TitleWrapper>
        </Grid>
        {bookmark.note ? (
          <Fragment>
            <NoteGrid container direction='row'>
              <NoteWrapper>
                {shouldShowExpandButton && (
                  <ExpandNoteIconWrapper
                    href='#'
                    onClick={handleExpandClick}
                  >
                    <ExpandNoteIcon aria-label='expand row' />
                  </ExpandNoteIconWrapper>
                )}
                <Note>{shortenedNote}</Note>
              </NoteWrapper>
            </NoteGrid>
            <BookmarkActionsToolbar i={i} bookmark={bookmark} />
          </Fragment>
        ) : (
          <BookmarkActionsToolbar i={i} bookmark={bookmark} />
        )}
      </Stack>
    </StyledListItem>
  );
});

// Set display name for debugging
Bookmark.displayName = 'Bookmark';

export default Bookmark;