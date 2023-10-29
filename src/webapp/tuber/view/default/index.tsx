import '../tuber.css'
import { Fragment, useState, useLayoutEffect } from 'react'
import StatePage from '../../../../controllers/StatePage'
import { IBookmark, IResearchToolbarProps } from '../../tuber.interfaces'
import TuberBookmarkList from './tuber.bookmark.list'
import TuberPlayer from './tuber.player'
import tuber_register_callbacks from '../../callbacks/tuber.callbacks'
import { styled, useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Toolbar from '@mui/material/Toolbar'
import ResearchToolbar from '../tuber.toolbar.video'
import TuberBookmarkSearchEngine from './tuber.bookmark.search.engine'
import { dialog_new_youtube_bookmark_from_video } from '../../callbacks/prod.bookmarks.youtube'
import { useMediaQuery } from '@mui/material'

tuber_register_callbacks()

const TuberPlayerWrapper = styled('div')(({ theme }) => ({
  flexGrow: 1,
  [theme.breakpoints.up('md')]: {
    paddingRight: theme.spacing(2),
  },
  height: 'calc(100vh - 128px)',
  top: 64,
  right: 0,
}))

export default function ViewDefault({ def: page }: { def: StatePage}) {
  const [ playerOpen, setPlayerOpen ] = useState<boolean>(false)
  const [ bookmarkToPlay, setBookmarkToPlay ] = useState<IBookmark>()
  const theme = useTheme()
  const greaterThanMid = useMediaQuery(theme.breakpoints.up('md'))

  const toolbarProps: IResearchToolbarProps = {
    togglePlayerCallback: () => () => {
      if (greaterThanMid) {
        setPlayerOpen(!playerOpen)
      } else {
        setPlayerOpen(false)
      }
    },
    /** Creates a new bookmark @deprecated */
    bookmarkAddCallback: dialog_new_youtube_bookmark_from_video,
    // appbar definition
    def: page.appBar
  }

  // Closes the integrated player if window size too small.
  useLayoutEffect(() => {
    const updateLayout = () => {
      if (!greaterThanMid) {
        setPlayerOpen(false)
      }
    }
    window.addEventListener('resize', updateLayout)
    updateLayout()
    return () => window.removeEventListener('resize', updateLayout)
  })

  return (
    <Fragment>
      <Toolbar />
        {playerOpen ? (
          <Grid container direction='row'>
            <TuberBookmarkList
              playerOpen={playerOpen}
              setPlayerOpen={setPlayerOpen}
              setBookmarkToPlay={setBookmarkToPlay}
            />
            <TuberPlayerWrapper>
              <TuberPlayer
                isOpen={playerOpen}
                bookmark={bookmarkToPlay}
                toolbarProps={toolbarProps}
              />
            </TuberPlayerWrapper>
          </Grid>
        ) : (
          <Grid container direction='row'>
            <TuberBookmarkSearchEngine
              playerOpen={playerOpen}
              setPlayerOpen={setPlayerOpen}
              setBookmarkToPlay={setBookmarkToPlay}
            />
            <ResearchToolbar {...toolbarProps} />
          </Grid>
        )}
    </Fragment>
  )
}