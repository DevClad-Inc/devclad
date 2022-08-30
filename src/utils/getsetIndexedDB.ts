import { get, set } from 'idb-keyval';

export default async function getsetIndexedDB<TState>(
  key:string,
  operation: string,
  payload?: TState,
): Promise<any> {
  let kvData;
  if (operation === 'get') {
    kvData = await get(key);
  }
  if (operation === 'set') {
    kvData = await set(key, payload);
  }
  return kvData;
}
