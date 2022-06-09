import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getServiceClient, URLS } from '../services';
import { typeIconInfos } from './icons';
import {
  IconDefinition,
  faCube,
  faFile,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';

export interface IconInfo {
  /* 
    if IconInfo.icon is a string, it will either be the img src url
    or the kbase css class name, depending on whether its used in an
    AppCellIcon or a TypeIcon.
  */
  icon: string | IconDefinition;
  color: string;
}
interface AppIconCache {
  release: { [key: string]: IconInfo };
  beta: { [key: string]: IconInfo };
  dev: { [key: string]: IconInfo };
}

export enum AppTag {
  release = 'release',
  beta = 'beta',
  dev = 'dev',
}
interface IconState {
  typeIconInfos: { [key: string]: IconInfo };
  appIconCache: AppIconCache;
  defaultApp: IconInfo;
  defaultType: IconInfo;
  loadingIcon: IconInfo;
}

type AppIconPayload = {
  appId: string;
  appTag: AppTag;
  icon: IconInfo;
};

export const appIcon = createAsyncThunk(
  'icons',
  async ({ appId, appTag }: { appId: string; appTag: AppTag }, thunkAPI) => {
    const state = thunkAPI.getState() as { icons: IconState };
    const { appIconCache, defaultApp } = state.icons;

    if (!(appTag in appIconCache)) {
      return { appTag, appId, icon: defaultApp };
    }

    if (!appIconCache[appTag][appId]) {
      const client = getServiceClient('NarrativeMethodStore');
      try {
        const [methodInfo] = await client.call('get_method_brief_info', [
          { ids: [appId], tag: appTag },
        ]);
        const icon = methodInfo.icon.url;
        if (!icon) {
          return { appTag, appId, icon: defaultApp };
        } else {
          return {
            appTag,
            appId,
            icon: {
              icon: `${URLS.NarrativeMethodStore.slice(0, -4)}/${icon}`,
              color: 'silver',
            },
          };
        }
      } catch {
        return { appTag, appId, icon: defaultApp };
      }
    }
    return { appTag, appId, icon: appIconCache[appTag][appId] };
  }
);

const initialState: IconState = {
  appIconCache: {
    release: {},
    beta: {},
    dev: {},
  },
  typeIconInfos,
  defaultApp: {
    icon: faCube,
    color: '#683AB7',
  },
  defaultType: {
    icon: faFile,
    color: '#F44336',
  },
  loadingIcon: {
    icon: faSpinner,
    color: 'silver',
  },
};

export function isFAIcon(
  icon: string | IconDefinition
): icon is IconDefinition {
  return (icon as IconDefinition).icon !== undefined;
}

export const iconSlice = createSlice({
  name: 'icons',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      appIcon.fulfilled,
      (state, action: PayloadAction<AppIconPayload>) => {
        const updatedCache = {
          ...state.appIconCache[action.payload.appTag],
          [action.payload.appId]: action.payload.icon,
        };

        state.appIconCache = {
          ...state.appIconCache,
          [action.payload.appTag]: updatedCache,
        };
      }
    );
  },
});

export default iconSlice.reducer;
