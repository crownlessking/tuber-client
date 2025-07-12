import { safely_get_as } from 'src/controllers';
import FormValidationPolicy from 'src/controllers/FormValidationPolicy';
import { IRedux } from 'src/state';
import {
  remember_error,
  remember_exception,
  remember_jsonapi_errors
} from 'src/business.logic/errors';
import {
  FORM_TEST_THUMBNAIL_ID,
  PAGE_TEST_THUMBNAIL_ID,
  THUMB_LOAD_ATTEMPTS_CONF,
  THUMB_MAX_LOAD_ATTEMPTS
} from '../tuber.config';
import parse_platform_video_url from '../tuber.platform.drivers';
import {
  get_dailymotion_thumbnail,
  dev_get_odysee_thumbnail,
  dev_get_rumble_thumbnail,
  get_twitch_thumbnail,
  get_vimeo_thumbnail,
  dev_get_youtube_thumbnail
} from '../dev.video.thumbnail';
import { get_fetch } from 'src/state/net.actions';
import { IBookmark } from '../tuber.interfaces';
import { IJsonapiResource } from 'src/interfaces/IJsonapi';
import React from 'react';
import Config from 'src/config';
import { get_origin_ending_fixed } from '../../../business.logic';
import { ler } from '../../../business.logic/logging';

export default function dev_get_video_thumbnail(redux: IRedux) {
  return async () => {
    const { store: { getState, dispatch } } = redux;
    const rootState = getState();
    const formName = rootState.stateRegistry[FORM_TEST_THUMBNAIL_ID];
    if (!formName) {
      const errorMsg = `dev_get_video_thumbnail: form name not found.`;
      ler(errorMsg);
      remember_error({
        code: 'value_not_found',
        title: errorMsg,
        meta: { FORM_TEST_THUMBNAIL_ID }
      });
      return;
    }
    const errorPolicy = new FormValidationPolicy(redux, formName);
    const route = rootState.stateRegistry[PAGE_TEST_THUMBNAIL_ID];
    if (!route) {
      errorPolicy.emit('video_url', `Page route not found`);
      return;
    }
    const videoUrl = safely_get_as<string>(
      rootState.formsData,
      `${formName}.video_url`,
      ''
    );
    if (!videoUrl) {
      errorPolicy.emit('video_url', `It's empty.`);
      return;
    }
    const video = parse_platform_video_url(videoUrl);
    if (!video.urlCheck.valid) {
      errorPolicy.emit('video_url', video.urlCheck.message);
      return;
    }
    switch (video.platform) {
    case 'dailymotion':
      video.thumbnailUrl = await get_dailymotion_thumbnail(video.id);
      break;
    case 'odysee':
      await dev_get_odysee_thumbnail(redux, video.slug);
      return;
    case 'rumble':
      await dev_get_rumble_thumbnail(redux, video.slug);
      return;
    case 'twitch':
      await get_twitch_thumbnail(redux, video.id);
      return;
    case 'vimeo':
      await get_vimeo_thumbnail(redux, video.id);
      return;
    case 'youtube':
      video.thumbnailUrl = dev_get_youtube_thumbnail(video.id);
      break;
    case 'facebook': // TODO implement getting facebook thumbnail image.
    case 'unknown':
    case '_blank':
    default:
      return;
    }
    dispatch({
      type: 'pagesData/pagesDataAdd',
      payload: {
        route,
        key: 'thumbnailUrl',
        data: video.thumbnailUrl
      }
    });
  }
}

export function dev_fix_missing_thumbnails(i: number) {
  return (redux: IRedux) => {
    return async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      const rootState = redux.store.getState();
      const resource: IJsonapiResource<IBookmark> = rootState
        .data
        .bookmarks
        ?.[i];
      if (!resource) {
        ler(`resourceList['${i}'] does not exist.`);
        return;
      }
      const id = resource.id;
      if (!id) {
        ler(`resourceList['${i}'].id is undefined.`);
        return;
      }
      const config = `${THUMB_LOAD_ATTEMPTS_CONF}${id}`;
      const attempts = Config.read(config, 0);
      if (attempts >= THUMB_MAX_LOAD_ATTEMPTS) {
        ler(`dev_fix_missing_thumbnails: ${config} exceeded.`);
        return;
      }
      Config.write(config, attempts + 1);
      try {
        const origin = get_origin_ending_fixed(rootState.app.origin);
        const endpoint = `${origin}bookmarks/${id}/thumbnail-url`;
        const editedBookmarkResource = await get_fetch(endpoint);
        if (editedBookmarkResource.errors) {
          ler(`dev_fix_missing_thumbnails: ${editedBookmarkResource.errors?.[0]?.title}`);
          remember_jsonapi_errors(editedBookmarkResource.errors);
          return;
        }
        redux.store.dispatch({
          type: 'data/resourceUpdate',
          payload: {
            endpoint: 'bookmarks',
            index: i,
            resource: editedBookmarkResource.data
          }
        });
      } catch (e: any) {
        ler(`dev_fix_missing_thumbnails: ${e.message}`);
        remember_exception(e);
      }
    }
  }
}
