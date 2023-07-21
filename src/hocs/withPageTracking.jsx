import { PageController, trackPageViewEvent } from '@sitecore-discover/react';
import React, { useEffect } from 'react';
import { PAGE_EVENTS_DEFAULT } from '../helpers/constants';
import useUri from '../hooks/useUri';

import { engage } from '../engage';
import { sendPageViewEvent } from '../services/personalizeService';

export const PageEventContext = React.createContext();
/**
 * The page view event is handled in sitecore SDK, but for SPA it just happen on the first time.
 * So when user navigate is needed to track the page view event manually.
 * This is the purpouse of this hoc, set page uri and track the page view event
 */

// eslint-disable-next-line import/no-mutable-exports
let firstViewEvent = false;

export const firstEngageView = (Component, pageType = PAGE_EVENTS_DEFAULT) => {
  const uri = useUri();

  useEffect(() => {
    const fetchData = setTimeout(() => {
      if (engage !== undefined && !firstViewEvent) {
        PageController.getContext().setPageUri(uri);
        sendPageViewEvent(pageType, PageController.getContext().toJson());
        firstViewEvent = true;
      }
    }, 200);
    return () => clearTimeout(fetchData);
  });
};

export function getFirstViewEventTriggered() {
  return firstViewEvent;
}

const withPageTracking =
  (Component, pageType = PAGE_EVENTS_DEFAULT) =>
  (props) => {
    const uri = useUri();

    // disover page view event
    useEffect(() => {
      PageController.getContext().setPageUri(uri);
      trackPageViewEvent(PageController.getContext().toJson());
    }, [uri]);

    // personalize page view event
    useEffect(() => {
      if (engage !== undefined) {
        PageController.getContext().setPageUri(uri);
        sendPageViewEvent(pageType, PageController.getContext().toJson());
      }
    }, [uri, engage]);

    return (
      <PageEventContext.Provider value={pageType}>
        <Component {...{ props }} />
      </PageEventContext.Provider>
    );
  };

export default withPageTracking;
