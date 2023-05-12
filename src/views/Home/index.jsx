import React from 'react';
import { PAGE_EVENTS_HOME } from '../../helpers/constants';
import withPageTracking from '../../hocs/withPageTracking';
import RecommendationListWidget from '../../widgets/BasicRecommendationList';
import './styles.css';

import { handlePersonalizationManual } from '../../services/personalizeService';

/**
 * This page shows the main page of the site.
 * CustomPageWidgets will render some content blocks and recommendations widgets configured for this page on CEC panel.
 * The other static recommendation widgets render here has been created in CEC panel with the configuration "WILL BE USED IN" set in "Common across all Pages" (hs_trending, hs_best_seller, hs_feature) to can be used in a hard code mode
 */
const Home = () => {
  const [rec1Title, setrec1Title] = React.useState('Our Customer Favorites');
  const [rec2Title, setrec2Title] = React.useState("What's Hot this Spring");
  const [rec3Title, setrec3Title] = React.useState('Gear to Get You Moving');

  const response = handlePersonalizationManual('laser_personas');

  response.then((personation) => {
    setrec1Title(personation.recs[0].recTitle);
    setrec2Title(personation.recs[1].recTitle);
    setrec3Title(personation.recs[2].recTitle);
  });

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
                title={rec1Title}
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
                title={rec2Title}
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
                title={rec3Title}
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
