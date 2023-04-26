import { act, renderHook } from '@testing-library/react';
import useSearchableList from '../src/index';

describe('useSearchableList', () => {
    type exampleType = {
        firstname: string;
        surname: string;
    };

    const example: exampleType[] = [
        { firstname: 'Foo', surname: 'Bar' },
        { firstname: 'Bruce', surname: 'Wayne' },
        { firstname: 'Scooby', surname: 'Doo' }
    ];

    it('should filter data based on search term', () => {
        const { result } = renderHook(() =>
            useSearchableList<exampleType>('firstname', { clearOnEmpty: false, debounce: false })
        );

        act(() => {
            result.current[1](example);
            result.current[2]('F');
        });

        expect(result.current[0]).toEqual([{ firstname: 'Foo', surname: 'Bar' }]);
    });

    it('should filter data based on search term with debounce, wait for debounce', () => {
        const { result } = renderHook(() =>
            useSearchableList<exampleType>('firstname', {
                clearOnEmpty: false,
                debounce: true,
                delay: 100
            })
        );

        act(() => {
            result.current[1](example);
            result.current[2]('Br');
        });

        setTimeout(() => {
            expect(result.current[0]).toEqual([{ firstname: 'Bruce', surname: 'Wayne' }]);
        }, 101);
    });

    it('should not data based on search term before debounce has happened', () => {
        const { result } = renderHook(() =>
            useSearchableList<exampleType>('firstname', {
                clearOnEmpty: false,
                debounce: true,
                delay: 100
            })
        );

        act(() => {
            result.current[1](example);
            result.current[2]('Br');
        });
        expect(result.current[0]).toEqual(example);
    });
});
