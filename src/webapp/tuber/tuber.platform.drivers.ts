import { remember_error } from 'src/state/_errors.business.logic'
import {
  DIALGO_DAILY_NEW_ID,
  DIALOG_FACEBOOK_NEW_ID,
  DIALOG_ODYSEE_NEW_ID,
  DIALOG_RUMBLE_NEW_ID,
  DIALOG_TWITCH_NEW_ID,
  DIALOG_UNKNOWN_NEW_ID,
  DIALOG_VIMEO_NEW_ID,
  DIALOG_YOUTUBE_NEW_ID
} from './tuber.config'
import {
  youtube_get_video_id,
  youtube_get_start_time,
  vimeo_get_start_time,
  vimeo_get_video_id,
  rumble_get_start_time,
  daily_get_video_id,
  get_rumble_slug,
  twitch_get_video_id,
  twitch_get_start_time,
  daily_get_start_time,
  odysee_get_url_data,
} from './_tuber.business.logic'
import { IUrlStatus, IVideoData, TPlatform } from './tuber.interfaces'

const DATA_SKELETON: IVideoData = {
  platform: '_blank',
  id: '',
  start: 0,
  author: '',
  slug: '',
  urlCheck: {
    message: 'Invalid URL: Make sure the URL is correct, '
      + 'that it is a supported platform URL, and the video start time is '
      + 'included.',
    valid: false
  },
  thumbnailUrl: '',
  dialogId: '0'
}

const NO_START_MSG = 'The video start time is missing.'

export default function parse_platform_video_url(url: string): IVideoData {
  const { valid, message } = _check_url(url)
  if (!valid) {
    remember_error({
      code: 'invalid_url',
      title: 'Invalid URL',
      detail: message,
      source: { pointer: url }
    })
    return {
      ...DATA_SKELETON,
      urlCheck: { message, valid }
    }
  }
  const urlObj = new URL(url)
  switch (urlObj.hostname) {
    case 'youtu.be':
    case 'youtube.com':
      return _extract_data_from_youTube_url(url)
    case 'vimeo.com':
      return _extract_data_from_vimeo_url(url)
    case 'rumble.com':
      return _extract_data_from_rumble_url(url)
    case 'odysee.com':
      return _extract_data_from_odysee_url(url)
    case 'www.facebook.com':
    case 'fb.watch':
      return _extract_data_from_facebook_url()
    case 'www.dailymotion.com':
    case 'dai.ly':
      return _extract_data_from_dailymotion_url(url)
    case 'www.twitch.tv':
      return _extract_data_from_twitch_url(url)
    default:
      return {
        ...DATA_SKELETON,
        platform: 'unknown',
        urlCheck: {
          message: DATA_SKELETON.urlCheck.message,
          valid: true // TODO Set this to false to disallow unknown platforms
        },
        dialogId: DIALOG_UNKNOWN_NEW_ID
      }
  }
}

function _check_url(url: string): IUrlStatus {
  if (url.length < 1) {
    return {
      message: 'URL is empty',
      valid: false
    }
  }
  const urlRegex = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/
  const valid = urlRegex.test(url)
  const message = valid ? 'OK' : 'Invalid URL'
  return { message, valid }
}

function _extract_data_from_youTube_url(url: string) {
  const id = youtube_get_video_id(url)
  if (!id) {
    remember_error({
      code: 'value_not_found',
      title: 'youtube_get_video_id failed',
      detail: 'The youtube_get_video_id function failed to retrieve the video'
        + ' id from the video URL',
      source: { pointer: url }
    })
    return DATA_SKELETON
  }
  const startStr = youtube_get_start_time(url)
  if (!startStr) {
    remember_error({
      code: 'value_not_found',
      title: 'youtube_get_video_start_time failed',
      detail: `The "youtube_get_video_start_time" function failed to retieve`
        + ` the video start time from the video URL.`,
      source: { pointer: url }
    })
    return DATA_SKELETON
  }
  const platform: TPlatform = 'youtube'
  const start = parseInt(startStr)
  const data = {
    ...DATA_SKELETON,
    platform,
    id,
    start,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    dialogId: DIALOG_YOUTUBE_NEW_ID
  }
  return data
}

/**
 * Example URL: // https://rumble.com/v38vipp-what-is-ai-artificial-intelligence-what-is-artificial-intelligence-ai-in-5-.html
 */
function _extract_data_from_rumble_url(url: string): IVideoData {
  const slug  = get_rumble_slug(url)
  if (!slug) {
    remember_error({
      code: 'value_not_found',
      title: 'rumble_get_slug failed',
      detail: 'The "rumble_get_slug" function failed to extract the video slug '
        + 'from the URL.',
      source: { pointer: url }
    })
    return DATA_SKELETON
  }
  const start = rumble_get_start_time(url)
  if (!start) {
    remember_error({
      code: 'value_not_found',
      title: 'rumble_get_start_time failed',
      detail: 'The "rumble_get_start_time" function failed to extract the video '
        + 'start time from the URL.',
      source: { pointer: url }
    })
    return {
      ...DATA_SKELETON,
      urlCheck: {
        message: NO_START_MSG,
        valid: false
      }
    }
  }
  const data: IVideoData = {
    ...DATA_SKELETON,
    start,
    platform: 'rumble',
    slug,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    dialogId: DIALOG_RUMBLE_NEW_ID
  }
  return data
}

