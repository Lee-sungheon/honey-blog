import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from './index';
import Type from '../components/Type';

test('the counter starts at 0', () => {
  render(<Home />);
  const counterElement = screen.getByTestId('counter');
  expect(counterElement).toHaveTextContent('0');
});

test('minus button has correct text', () => {
  render(<Home />);
  const minusButtonElement = screen.getByTestId('minus-button');
  expect(minusButtonElement).toHaveTextContent('-');
});

test('plus button has correct text', () => {
  render(<Home />);
  const plusButtonElement = screen.getByTestId('plus-button');
  expect(plusButtonElement).toHaveTextContent('+');
});

test('When the + button is pressed, the counter changes to 1', () => {
  render(<Home />);
  const buttonElement = screen.getByTestId('plus-button');
  fireEvent.click(buttonElement);
  const counterElement = screen.getByTestId('counter');
  expect(counterElement).toHaveTextContent('1');
});

test('When the - button is pressed, the counter changes to -1', () => {
  render(<Home />);
  const buttonElement = screen.getByTestId('minus-button');
  fireEvent.click(buttonElement);


  const counterElement = screen.getByTestId('counter');
  expect(counterElement).toHaveTextContent('-1');
});

test.skip('on/off button has blue color', () => {
  render(<Home />);
  const buttonElement = screen.getByTestId('on/off-button');
  expect(buttonElement).toHaveStyle({ backgroundColor: 'blue' });
});

test('Prevent the -, + button from being pressed when the on/off button is clicked', () => {
  render(<Home />);
  const onOffButtonElement = screen.getByTestId('on/off-button');
  fireEvent.click(onOffButtonElement);
  const plusButtonElement = screen.getByTestId('plus-button');
  const minusButtonElement = screen.getByTestId('minus-button');
  expect(plusButtonElement).toBeDisabled();
  expect(minusButtonElement).toBeDisabled();
});

test('display product images from server', async () => {
  render(<Type orderType={'products'} />);

  const productImages = await screen.findAllByRole<HTMLImageElement>('img', {
    name: /product$/i,
  });
  await waitFor(() => expect(productImages).toHaveLength(2));

  const altText = productImages.map((element) => element.alt);
  expect(altText).toEqual(['America product', 'England product']);
});
