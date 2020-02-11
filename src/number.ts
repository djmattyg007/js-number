import BigNumber from "bignumber.js";
import { RoundingMode } from "./rounding";
import { numeric } from "./types";
import { arraySum, searchMapForBigNumber, searchObjectForBigNumber } from "./_util";

interface NamedRatios {
    [name: string]: number;
}

interface NamedNumMap {
    [name: string]: Num;
}

interface NamedBigNumMap {
    [name: string]: BigNumber;
}

export default class Num {
    public readonly num: BigNumber;

    public readonly integerPart: string;
    public readonly fractionalPart: string;

    public readonly isZero: boolean;

    public constructor(num: Num | numeric) {
        if (num instanceof Num) {
            this.num = num.num;
        } else if (num instanceof BigNumber) {
            this.num = num;
        } else {
            this.num = new BigNumber(num);
        }
        if (this.num.isFinite() === false) {
            throw new Error("Invalid number supplied.");
        }

        this.isZero = this.num.isZero();
        if (this.isZero === true && this.num.isNegative() === true) {
            // Normalise to "positive" zero, to avoid weirdness.
            // JS numbers (which BigNumber is emulating) can always be positive or
            // negative zero because they're always technically floating-point numbers.
            this.num = new BigNumber(0);
        }

        const numStr = this.num.toFixed();
        const numStrParts = numStr.split(".");

        this.integerPart = numStrParts[0];
        if (numStrParts.length === 2) {
            this.fractionalPart = numStrParts[1];
        } else {
            this.fractionalPart = "";
        }
    }

    public static convertToBigNum(num: Num | numeric): BigNumber {
        if (num instanceof Num) {
            return num.num;
        } else if (num instanceof BigNumber) {
            return num;
        } else {
            return new BigNumber(num);
        }
    }

    public toString(): string {
        if (this.fractionalPart.length > 0) {
            return `${this.integerPart}.${this.fractionalPart}`;
        } else {
            return this.integerPart;
        }
    }

    public toJSON(): string {
        return this.toString();
    }

    public get isInteger(): boolean {
        return this.num.isInteger() === true;
    }

    public get isDecimal(): boolean {
        return this.num.isInteger() === false;
    }

    public get isHalf(): boolean {
        return this.fractionalPart === "5";
    }

    public get isEven(): boolean {
        const lastDigit = this.integerPart.slice(-1);
        return parseInt(lastDigit) % 2 === 0;
    }

    public get isOdd(): boolean {
        const lastDigit = this.integerPart.slice(-1);
        return parseInt(lastDigit) % 2 !== 0;
    }

    public get isCloserToNext(): boolean {
        if (this.fractionalPart === "") {
            return false;
        }

        return parseInt(this.fractionalPart[0]) >= 5;
    }

    public get isPositive(): boolean {
        if (this.isZero === true) {
            return false;
        }

        return this.num.isPositive();
    }

    public get isNegative(): boolean {
        if (this.isZero === true) {
            return false;
        }

        return this.num.isNegative();
    }

    private getIntegerRoundingMultiplier(): 1 | -1 {
        if (this.num.isNegative() === true) {
            return -1;
        }

        return 1;
    }

    public compare(other: Num | numeric): number {
        if (other instanceof Num) {
            other = other.num;
        }

        return this.num.comparedTo(other);
    }

    public compareTo(other: Num | numeric): number {
        return this.compare(other);
    }

    public comparedTo(other: Num | numeric): number {
        return this.compare(other);
    }

    public equals(other: Num | numeric): boolean {
        if (other instanceof Num) {
            other = other.num;
        }

        return this.num.isEqualTo(other);
    }

    public equalTo(other: Num | numeric): boolean {
        return this.equals(other);
    }

    public equalsTo(other: Num | numeric): boolean {
        return this.equals(other);
    }

    public isEqualTo(other: Num | numeric): boolean {
        return this.equals(other);
    }

    public greaterThan(other: Num | numeric): boolean {
        if (other instanceof Num) {
            other = other.num;
        }

        return this.num.isGreaterThan(other);
    }

    public isGreaterThan(other: Num | numeric): boolean {
        return this.greaterThan(other);
    }

