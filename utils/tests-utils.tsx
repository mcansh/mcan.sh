/* eslint-env jest */
import React from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from 'react-testing-library';
import { theme } from '~/style';

const renderWithTheme = children => {
  return {
    ...render(
      <ThemeProvider theme={theme}>
        <>{childrenWithIntl}</>
      </ThemeProvider>
    ),
  };
};

export * from 'react-testing-library';
export { renderWithTheme as render };
