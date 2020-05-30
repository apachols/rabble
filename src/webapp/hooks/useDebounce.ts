import { useState, useEffect } from "react";

export default function useDebounce(value: any, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(
    () => {
      // Set the debounced value after the specified delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      // Return a cleanup function that will be called every time useEffect is re-called.
      // This clears the timeout on the previous event, so that only the last event within
      // the debounce window ends up firing.
      return () => {
        clearTimeout(handler);
      };
    },
    // Only re-call effect if value changes
    [value, delay]
  );

  return debouncedValue;
}
