import BigNumber from "bignumber.js";
import { numeric } from "./types";

export function arraySum(arr: ReadonlyArray<number>): number {
    let sum = 0;

    for (const num of arr) {
        sum += num;
    }

    return sum;
};

export function searchMapForBigNumber(map: Map<number, BigNumber>, search: numeric): number {
    for (const [key, val] of map.entries()) {
        if (val.isEqualTo(search)) {
            return key;
        }
    }

    throw new Error("Map search value not found.");
};

interface GenericObj<T = BigNumber> {
    [key: string]: T;
}

export function searchObjectForBigNumber(obj: GenericObj<BigNumber>, search: numeric): keyof GenericObj<BigNumber> {
    for (const [key, val] of Object.entries(obj)) {
        if (val.isEqualTo(search)) {
            return key;
        }
    }

    throw new Error("Object search value not found.");
};
