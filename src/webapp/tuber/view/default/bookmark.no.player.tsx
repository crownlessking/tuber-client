import Grid from '@mui/material/Grid';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import { IBookmark } from '../../tuber.interfaces';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { get_platform_icon_src, shorten_text } from '../../_tuber.common.logic';
import React, { Fragment, useCallback, useMemo } from 'react';
import { SHORTENED_NOTE_MAX_LENGTH } from '../../tuber.config';
import BookmarkActionsToolbar from './list.actions';
import Thumbnail from './thumbnail';

interface IBookmarkProps {
  children: IBookmark;
  handleOnClick: (
    bookmark: IBookmark,
    playerOpen?: boolean
  ) => (e: React.MouseEvent) => void;
  handleExpandDetailIconOnClick: (annotation: IBookmark, i: number)
    => (e: React.MouseEvent)
    => void;
  index: number;
  playerOpen?: boolean;
}

const StyledListItem = styled(ListItem)(({ theme: { spacing } }) => ({
  float: 'left',
  marginBottom: spacing(4),
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
}));

const StackGrid = styled(Grid)(() => ({
  position: 'relative',
}));

const TitleWrapper = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'flex-start'
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

const TitleText = styled('span')(() => ({
  fontSize: 20,
  fontWeight: 400,
  wordBreak: 'break-word'
}));

const PlatformIcon = styled('img')(() => ({
  width: '1.5rem',
  height: '1.5rem',
  margin: '0.25rem 0.5rem 0 0'
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

// Optimized BookmarkNoPlayer component with React.memo for performance
const BookmarkNoPlayer = React.memo<IBookmarkProps>(({ children: bookmark, index: i, playerOpen, handleOnClick, handleExpandDetailIconOnClick }) => {
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
    handleOnClick(bookmark, playerOpen)(e);
  }, [handleOnClick, bookmark, playerOpen]);
  
  const handleExpandClick = useCallback((e: React.MouseEvent) => {
    handleExpandDetailIconOnClick(bookmark, i)(e);
  }, [handleExpandDetailIconOnClick, bookmark, i]);

  return (
    <StyledListItem key={`bookmark[${i}]`} disablePadding>
      <Thumbnail i={i} bookmark={bookmark} />
      <StackGrid container direction='column'>
        <Grid container direction='row'>
          <TitleWrapper>
            <PlatformIcon src={platformIconSrc} />
            <Title href='#' onClick={handleBookmarkClick}>
              <TitleText>{bookmark.title}</TitleText>
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
      </StackGrid>
    </StyledListItem>
  );
});

// Set display name for debugging
BookmarkNoPlayer.displayName = 'BookmarkNoPlayer';

export default BookmarkNoPlayer;