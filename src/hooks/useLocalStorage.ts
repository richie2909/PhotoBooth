import { useState, useEffect } from 'react';

interface StoredValue<T> {
  value: T;
  timestamp: number;
}

const SEVEN_DAYS_IN_MS = 7 * 24 * 60 * 60 * 1000;

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then
  // parse stored json or return initialValue
  const readValue = () => {
    // Prevent build error "window is undefined" but keep working
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedItem = JSON.parse(item) as StoredValue<T>;
      const now = Date.now();
      
      // Check if the stored data is older than 7 days
      if (now - parsedItem.timestamp > SEVEN_DAYS_IN_MS) {
        // Clear expired data
        window.localStorage.removeItem(key);
        return initialValue;
      }

      return parsedItem.value;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Store value with timestamp
      const itemToStore: StoredValue<T> = {
        value: valueToStore,
        timestamp: Date.now()
      };
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(itemToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  useEffect(() => {
    setStoredValue(readValue());
  }, []);

  return [storedValue, setValue] as const;
} 