    public greaterThanOrEqual(other: Num | numeric): boolean {
        if (other instanceof Num) {
            other = other.num;
        }

        return this.num.isGreaterThanOrEqualTo(other);
    }

    public isGreaterThanOrEqualTo(other: Num | numeric): boolean {
        return this.greaterThanOrEqual(other);
    }

    public lessThan(other: Num | numeric): boolean {
        if (other instanceof Num) {
            other = other.num;
        }

        return this.num.isLessThan(other);
    }

    public isLessThan(other: Num | numeric): boolean {
        return this.lessThan(other);
    }

    public lessThanOrEqual(other: Num | numeric): boolean {
        if (other instanceof Num) {
            other = other.num;
        }

        return this.num.isLessThanOrEqualTo(other);
    }

    public isLessThanOrEqualTo(other: Num | numeric): boolean {
        return this.lessThanOrEqual(other);
    }

    public add(addend: Num | numeric): Num {
        if (addend instanceof Num) {
            addend = addend.num;
        }

        return new Num(this.num.plus(addend));
    }

    public plus(addend: Num | numeric): Num {
        return this.add(addend);
    }

    public static add(amount: Num | numeric, addends: Iterable<Num | numeric>): BigNumber {
        amount = Num.convertToBigNum(amount);

        for (const addend of addends) {
            if (addend instanceof Num) {
                amount = amount.plus(addend.num);
            } else {
                amount = amount.plus(addend);
            }
        }

        return amount;
    }

    public static plus(amount: Num | numeric, addends: Iterable<Num | numeric>): BigNumber {
        return Num.add(amount, addends);
    }

    public subtract(subtrahend: Num | numeric): Num {
        if (subtrahend instanceof Num) {
            subtrahend = subtrahend.num;
        }

        return new Num(this.num.minus(subtrahend));
    }

    public minus(subtrahend: Num | numeric): Num {
        return this.subtract(subtrahend);
    }

    public static subtract(amount: Num | numeric, subtrahends: Iterable<Num | numeric>): BigNumber {
        amount = Num.convertToBigNum(amount);

        for (const subtrahend of subtrahends) {
            if (subtrahend instanceof Num) {
                amount = amount.minus(subtrahend.num);
            } else {
                amount = amount.minus(subtrahend);
            }
        }

        return amount;
    }

    public static minus(amount: Num | numeric, subtrahends: Iterable<Num | numeric>): BigNumber {
        return Num.subtract(amount, subtrahends);
    }

    public multiply(multiplier: numeric): Num {
        return new Num(this.num.multipliedBy(multiplier));
    }

    public times(multiplier: numeric): Num {
        return this.multiply(multiplier);
    }

    public multipliedBy(multiplier: numeric): Num {
        return this.multiply(multiplier);
    }

    public divide(divisor: numeric): Num {
        const bigDivisor = Num.convertToBigNum(divisor);
        if (bigDivisor.isZero() === true) {
            throw new Error("Cannot divide by zero.");
        }

        return new Num(this.num.dividedBy(divisor));
    }

    public dividedBy(divisor: numeric): Num {
        return this.divide(divisor);
    }

    public percentage(percent: number): Num {
        if (percent < 0 || percent > 100) {
            throw new RangeError("Percentage values must be between 0 and 100.");
        }

        return this.multiply(percent / 100);
    }

    public percent(percent: number): Num {
        return this.percentage(percent);
    }

    public subtractPercentage(percent: number): Num {
        return new Num(Num.subtractPercent(this.num, percent));
    }

    public subtractPercent(percent: number): Num {
        return this.subtractPercentage(percent);
    }

    public static subtractPercent(amount: Num | numeric, percent: number): BigNumber {
        if (percent < 0 || percent > 100) {
            throw new RangeError("Percentage values must be between 0 and 100.");
        }

        amount = Num.convertToBigNum(amount);

        const percentage = amount.multipliedBy(percent / 100);
        return amount.minus(percentage);
    }

    public ceil(): Num {
        return this.round(RoundingMode.ROUND_UP);
    }

    public floor(): Num {
        return this.round(RoundingMode.ROUND_DOWN);
    }

