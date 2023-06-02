import React from 'react';
import { PAGE_EVENTS_HOME } from '../../helpers/constants';
import withPageTracking from '../../hocs/withPageTracking';
import RecommendationListWidget from '../../widgets/BasicRecommendationList';
import './styles.css';

import { handlePersonalization, handleShownRecommendationsEvent } from '../../services/personalizeService';

/**
 * This page shows the main page of the site.
 * CustomPageWidgets will render some content blocks and recommendations widgets configured for this page on CEC panel.
 * The other static recommendation widgets render here has been created in CEC panel with the configuration "WILL BE USED IN" set in "Common across all Pages" (hs_trending, hs_best_seller, hs_feature) to can be used in a hard code mode
 */

// Check if the user is on a mobile device
export function isMobileDevice() {
  return window.innerWidth <= 800; // Adjust the threshold as needed
}

const Home = () => {
  let numRecommendations = 5;
  const [rec1Title, setrec1Title] = React.useState('Our Customer Favorites');
  const [rec2Title, setrec2Title] = React.useState("What's Hot this Spring");
  const [rec3Title, setrec3Title] = React.useState('Gear to Get You Moving');

  const [rec1Recipe, setrec1Recipe] = React.useState('hs_trending');
  const [rec2Recipe, setrec2Recipe] = React.useState('hs_best_seller');
  const [rec3Recipe, setrec3Recipe] = React.useState('hs_feature');

  const [title, setTitle] = React.useState('Welcome to Sitecore Sports & Leisure');
  const [homepageImg, setHomepageImg] = React.useState(
    'https://d368g9lw5ileu7.cloudfront.net/races/races-30xxx/30749/raceBanner-3YS4GBud-byXW04.jpg',
  );
  const [position, setPosition] = React.useState('top');

  if (isMobileDevice()) {
    numRecommendations = 2;
  }

  const response = handlePersonalization('laser_personas');

  response.then((personalization) => {
    setrec1Title(personalization.recs[0].recTitle);
    setrec2Title(personalization.recs[1].recTitle);
    setrec3Title(personalization.recs[2].recTitle);

    setrec1Recipe(personalization.recs[0].recipeID);
    setrec2Recipe(personalization.recs[1].recipeID);
    setrec3Recipe(personalization.recs[2].recipeID);

    if (isMobileDevice()) {
      setTitle();
    } else {
      setTitle(personalization.homepageTitle);
    }
    setHomepageImg(personalization.homepageImage);
    setPosition(personalization.homepageTitlePosition);

    handleShownRecommendationsEvent(personalization);
  });

  return (
    <div>
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col">
              <div
                className="banner"
                style={{
                  backgroundImage: `url(${homepageImg})`,
                }}
              >
                {position === 'top' && (
                  <p
                    className="banner-title"
                    style={{
                      marginTop: '0px',
                    }}
                  >
                    {title}
                  </p>
                )}
                {position === 'bottom' && (
                  <p
                    className="banner-title"
                    style={{
                      marginTop: '200px',
                    }}
                  >
                    {title}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <RecommendationListWidget
                title={rec1Title}
                rfkId={rec1Recipe}
                productsToDisplay={numRecommendations}
                displayAddToCard
                displayQuickView
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <RecommendationListWidget
                title={rec2Title}
                rfkId={rec2Recipe}
                productsToDisplay={numRecommendations}
                displayAddToCard
                displayQuickView
              />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <RecommendationListWidget
                title={rec3Title}
                rfkId={rec3Recipe}
                productsToDisplay={numRecommendations}
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
