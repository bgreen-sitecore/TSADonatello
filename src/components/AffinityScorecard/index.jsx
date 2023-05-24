/* eslint-disable jsx-a11y/click-events-have-key-events */
import { PageController } from '@sitecore-discover/react';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { engage } from '../../engage';
import discover from '../../images/discover.png';
import sitecore from '../../images/sitecore.png';
import { updateAffinities } from '../../services/personalizeService';
import './styles.css';

/* This is a component for demoing the integration between Discover and Personalize
 */
function AffinityScorecard() {
  const domain = '211430803';
  // const [uuid, setUUID] = getCookie('__ruid');
  const uuid = PageController.getContext().getUserUuid();
  const dispUUID = `${PageController.getContext().getUserUuid().substring(0, 40)}...`;
  const [CDPID, setCDPID] = useState('tempID');

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [updateCDP, setUpdateCDP] = useState(false);

  const [userProfile, setUserProfile] = useState([]);
  const [affinities, setAffinities] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [err, setErr] = useState(null);
  const [isErr, setIsErr] = useState(false);
  const [errStyle, setErrStyle] = useState('');

  function buildAffinities(data) {
    const thisAffinities = [];
    if (data.affinity) {
      const affinity = Object.entries(data.affinity);
      if (affinity.length > 1) {
        for (let i = 0; i < affinity.length; i += 1) {
          const affinityValues = [];
          const name = affinity[i][0];
          let values = affinity[i][1];
          if (values != null) {
            values = values.sort((a, b) => b.score - a.score);
            if (name !== 'category_ids' && name !== 'all_category_ids') {
              const valLeft = values.length - 5;
              for (let v = 0; v < values.length; v += 1) {
                let score = Number(values[v].score).toFixed(3);
                let val = values[v].value;
                if (v < 5) {
                  affinityValues[v] = { val, score };
                } else if (v === 5) {
                  score = 0;
                  val = `${valLeft} more...`;
                  affinityValues[5] = { val, score };
                }
              }
              thisAffinities.push({ name, affinityValues });
            }
          }
        }
      }
    }
    return thisAffinities;
  }

  function buildKeywords(data) {
    const thisKeywords = [];
    if (data.keyword.sp) {
      const keyword = Object.entries(data.keyword.sp);
      if (keyword) {
        if (keyword.length > 0) {
          for (let i = 0; i < keyword.length; i += 1) {
            const kwObject = keyword[i][1];
            const kwArray = Object.entries(kwObject);
            for (let j = 0; j < kwArray.length; j += 1) {
              if (kwArray[j][0] === 'kw') {
                thisKeywords.push(kwArray[j][1]);
              }
            }
          }
        }
      }
    }
    return thisKeywords.toString();
  }

  function buildProduct(data) {
    let thisProduct = '';
    if (data.product.views) {
      const product = Object.entries(data.product.views);
      if (product) {
        const values = product.sort((a, b) => b.n - a.n);
        const top = values['0'];
        const topVal = top[1].skuid;
        const topViews = top[1].n;
        thisProduct = `${topVal} (${topViews})`;
      }
    }
    return thisProduct;
  }

  function buildCategory(data) {
    let thisCategory = '';
    if (data.category.views) {
      const category = Object.entries(data.category.views);
      if (category) {
        const values = category.sort((a, b) => b.n - a.n);
        const top = values['0'];
        const topVal = top[1].cid;
        const topViews = top[1].n;
        thisCategory = `${topVal} (${topViews})`;
      }
    }
    return thisCategory;
  }

  function buildCDP() {
    try {
      updateAffinities(affinities, CDPID);
      // eslint-disable-next-line no-console
      console.log(`CDP updated`);
      setIsErr(false);
    } catch (cdpErr) {
      setIsErr(true);
      setErr(cdpErr);
      // eslint-disable-next-line no-console
      console.log(cdpErr);
    }
  }

  function getCDPID() {
    engage.getGuestId().then((response) => {
      setCDPID(response);
    });
  }

  useEffect(() => {
    const fetchData = setTimeout(() => {
      try {
        // eslint-disable-next-line no-console
        console.log(`Loading Affinity Scorecard for ${uuid}`);
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            domain_hash: domain,
            id: uuid,
            id_type: 'uuid',
            request: {
              product: ['views', 'orders', 'a2c'],
              category: ['views', 'orders', 'a2c'],
              affinity: [],
              max_size: 5,
              keyword: ['sp', 'sb'],
              personalization: 2,
              product_spec_version: 'v2',
            },
          }),
        };

        fetch(`https://data-user-profile-external.prod.rfksrv.com/user-profile/v3/${domain}`, requestOptions)
          .then((response) => response.json())
          .then((data) => {
            // eslint-disable-next-line no-console
            console.log(data);
            setUserProfile(data);
            setAffinities(buildAffinities(data));
            setKeywords(buildKeywords(data));
            setProducts(buildProduct(data));
            setCategories(buildCategory(data));
            getCDPID();
            buildCDP();
          });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('error', error);
      }
    }, 3000);

    return () => clearTimeout(fetchData);
  }, [location]);

  const toggleExtension = () => {
    setIsOpen(!isOpen);
  };

  /* eslint-disable no-param-reassign */
  const cancelCDP = (event) => {
    setUpdateCDP(false);
    event.target.form[0].value = '';
  };
  /* eslint-enable no-param-reassign */

  const handleSubmit = (event) => {
    event.preventDefault();
    if (CDPID.length === 0 || CDPID.length < 30) {
      setUpdateCDP(false);
      setIsErr(true);
      setErrStyle('errorShow');
      setErr('Sitecore Universal ID required');
      throw new Error('Sitecore Universal ID required.');
    } else {
      setUpdateCDP(true);
      setIsErr(false);
      setErrStyle('errorHide');
      buildCDP();
      return true;
    }
  };

  if (userProfile) {
    if (!isOpen) {
      return (
        <div id="toggleLogo">
          <img
            className="blinkImage"
            src={discover}
            onClick={toggleExtension}
            alt="Discover Logo"
            role="presentation"
          />
        </div>
      );
    }
    return (
      <div id="extension">
        <div id="toggleClose" onClick={toggleExtension} role="presentation">
          <span>X</span>
        </div>
        <div id="title">
          <img src={discover} alt="Discover Logo" />
          <span>Affinity Scorecard</span>
        </div>
        <div id="header">Powered by Sitecore Discover</div>
        <div id="scorecard">
          <div id="uuid">
            <b>Discover UUID:&nbsp;</b>
            {dispUUID == null ? 'n/a' : dispUUID}
          </div>
          <div id="cdpID">
            <b>CDP ID:&nbsp;</b>
            {CDPID}
          </div>
          <div id="message" className={affinities.length > 1 ? 'hideMe' : 'showMe'}>
            Browsing behavior not available
          </div>

          <div id="affinities" className={affinities != null && affinities.length > 1 ? 'showMe' : 'hideMe'}>
            <div id="affinityTable">
              {affinities.map((affinity, index1) => (
                <div key={index1}>
                  <div className="name">{affinity.name}</div>
                  {affinity.affinityValues.map((value, index2) => {
                    if (value.score === 0) {
                      return (
                        <div className="affinityValues" key={index2}>
                          <div className="valMsg">{value.val}</div>
                        </div>
                      );
                    }
                    return (
                      <div className="affinityValues" key={index2}>
                        <div className={value.score >= 0.5 ? 'val high' : 'val'}>{value.val}</div>
                        <div className={value.score >= 0.5 ? 'score high' : 'score'}>{value.score}</div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div id="keyword" className={keywords != null && keywords.length > 1 ? 'showMe' : 'hideMe'}>
            <table className="infoTable">
              <tbody>
                <tr className="infoRow">
                  <td className="infoCellOne">Search history:</td>
                  <td className="infoCellTwo">{keywords}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="product" className={products != null && products.length > 1 ? 'showMe' : 'hideMe'}>
            <table className="infoTable">
              <tbody>
                <tr className="infoRow">
                  <td className="infoCellOne">Top SKU (views):</td>
                  <td className="infoCellTwo">{products}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div id="category" className={categories != null && categories.length > 1 ? 'showMe' : 'hideMe'}>
            <table className="infoTable">
              <tbody>
                <tr className="infoRow">
                  <td className="infoCellOne">Top Category (views):</td>
                  <td className="infoCellTwo">{categories}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div id="cdp">
          <form onSubmit={handleSubmit} className={affinities.length > 1 ? 'showMe' : 'hideMe'}>
            <div className={isErr ? 'errorHide' : 'errorShow'}>&nbsp;</div>
            <div className={errStyle}>{err}</div>
            <div id="cdpInputs">
              <img src={sitecore} alt="Sitecore Logo" />
              <span>CDP ID:</span>
              <input
                id="cdpInput"
                type="text"
                value={CDPID}
                onChange={(e) => {
                  setCDPID(e.target.value);
                }}
                name="universalIDInput"
                disabled={updateCDP}
              />
              <input type="submit" value="Connect" className={!updateCDP ? 'showMe cdpButton' : 'hideMe cdpButton'} />
              <input
                type="button"
                value="Cancel"
                onClick={cancelCDP}
                className={updateCDP ? 'showMe cdpButton' : 'hideMe cdpButton'}
              />
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default AffinityScorecard;