    public absolute(): Num {
        return new Num(this.num.abs());
    }

    public abs(): Num {
        return this.absolute();
    }

    public round(roundingMode: RoundingMode = RoundingMode.ROUND_HALF_UP): Num {
        return new Num(this._round(roundingMode));
    }

    public roundToDecimalPlaces(places: number, roundingMode: RoundingMode = RoundingMode.ROUND_HALF_UP): Num {
        return new Num(this._decimalPlaces(places, roundingMode));
    }

    public *allocate(ratios: number[]): Generator<Num> {
        for (const bigNum of Num.allocate(this.num, ratios)) {
            yield new Num(bigNum);
        }
    }

    public static allocate(amount: Num | numeric, ratios: number[]): Iterable<BigNumber> {
        if (ratios.length === 0) {
            throw new Error("Cannot allocate to none, ratios cannot be an empty array.");
        }

        amount = Num.convertToBigNum(amount);

        let remainder = amount;
        const results = new Map<number, BigNumber>();
        const total = arraySum(ratios);

        if (total <= 0) {
            throw new Error("Cannot allocate to none, sum of ratios must be greater than zero.");
        }

        for (const [key, ratio] of ratios.entries()) {
            if (ratio < 0) {
                throw new Error("Cannot allocate to none, ratio must be zero or positive.");
            }

            const share = Num.share(amount, ratio, total);
            results.set(key, share);
            remainder = remainder.minus(share);
        }

        if (remainder.isZero() === true) {
            return results.values();
        }

        const fractionsMap = new Map<number, BigNumber>();
        for (const [idx, ratio] of ratios.entries()) {
            const share = amount.multipliedBy(ratio / total);
            const fraction = share.minus(share.integerValue(BigNumber.ROUND_FLOOR));
            fractionsMap.set(idx, fraction);
        };

        while (remainder.isZero() === false) {
            const index = fractionsMap.size > 0 ? searchMapForBigNumber(fractionsMap, BigNumber.max(...fractionsMap.values())) : 0;
            const match = results.get(index) as BigNumber;
            results.set(index, match.plus(1));
            remainder = remainder.minus(1);
            fractionsMap.delete(index);
        }

        return results.values();
    }

    public allocateNamed(ratios: NamedRatios): NamedNumMap {
        const namedBigNumMap = Num.allocateNamed(this.num, ratios);

        const namedNumMap: NamedNumMap = {};
        for (const [name, bigNum] of Object.entries(namedBigNumMap)) {
            namedNumMap[name] = new Num(bigNum);
        }

        return namedNumMap;
    }

    public static allocateNamed(amount: Num | numeric, ratios: NamedRatios): NamedBigNumMap {
        if (Object.keys(ratios).length === 0) {
            throw new Error("Cannot allocate to none, ratios must be an empty array.");
        }

        amount = Num.convertToBigNum(amount);

        let remainder = amount;
        const results: NamedBigNumMap = {};
        const total = arraySum(Object.values(ratios));

        if (total <= 0) {
            throw new Error("Cannot allocate to none, sum of ratios must be greater than zero.");
        }

        for (const [key, ratio] of Object.entries(ratios)) {
            if (ratio < 0) {
                throw new Error("Cannot allocate to none, ratio must be zero or positive.");
            }

            const share = Num.share(amount, ratio, total);
            results[key] = share;
            remainder = remainder.minus(share);
        }

        if (remainder.isZero() === true) {
            return results;
        }

        const fractions: NamedBigNumMap = {};
        for (const [key, ratio] of Object.entries(ratios)) {
            const share = amount.multipliedBy(ratio / total);
            const fraction = share.minus(share.integerValue(BigNumber.ROUND_FLOOR));
            fractions[key] = fraction;
        }

        while (remainder.isZero() === false) {
            // TODO: I don't know how this is supposed to handle the case where Object.keys(fractions).length === 0 for named allocations
            const index = Object.keys(fractions).length > 0 ? searchObjectForBigNumber(fractions, BigNumber.max(...Object.values(fractions))) : 0;
            const match = results[index];
            results[index] = match.plus(1);
            remainder = remainder.minus(1);
            delete fractions[index];
        }

        return results;
    }

