import { useState, useEffect, useMemo } from 'react';

type Primitive = string | number | boolean;

type Props = {
    clearOnEmpty?: boolean;
    debounce?: boolean;
    delay?: number;
};

const defaults: Props = {
    clearOnEmpty: false,
    debounce: true,
    delay: 300
};

type SearchableListItem = {
    [key: string]: Primitive | unknown;
};

export type UseSearchableListHook<T extends SearchableListItem> = [
    T[],
    (value: T[]) => void,
    (value: Primitive) => void
];

const useSearchableList = <T extends SearchableListItem>(
    property: keyof T,
    props: Props = defaults
): UseSearchableListHook<T> => {
    const { clearOnEmpty, debounce, delay } = useMemo(() => ({ ...defaults, ...props }), [props]);

    if (!isPrimitive(property)) {
        throw new Error('Invalid property used to filter. Only primitive types are allowed.');
    }

    const [origin, setOrigin] = useState<T[]>([]);
    const [state, setState] = useState<T[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [initialized, setInitialized] = useState<boolean>(false);

    const setValue = (value: T[]) => {
        setOrigin(value);
        setState(value);
    };

    const filter = (value: Primitive) => {
        setSearchTerm(value.toString());
    };

    useEffect(() => {
        if (initialized) {
            if (debounce) {
                const delayTimeout = setTimeout(() => {
                    applyFilter();
                }, delay);

                return () => clearTimeout(delayTimeout);
            } else {
                applyFilter();
            }
        } else {
            setState(origin);
            setInitialized(true);
        }
    }, [searchTerm]);

    const applyFilter = () => {
        if (searchTerm === '' || searchTerm === undefined) {
            reset();
        } else if (searchTerm.length === 1) {
            const filteredList = origin.filter((element: T) => {
                const propertyValue = element[property];
                return (
                    isPrimitive(propertyValue) &&
                    propertyValue.toString().toLowerCase().startsWith(searchTerm.toLowerCase())
                );
            });
            setState(filteredList);
        } else {
            const filteredList = origin.filter((element: T) => {
                const propertyValue = element[property];
                return (
                    isPrimitive(propertyValue) &&
                    propertyValue.toString().toLowerCase().includes(searchTerm.toLowerCase())
                );
            });
            setState(filteredList);
        }
    };

    const reset = () => {
        if (clearOnEmpty) {
            setState([]);
        } else {
            setState(origin);
        }
    };

    return [state, setValue, filter];
};

const isPrimitive = (value: unknown): value is Primitive => {
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean';
};

export default useSearchableList;
