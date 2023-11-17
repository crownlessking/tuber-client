import { Fragment } from 'react'
import * as Icons from '@mui/icons-material'
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined'
import { log } from '../state'

export default function getImportedSvgIcon (
  iconName: string,
  props?: any
): JSX.Element | null {
  const iconTable: { [icon: string]: JSX.Element } = {
    'phone_outline': <Icons.PhoneOutlined {...props} />,
    'call_outline': <Icons.PhoneOutlined {...props} />,
    'personaddoutlined': <Icons.PersonAddOutlined {...props} />,
    'person_add_outline': <Icons.PersonAddOutlined {...props} />,
    'vpn_key_outline': <Icons.VpnKeyOutlined {...props} />,
    'checkcircleoutline': <Icons.CheckCircleOutline {...props} />,
    'check_circle_outline': <Icons.CheckCircleOutline {...props} />,
    'doneoutline': <Icons.DoneOutline {...props} />,
    'done_outline': <Icons.DoneOutline {...props} />,
    'beenhereoutline': <Icons.BeenhereOutlined {...props} />,
    'been_here_outline': <Icons.BeenhereOutlined {...props} />,
    'buildoutlined': <BuildOutlinedIcon {...props} />,
    'build_outline': <BuildOutlinedIcon {...props} />,
    'donealloutlined': <Icons.DoneAllOutlined {...props} />,
    'done_all_outline': <Icons.DoneAllOutlined {...props} />,
    'doneoutlineoutlined': <Icons.DoneOutlineOutlined {...props} />,
    'done_outline_outline': <Icons.DoneOutlineOutlined {...props} />,
    'draftsoutlined': <Icons.DraftsOutlined {...props} />,
    'drafts_outline': <Icons.DraftsOutlined {...props} />,
    'highlightoffoutlined': <Icons.HighlightOffOutlined {...props} />,
    'highlight_off_outline': <Icons.HighlightOffOutlined {...props} />,
    'homeoutlined': <Icons.HomeOutlined {...props} />,
    'home_outline': <Icons.HomeOutlined {...props} />,
    'houseoutlined': <Icons.HouseOutlined {...props} />,
    'house_outline': <Icons.HouseOutlined {...props} />,
    'hoteloutlined': <Icons.HotelOutlined {...props} />,
    'hotel_outline': <Icons.HotelOutlined {...props} />,
    'hourglassemptyoutlined': <Icons.HourglassEmptyOutlined {...props} />,
    'hourglass_empty_outline': <Icons.HourglassEmptyOutlined {...props} />,
    'howtoregoutlined': <Icons.HowToRegOutlined {...props} />,
    'how_to_reg_outline': <Icons.HowToRegOutlined {...props} />,
    'httpsoutlined': <Icons.HttpsOutlined {...props} />,
    'https_outline': <Icons.HttpsOutlined {...props} />,
    'imagesearchoutlined': <Icons.ImageSearchOutlined {...props} />,
    'image_search_outline': <Icons.ImageSearchOutlined {...props} />,
    'infooutlined': <Icons.InfoOutlined {...props} />,
    'info_outline': <Icons.InfoOutlined {...props} />,
    'powersettingsnewoutlined': <Icons.PowerSettingsNewOutlined {...props} />,
    'power_settings_new_outline': <Icons.PowerSettingsNewOutlined {...props} />,
    'querybuilderoutlined': <Icons.QueryBuilderOutlined {...props} />,
    'query_builder_outline': <Icons.QueryBuilderOutlined {...props} />,
    'removecircleoutlineoutlined': <Icons.RemoveCircleOutlineOutlined {...props} />,
    'remove_circle_outline_outline': <Icons.RemoveCircleOutlineOutlined {...props} />,
    'removeredeyeoutlined': <Icons.RemoveRedEyeOutlined {...props} />,
    'remove_red_eye_outline': <Icons.RemoveRedEyeOutlined {...props} />,
    'reportoutlined':  <Icons.ReportOutlined {...props} />,
    'report_outline':  <Icons.ReportOutlined {...props} />,
    'reportproblemoutlined':  <Icons.ReportProblemOutlined {...props} />,
    'report_problem_outline':  <Icons.ReportProblemOutlined {...props} />,
    'searchoutlined':  <Icons.SearchOutlined {...props} />,
    'search_outline':  <Icons.SearchOutlined {...props} />,
    'settingsoutlined': <Icons.SettingsOutlined {...props} />,
    'settings_outline': <Icons.SettingsOutlined {...props} />,
    'menu': <Icons.Menu {...props} />,
    'assignmentoutlined': <Icons.AssignmentOutlined {...props} />,
    'assignment_outline': <Icons.AssignmentOutlined {...props} />,
    'playlistaddoutlined': <Icons.PlaylistAddOutlined {...props} />,
    'playlist_add_outline': <Icons.PlaylistAddOutlined {...props} />,
    'subscriptionsoutlined': <Icons.SubscriptionsOutlined {...props} />,
    'subscriptions_outline': <Icons.SubscriptionsOutlined {...props} />,
    'addtoqueue': <Icons.AddToQueue {...props} />,
    'add_to_queue': <Icons.AddToQueue {...props} />,
    'AlternateEmailOutlined': <Icons.AlternateEmailOutlined {...props} />,
    'alternate_email_outline': <Icons.AlternateEmailOutlined {...props} />,
    'postAddOutlined': <Icons.PostAddOutlined {...props} />,
    'post_add_outline': <Icons.PostAddOutlined {...props} />,
    'publishOutlined': <Icons.PublishOutlined {...props} />,
    'publish_outline': <Icons.PublishOutlined {...props} />,
    'arrowForwardIosOutlined': <Icons.ArrowForwardIosOutlined {...props} />,
    'arrow_forward_ios_outline': <Icons.ArrowForwardIosOutlined {...props} />,
    'monitorOutlined': <Icons.MonitorOutlined {...props} />,
    'monitor_outline': <Icons.MonitorOutlined {...props} />,
    'filterNoneOutlined': <Icons.FilterNoneOutlined {...props} />,
    'filter_none_outline': <Icons.FilterNoneOutlined {...props} />,
    'none': <Fragment />
  }
  const iconName_lc = iconName.toLowerCase()
  if (iconName_lc in iconTable) {
    return iconTable[iconName_lc]
  }
  log('Invalid `iconName`')
  return null
}