function _extract_data_from_vimeo_url(url: string) {
  const id = vimeo_get_video_id(url)
  if (!id) {
    remember_error({
      code: 'value_not_found',
      title: 'vimeo_get_video_id failed',
      detail: 'The "vimeo_get_video_id" function failed to extract the video '
        + 'ID from the URL.',
      source: { pointer: url }
    })
    return DATA_SKELETON
  }
  const platform: TPlatform = 'vimeo'
  const start = vimeo_get_start_time(url)
  if (!start) {
    remember_error({
      code: 'value_not_found',
      title: 'vimeo_get_start_time failed',
      detail: 'The "vimeo_get_start_time" function failed to extract the video '
        + 'start time from the URL.',
      source: { pointer: url }
    })
    return {
      ...DATA_SKELETON,
      urlCheck: {
        message: NO_START_MSG,
        valid: false
      }
    }
  }
  const data = {
    ...DATA_SKELETON,
    platform,
    id,
    start,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    dialogId: DIALOG_VIMEO_NEW_ID
  }
  return data
}

function _extract_data_from_dailymotion_url(url: string) {
  const id = daily_get_video_id(url)
  if (!id) {
    remember_error({
      code: 'value_not_found',
      title: 'daily_get_video_id failed',
      detail: 'The "daily_get_video_id" function failed to extract the video '
        + 'ID from the URL.',
      source: { pointer: url }
    })
    return DATA_SKELETON
  }
  const start = daily_get_start_time(url)
  if (!start) {
    remember_error({
      code: 'value_not_found',
      title: 'daily_get_start_time failed',
      detail: 'The "daily_get_start_time" function failed to extract the video '
        + 'start time from the URL.',
      source: { pointer: url }
    })
    return {
      ...DATA_SKELETON,
      urlCheck: {
        message: NO_START_MSG,
        valid: false
      }
    }
  }
  const data: IVideoData = {
    ...DATA_SKELETON,
    platform: 'dailymotion',
    id,
    start,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    dialogId: DIALGO_DAILY_NEW_ID
  }
  return data
}

/** Example URL: https://odysee.com/@GameolioDan:6/diablo-4-playthrough-part-30-entombed:1?t=368 */
function _extract_data_from_odysee_url(url: string) {
  const { author, id , start } = odysee_get_url_data(url)
  if (!start) {
    remember_error({
      code: 'value_not_found',
      title: 'odysee_get_start_time failed',
      detail: 'The odysee_get_start_time function failed to extract the video '
        + 'start time from the URL.',
      source: { pointer: url }
    })
    return {
      ...DATA_SKELETON,
      urlCheck: {
        message: NO_START_MSG,
        valid: false
      }
    }
  }
  if (!author || !id) {
    remember_error({
      code: 'value_not_found',
      title: 'odysee_get_slug failed',
      detail: 'The "odysee_get_slug" function failed to extract the video ID '
        + 'or author from the URL.',
      source: { pointer: url }
    })
    return DATA_SKELETON
  }
  const slug = `${author}/${id}`
  const data: IVideoData = {
    ...DATA_SKELETON,
    start,
    platform: 'odysee',
    slug,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    dialogId: DIALOG_ODYSEE_NEW_ID
  }
  return data
}

function _extract_data_from_twitch_url(url: string) {
  const id = twitch_get_video_id(url)
  if (!id) {
    remember_error({
      code: 'value_not_found',
      title: 'twitch_get_video_id failed',
      detail: 'The "twitch_get_video_id" function failed to extract the video '
        + 'ID from the URL.',
      source: { pointer: url }
    })
    return DATA_SKELETON
  }
  const start = twitch_get_start_time(url)
  if (!start) {
    remember_error({
      code: 'value_not_found',
      title: 'twitch_get_start_time failed',
      detail: 'The "twitch_get_start_time" function failed to extract the video '
        + 'start time from the URL.',
      source: { pointer: url }
    })
    return DATA_SKELETON
  }
  const data: IVideoData = {
    ...DATA_SKELETON,
    id,
    platform: 'twitch',
    start,
    urlCheck: {
      message: 'OK',
      valid: true
    },
    dialogId: DIALOG_TWITCH_NEW_ID
  }
  return data
}

/**
 * __Note:__ The embed URL is needed here.  
 * Example slug: `MetroUK%2Fvideos%2F7129126943765650`
 */
function _extract_data_from_facebook_url() {
  const data: IVideoData = {
    ...DATA_SKELETON,
    platform: 'facebook',
    urlCheck: {
      message: 'Facebook is not supported at this time.',
      valid: false // TODO set this to true to allow facebook videos
    },
    dialogId: DIALOG_FACEBOOK_NEW_ID
  }
  return data
}