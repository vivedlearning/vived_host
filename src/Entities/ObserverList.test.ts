import { ObserverList } from './ObserverList';

test('An observer that recieves nothing', () => {
  const observers = new ObserverList<void>();
  const obs = jest.fn();

  observers.add(obs);
  observers.notify();

  expect(obs).toBeCalled();
});

test('An observer that recieves a string', () => {
  const observers = new ObserverList<string>();
  const obs = jest.fn();

  observers.add(obs);
  observers.notify('!yolo');

  expect(obs).toBeCalledWith('!yolo');
});

test('An observer that recieves a number', () => {
  const observers = new ObserverList<number>();
  const obs = jest.fn();

  observers.add(obs);

  observers.notify(55);

  expect(obs).toBeCalledWith(55);
});

test('Observer can be removed', () => {
  const observers = new ObserverList<void>();
  const obs = jest.fn();

  observers.add(obs);
  observers.notify();

  expect(obs).toBeCalled();

  obs.mockClear();
  observers.remove(obs);
  observers.notify();

  expect(obs).not.toBeCalled();
});

test('Clearing the oberver list', () => {
  const observers = new ObserverList<void>();
  const obs = jest.fn();

  observers.add(obs);

  observers.clear();

  observers.notify();

  expect(obs).not.toBeCalled();
});
