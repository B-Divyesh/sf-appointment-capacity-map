import { emptyData, type Data } from './types'

const DB = 'capacity-map'; const STORE = 'notebook'
export type StorageMode = 'real' | 'demo'

const keyFor = (mode: StorageMode) => mode === 'demo' ? 'demo:capacity' : 'capacity'

function request<T>(mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB, 1)
    open.onupgradeneeded = () => open.result.createObjectStore(STORE)
    open.onerror = () => reject(open.error)
    open.onsuccess = () => {
      const transaction = open.result.transaction(STORE, mode)
      const result = action(transaction.objectStore(STORE))
      result.onsuccess = () => resolve(result.result)
      result.onerror = () => reject(result.error)
      transaction.oncomplete = () => open.result.close()
    }
  })
}

export async function load(mode: StorageMode): Promise<Data> {
  return (await request<Data | undefined>('readonly', (store) => store.get(keyFor(mode)))) ?? emptyData()
}

export async function save(data: Data, mode: StorageMode): Promise<void> {
  await request<IDBValidKey>('readwrite', (store) => store.put(data, keyFor(mode)))
}

export async function clear(mode: StorageMode): Promise<void> {
  await request<undefined>('readwrite', (store) => store.delete(keyFor(mode)))
}
