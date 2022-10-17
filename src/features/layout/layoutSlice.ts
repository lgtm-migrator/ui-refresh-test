import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useAppDispatch } from '../../common/hooks';

interface PageState {
  pageTitle?: string;
  environment: 'unknown' | 'production' | 'ci' | 'appdev';
}

const initialState: PageState = {
  pageTitle: undefined,
  environment: 'unknown',
};

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPageTitle: (state, action: PayloadAction<string | undefined>) => {
      state.pageTitle = action.payload;
    },
    setEnvironment: (
      state,
      action: PayloadAction<PageState['environment']>
    ) => {
      state.environment = action.payload;
    },
  },
});

export default pageSlice.reducer;
export const { setPageTitle, setEnvironment } = pageSlice.actions;

const defaultPageTitle = document.title;
// Hook to set the page & document title. Resets the title on unmount
export const usePageTitle = (title: string) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setPageTitle(title));
    document.title = `KBase${title !== undefined ? `: ${title}` : ''}`;
    return () => {
      dispatch(setPageTitle(undefined));
      document.title = defaultPageTitle;
    };
  }, [dispatch, title]);
  return null;
};
