import List from '@mui/material/List';
import { styled } from '@mui/material/styles';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/state';
import { gen_video_url } from '../../_tuber.common.logic';
import LoadMoreBookmarksFromServer, {
  LoadEarlierBookmarksFromServer
} from './list.load.more';
import { IBookmark, ITTBList } from '../../tuber.interfaces';
import StateData from 'src/controllers/StateData';
import BookmarkWithThumbnail from './bookmark.with.thumbnail';

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

export default function TuberThumbnailedBookmarkList(props: ITTBList) {
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

  // Memoized click handler for the BookmarkWithThumbnail component
  const handleOnClick = useCallback((bookmark: IBookmark) => (e: React.MouseEvent) => {
    e.preventDefault();
    handleBookmarkClick(bookmark);
  }, [handleBookmarkClick]);

  return (
    <BookmarkListWrapper>
      <LoadEarlierBookmarksFromServer def={data} />
      <StyledList>
        {bookmarks.map((bookmark, i) => (
          <BookmarkWithThumbnail
            key={`bookmark-${i}-${bookmark.id || bookmark.url}`}
            handleOnClick={handleOnClick}
            index={i}
          >
            {bookmark}
          </BookmarkWithThumbnail>
        ))}
      </StyledList>
      <LoadMoreBookmarksFromServer def={data} />
    </BookmarkListWrapper>
  );
}
