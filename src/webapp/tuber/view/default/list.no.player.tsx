import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import List from '@mui/material/List';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import StateData from 'src/controllers/StateData';
import { RootState } from 'src/state';
import { gen_video_url, shorten_text } from '../../_tuber.common.logic';
import { IBookmark, ITTBList } from '../../tuber.interfaces';
import LoadMoreBookmarksFromServer, {
  LoadEarlierBookmarksFromServer
} from './list.load.more';
import Bookmark from './bookmark.no.player';

const StyledList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

export default function TuberBookmarkSearchWithThumbnails(props: ITTBList) {
  const { setBookmarkToPlay, playerOpen, setPlayerOpen } = props.props;
  
  // Memoize state selectors
  const dataState = useSelector((state: RootState) => state.data);
  const data = useMemo(() => new StateData(dataState), [dataState]);
  
  // Memoize bookmark collection
  const bookmarks = useMemo(() => {
    return data.configure({ endpoint: 'bookmarks' })
      .collection()
      .get<IBookmark>();
  }, [data]);

  // State for expanded notes (replaces global array)
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());

  // Memoized bookmark click handler
  const handleBookmarkClick = useCallback((bookmark: IBookmark, playerOpenParam?: boolean) => {
    if (playerOpenParam) {
      setBookmarkToPlay(bookmark);
      setPlayerOpen(true);
    } else {
      const url = bookmark.url || gen_video_url(bookmark);
      window.open(url, '_blank')?.focus();
    }
  }, [setBookmarkToPlay, setPlayerOpen]);

  // Memoized expand toggle handler
  const handleToggleExpand = useCallback((index: number) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  }, []);

  // Legacy handlers for existing Bookmark component
  const handleOnClick = useCallback((
    bookmark: IBookmark,
    playerOpenParam?: boolean
  ) => (e: React.MouseEvent) => {
    e.preventDefault();
    handleBookmarkClick(bookmark, playerOpenParam);
  }, [handleBookmarkClick]);

  const handleExpandDetailIconOnClick = useCallback((
    bookmark: IBookmark,
    i: number
  ) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = e.currentTarget as HTMLAnchorElement;
    const icon = element.children.item(0) as HTMLOrSVGImageElement;
    
    // Toggle expanded state
    handleToggleExpand(i);
    const isExpanded = !expandedNotes.has(i);
    
    // Animate icon
    icon.style.transition = 'all 0.4s ease';
    icon.style.transform = isExpanded ? 'rotateZ(90deg)' : 'rotateZ(0deg)';
    
    // Update text content
    const detail = element.parentElement?.children.item(1) as HTMLDivElement;
    while (detail.firstChild) {
      detail.removeChild(detail.firstChild);
    }
    
    if (isExpanded) {
      // Insert the full note into the detail div
      const note = bookmark.note ? bookmark.note.replace('\n', '<br>') : '(No note)';
      detail.innerHTML = note;
    } else {
      // Insert the shortened note into the detail div using text node
      detail.appendChild(document.createTextNode(shorten_text(bookmark.note)));
    }
  }, [expandedNotes, handleToggleExpand]);

  return (
    <Container maxWidth='lg'>
      <LoadEarlierBookmarksFromServer def={data} />
      <StyledList>
        {bookmarks.map((bookmark, i) => (
          <Bookmark
            key={`bookmark-${i}-${bookmark.id || bookmark.url}`}
            handleOnClick={handleOnClick}
            handleExpandDetailIconOnClick={handleExpandDetailIconOnClick}
            index={i}
            playerOpen={playerOpen}
          >
            {bookmark}
          </Bookmark>
        ))}
      </StyledList>
      <LoadMoreBookmarksFromServer def={data} />
    </Container>
  );
}
