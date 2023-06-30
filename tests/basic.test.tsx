import * as React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom';
import Basic from "./basic";

test('count should be 3 after clicking button 3 times', async () => {
  render(<Basic/>);
  fireEvent.click(screen.getByRole('button'));
  fireEvent.click(screen.getByRole('button'));
  fireEvent.click(screen.getByRole('button'));
  expect(screen.getByTestId('count')).toHaveTextContent('Count is 3');
})
