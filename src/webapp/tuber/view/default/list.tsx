import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/state';
import { gen_video_url, shorten_text } from '../../_tuber.common.logic';
import LoadMoreBookmarksFromServer, {
  LoadEarlierBookmarksFromServer
} from './list.load.more';
import { IBookmark, ITBList } from '../../tuber.interfaces';
import StateData from 'src/controllers/StateData';
import Bookmark from './bookmark';

const BookmarkListWrapper = styled('div')(({ theme }) => ({
  height: 'calc(100vh - 64px)',
  overflowY: 'auto',
  [theme.breakpoints.up('md')]: {
    width: 500,
  },
  width: '100%',
}));

const StyledList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(1),
}));

// Optimized bookmark item component
// const BookmarkItem = React.memo<{
//   bookmark: IBookmark;
//   index: number;
//   onBookmarkClick: (bookmark: IBookmark) => void;
//   expandedNotes: Set<number>;
//   onToggleExpand: (index: number) => void;
// }>(({ bookmark, index, onBookmarkClick, expandedNotes, onToggleExpand }) => {
//   const isExpanded = expandedNotes.has(index);
  
//   const handleClick = useCallback((e: React.MouseEvent) => {
//     e.preventDefault();
//     onBookmarkClick(bookmark);
//   }, [bookmark, onBookmarkClick]);

//   const handleExpandClick = useCallback((e: React.MouseEvent) => {
//     e.preventDefault();
//     onToggleExpand(index);
//   }, [index, onToggleExpand]);

//   return (
//     <Bookmark
//       handleOnClick={() => handleClick}
//       handleExpandDetailIconOnClick={() => handleExpandClick}
//       index={index}
//       isExpanded={isExpanded}
//     >
//       {bookmark}
//     </Bookmark>
//   );
// });

export default function TuberBookmarkList(props: ITBList) {
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
  const handleBookmarkClick = useCallback((bookmark: IBookmark) => {
    if (playerOpen) {
      setBookmarkToPlay(bookmark);
      setPlayerOpen(true);
    } else {
      const url = bookmark.url || gen_video_url(bookmark);
      window.open(url, '_blank')?.focus();
    }
  }, [playerOpen, setBookmarkToPlay, setPlayerOpen]);

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
  const handleOnClick = useCallback((bookmark: IBookmark) => (e: React.MouseEvent) => {
    e.preventDefault();
    handleBookmarkClick(bookmark);
  }, [handleBookmarkClick]);

  const handleExpandDetailIconOnClick = useCallback((
    annotation: IBookmark,
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
    
    const text = isExpanded 
      ? (annotation.note ?? '(No note)')
      : shorten_text(annotation.note);
    detail.appendChild(document.createTextNode(text));
  }, [expandedNotes, handleToggleExpand]);

  return (
    <BookmarkListWrapper>
      <LoadEarlierBookmarksFromServer def={data} />
      <StyledList>
        {bookmarks.map((bookmark, i) => (
          <Bookmark
            key={`bookmark-${i}-${bookmark.id || bookmark.url}`}
            handleOnClick={handleOnClick}
            handleExpandDetailIconOnClick={handleExpandDetailIconOnClick}
            index={i}
          >
            {bookmark}
          </Bookmark>
        ))}
      </StyledList>
      <LoadMoreBookmarksFromServer def={data} />
    </BookmarkListWrapper>
  );
}
