import { act, renderHook } from '@testing-library/react';
import useSearchableList from '../index';

describe('useSearchableList', () => {
  type exampleType = {
    firstname: string;
    surname: string;
  };

  const example: exampleType[] = [
    { firstname: 'Foo', surname: 'Bar' },
    { firstname: 'Bruce', surname: 'Wayne' },
    { firstname: 'Bill', surname: 'Weasely' },
    { firstname: 'Scooby', surname: 'Doo' },
    { firstname: 'Albert', surname: 'Wesker' }
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

  it('should return 2 objects using first letter check', () => {
    const { result } = renderHook(() =>
      useSearchableList<exampleType>('firstname', {
        clearOnEmpty: false,
        debounce: false
      })
    );

    act(() => {
      result.current[1](example);
      result.current[2]('b');
    });

    const expectedResult = [
      { firstname: 'Bruce', surname: 'Wayne' },
      { firstname: 'Bill', surname: 'Weasely' }
    ];

    expect(result.current[0]).toEqual(expectedResult);
  });

  it('should return 4 objects NOT using first letter check', () => {
    const { result } = renderHook(() =>
      useSearchableList<exampleType>('firstname', {
        clearOnEmpty: false,
        firstLetterCheck: false,
        debounce: false
      })
    );

    act(() => {
      result.current[1](example);
      result.current[2]('b');
    });

    const expectedResult = [
      { firstname: 'Bruce', surname: 'Wayne' },
      { firstname: 'Bill', surname: 'Weasely' },
      { firstname: 'Scooby', surname: 'Doo' },
      { firstname: 'Albert', surname: 'Wesker' }
    ];

    expect(result.current[0]).toEqual(expectedResult);
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
