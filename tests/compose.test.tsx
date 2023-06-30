import * as React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom';
import Compose from "./compose";

test('count should be 3 after clicking button 3 times', async () => {
  render(<Compose/>);
  const increaseA = await screen.findByTestId('increaseA');
  const increaseB = await screen.findByTestId('increaseB');
  expect(screen.getByTestId('sum')).toHaveTextContent('0');
  fireEvent.click(increaseA);
  expect(screen.getByTestId('sum')).toHaveTextContent('1');
  fireEvent.click(increaseB);
  expect(screen.getByTestId('sum')).toHaveTextContent('2');
  fireEvent.click(increaseA);
  expect(screen.getByTestId('sum')).toHaveTextContent('3');
})