    public *allocateTo(n: number): Generator<Num> {
        for (const bigNum of Num.allocateTo(this.num, n)) {
            yield new Num(bigNum);
        }
    }

    public static allocateTo(amount: Num | numeric, n: number): Iterable<BigNumber> {
        if (Number.isInteger(n) === false) {
            throw new Error("Number of targets must be an integer.");
        }

        if (n <= 0) {
            throw new Error("Cannot allocate to none, target count must be greater than zero.");
        }

        const ratios: number[] = [];
        ratios.length = n;
        ratios.fill(1, 0, n);
        return Num.allocate(amount, ratios);
    }

    public share(ratio: numeric, total: numeric): Num {
        return new Num(Num.share(this.num, ratio, total));
    }

    public static share(amount: Num | numeric, ratio: numeric, total: numeric): BigNumber {
        amount = Num.convertToBigNum(amount);

        // floor(amount * ratio / total)
        return amount.multipliedBy(ratio).dividedBy(total).integerValue(BigNumber.ROUND_FLOOR);
    }

    public negative(): Num {
        return new Num(this.num.negated());
    }

    public negate(): Num {
        return this.negative();
    }

    public negated(): Num {
        return this.negative();
    }

    public mod(divisor: Num | numeric): Num {
        if (divisor instanceof Num) {
            divisor = divisor.num;
        }

        return new Num(this.num.mod(divisor));
    }

    public modulo(divisor: Num | numeric): Num {
        return this.mod(divisor);
    }

    public ratioOf(other: Num): Num {
        return new Num(Num.ratioOf(this.num, other.num));
    }

    public static ratioOf(amount: Num | numeric, other: Num | numeric): BigNumber {
        amount = Num.convertToBigNum(amount);
        other = Num.convertToBigNum(other);

        if (other.isZero() === true) {
            throw new Error("Cannot calculate a ratio of zero.");
        }

        return amount.dividedBy(other);
    }

    public shiftRight(n: number): Num {
        return new Num(Num.shiftRight(this.num, n));
    }

    public static shiftRight(amount: Num | numeric, n: number): BigNumber {
        if (Number.isInteger(n) === false) {
            throw new Error("Can only shift by whole number amounts.");
        }

        amount = Num.convertToBigNum(amount);

        return amount.shiftedBy(n);
    }

    public shiftLeft(n: number): Num {
        return new Num(Num.shiftLeft(this.num, n));
    }

    public static shiftLeft(amount: Num | numeric, n: number): BigNumber {
        if (Number.isInteger(n) === false) {
            throw new Error("Can only shift by whole number amounts.");
        }

        amount = Num.convertToBigNum(amount);

        return amount.shiftedBy(-n);
    }

    public static min(...collection: (Num | numeric)[]): Num {
        if (collection.length === 0) {
            throw new Error("Must pass at least one number.");
        }

        const operands: numeric[] = [];
        for (const entity of collection) {
            if (entity instanceof Num) {
                operands.push(entity.num);
            } else {
                operands.push(entity);
            }
        }

        return new Num(BigNumber.min(...operands));
    }

    public static max(...collection: (Num | numeric)[]): Num {
        if (collection.length === 0) {
            throw new Error("Must pass at least one number.");
        }

        const operands: numeric[] = [];
        for (const entity of collection) {
            if (entity instanceof Num) {
                operands.push(entity.num);
            } else {
                operands.push(entity);
            }
        }

        return new Num(BigNumber.max(...operands));
    }

    public static sum(...collection: (Num | numeric)[]): Num {
        if (collection.length === 0) {
            throw new Error("Must pass at least one number.");
        }

        const first = collection.shift() as Num | numeric;
        return new Num(Num.add(first, collection));
    }

    public static avg(...collection: (Num | numeric)[]): Num {
        const argCount = collection.length;
        if (argCount === 0) {
            throw new Error("Must pass at least one number.");
        }

        const first = collection.shift() as Num | numeric;
        const sum = Num.add(first, collection);
        return new Num(sum.dividedBy(argCount));
    }

