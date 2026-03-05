import { useState, useEffect } from 'react';

/**
 * Retarde la mise à jour d'une valeur.
 * Utile pour éviter les appels API à chaque frappe.
 *
 * Usage:
 *   const debouncedSearch = useDebounce(search, 400);
 *   useEffect(() => { loadData(debouncedSearch); }, [debouncedSearch]);
 */
export default function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
