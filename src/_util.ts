export function arraySum(arr: number[]): number {
    let sum = 0;

    for (const num of arr) {
        sum += num;
    }

    return sum;
};

export function mapKeysWithSearch<T>(map: Map<number, T>, search: T, strict: boolean = false): number[] {
    const mapKeys = [];

    for (const [key, val] of map.entries()) {
        const check = strict === true ? val === search : val == search;
        if (check === true) {
            mapKeys.push(key);
        }
    }

    return mapKeys;
};

interface GenericObj<T> {
    [key: string]: T;
}

export function objectKeysWithSearch<T>(obj: GenericObj<T>, search: T, strict: boolean = false): Array<keyof GenericObj<T>> {
    const objKeys = [];

    for (const [key, val] of Object.entries(obj)) {
        const check = strict === true ? val === search : val == search;
        if (check === true) {
            objKeys.push(key);
        }
    }

    return objKeys;
};
