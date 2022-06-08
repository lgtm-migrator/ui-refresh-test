import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getServiceClient, URLS } from '../services';
import { typeIconInfos } from './icons';

export interface IconInfo {
  icon?: string;
  color: string;
  url?: string;
  isImage: boolean;
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
  icon?: IconInfo;
};

export const appIcon = createAsyncThunk(
  'icons',
  async ({ appId, appTag }: AppIconPayload, thunkAPI) => {
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
              isImage: true,
              url: `${URLS.NarrativeMethodStore.slice(0, -4)}/${icon}`,
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
    icon: 'cube',
    color: '#683AB7',
    isImage: false,
  },
  defaultType: {
    icon: 'cube',
    color: '#F44336',
    isImage: false,
  },
  loadingIcon: {
    icon: 'spinner',
    color: 'silver',
    isImage: false,
  },
};

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
