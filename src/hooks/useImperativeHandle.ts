import { RefObject } from '../types';

export function useImperativeHandle<T>(ref: RefObject<T>, handle: T) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
  (ref as any).current = handle;
  console.log(ref);
}
