import React from 'react';
import { PAGE_EVENTS_HOME } from '../../helpers/constants';
import withPageTracking from '../../hocs/withPageTracking';
import RecommendationListWidget from '../../widgets/BasicRecommendationList';
import './styles.css';

import { handlePersonalization } from '../../services/personalizeService';

/**
 * This page shows the main page of the site.
 * CustomPageWidgets will render some content blocks and recommendations widgets configured for this page on CEC panel.
 * The other static recommendation widgets render here has been created in CEC panel with the configuration "WILL BE USED IN" set in "Common across all Pages" (hs_trending, hs_best_seller, hs_feature) to can be used in a hard code mode
 */
const Home = () => {
  console.log('home loading');

  handlePersonalization('laser_personas');

  return (
    <div>
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="banner">Welcome to Sitecore Sports & Leisure</div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <RecommendationListWidget
                title="Our Customer Favorites"
                rfkId="hs_trending"
                productsToDisplay={5}
                displayAddToCard
                displayQuickView
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <RecommendationListWidget
                title="What's Hot this Spring"
                rfkId="hs_best_seller"
                productsToDisplay={5}
                displayAddToCard
                displayQuickView
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <RecommendationListWidget
                title="Gear to Get You Moving"
                rfkId="hs_feature"
                productsToDisplay={5}
                displayAddToCard
                displayQuickView
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default withPageTracking(Home, PAGE_EVENTS_HOME);
