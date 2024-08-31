import { useState, useEffect } from "react";

type SetStateAction<T> = T | ((prevState: T) => T);
type Dispatch<A> = (value: A) => void;

function usePersistentState<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue)?.value : initialValue;
    } catch (error) {
      console.error("Error retrieving stored value:", error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify({ value: state }));
    } catch (error) {
      console.error("Error storing value:", error);
    }
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;
