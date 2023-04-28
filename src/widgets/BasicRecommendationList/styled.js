import styled from 'styled-components';

import { theme } from '@sitecore-discover/ui';

export const Header = styled.h3`
  color: ${theme.vars.palette.primary.main};
  font-family: ${theme.vars.typography.fontFamilySystem};
`;

export const RecommendationContainer = styled.div``;

export const ProductsGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
  font-family: ${theme.vars.typography.fontFamilySystem};
  margin-bottom: 25px;

  img {
    width: 100%;
    height: 250px;
  }
`;
