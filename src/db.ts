import { emptyData, type Data } from './types'

const DB = 'capacity-map'; const STORE = 'notebook'; const KEY = 'capacity'
export async function load(): Promise<Data> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB, 1)
    open.onupgradeneeded = () => open.result.createObjectStore(STORE)
    open.onerror = () => reject(open.error)
    open.onsuccess = () => {
      const tx = open.result.transaction(STORE, 'readonly').objectStore(STORE).get(KEY)
      tx.onsuccess = () => resolve(tx.result ?? emptyData())
      tx.onerror = () => reject(tx.error)
    }
  })
}
export async function save(data: Data): Promise<void> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB, 1)
    open.onupgradeneeded = () => open.result.createObjectStore(STORE)
    open.onerror = () => reject(open.error)
    open.onsuccess = () => {
      const tx = open.result.transaction(STORE, 'readwrite'); tx.objectStore(STORE).put(data, KEY)
      tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error)
    }
  })
}