    private _round(roundingMode: RoundingMode): BigNumber {
        switch (roundingMode) {
            case RoundingMode.ROUND_UP:
                return this.num.integerValue(BigNumber.ROUND_CEIL);
            case RoundingMode.ROUND_DOWN:
                return this.num.integerValue(BigNumber.ROUND_FLOOR);
            case RoundingMode.ROUND_TRUNCATE:
                return new BigNumber(this.integerPart);
        }

        if (this.isHalf === false) {
            return this.num.integerValue(BigNumber.ROUND_HALF_UP);
        }

        switch (roundingMode) {
            case RoundingMode.ROUND_HALF_UP:
                return this.num.integerValue(BigNumber.ROUND_HALF_UP);
            case RoundingMode.ROUND_HALF_DOWN:
                return this.num.integerValue(BigNumber.ROUND_HALF_DOWN);
            case RoundingMode.ROUND_HALF_EVEN:
                return this.num.integerValue(BigNumber.ROUND_HALF_EVEN);
            case RoundingMode.ROUND_HALF_POSITIVE_INFINITY:
                return this.num.integerValue(BigNumber.ROUND_HALF_CEIL);
            case RoundingMode.ROUND_HALF_NEGATIVE_INFINITY:
                return this.num.integerValue(BigNumber.ROUND_HALF_FLOOR);
        }

        if (roundingMode === RoundingMode.ROUND_HALF_ODD) {
            const truncated = this._round(RoundingMode.ROUND_TRUNCATE);
            if (this.isOdd === true) {
                return truncated;
            }
            return truncated.plus(this.getIntegerRoundingMultiplier());
        }

        throw new Error("Unrecognised rounding mode.");
    }

    private _decimalPlaces(places: number, roundingMode: RoundingMode): BigNumber {
        if (Number.isInteger(places) === false || places < 0) {
            throw new Error("Number of decimal places must be a positive integer.");
        }

        switch (roundingMode) {
            case RoundingMode.ROUND_HALF_UP:
                return this.num.decimalPlaces(places, BigNumber.ROUND_HALF_UP);
            case RoundingMode.ROUND_HALF_DOWN:
                return this.num.decimalPlaces(places, BigNumber.ROUND_HALF_DOWN);
            case RoundingMode.ROUND_HALF_EVEN:
                return this.num.decimalPlaces(places, BigNumber.ROUND_HALF_EVEN);
            case RoundingMode.ROUND_UP:
                return this.num.decimalPlaces(places, BigNumber.ROUND_CEIL);
            case RoundingMode.ROUND_DOWN:
                return this.num.decimalPlaces(places, BigNumber.ROUND_FLOOR);
            case RoundingMode.ROUND_HALF_POSITIVE_INFINITY:
                return this.num.decimalPlaces(places, BigNumber.ROUND_HALF_CEIL);
            case RoundingMode.ROUND_HALF_NEGATIVE_INFINITY:
                return this.num.decimalPlaces(places, BigNumber.ROUND_HALF_FLOOR);
            case RoundingMode.ROUND_TRUNCATE:
                if (this.fractionalPart.length > 0) {
                    return new BigNumber(`${this.integerPart}.${this.fractionalPart.substr(0, places)}`);
                } else {
                    return new BigNumber(this.integerPart);
                }
        }

        if (roundingMode === RoundingMode.ROUND_HALF_ODD) {
            if (places === 0) {
                return this._round(RoundingMode.ROUND_HALF_ODD);
            }

            const rounded = this.num.toFixed(places + 1, BigNumber.ROUND_HALF_UP);
            const lastDigit = parseInt(rounded.slice(-1));
            const secondLastDigit = parseInt(rounded.slice(-2, -1));
            if (lastDigit > 5) {
                return new BigNumber(rounded.slice(0, -2) + (secondLastDigit + 1));
            } else if (lastDigit < 5) {
                return new BigNumber(rounded.slice(0, -1));
            } else {
                if (secondLastDigit % 2 === 0) {
                    return new BigNumber(rounded.slice(0, -2) + (secondLastDigit + 1));
                } else {
                    return new BigNumber(rounded.slice(0, -1));
                }
            }
        }

        throw new Error("Unrecognised rounding mode.");
    }
}
