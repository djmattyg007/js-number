/// <reference path = "../src/alsatian-ambient.d.ts" />
import { TestFixture, Test, TestCases, Expect } from "alsatian";

import type BigNumber from "bignumber.js";

import Num from "src/number";
import { RoundingMode } from "src/rounding";
import { numeric } from "src/types";

import { roundExamples, roundToDecimalPlacesExamples } from "fixtures/rounding";
import { sumExamples, minExamples, maxExamples, avgExamples } from "fixtures/aggregate";

const DEFAULT_AMOUNT = 10;

@TestFixture("Number")
export default class NumTest {
    @Test("it normalises negative zero")
    public itNormalisesNegativeZero() {
        const num = new Num(-0);
        Expect(num).toBe(new Num(0));
        Expect(num.toString()).toBe("0");
        Expect(num.integerPart).toBe("0");
        Expect(num.fractionalPart).toBe("");
        Expect(num).toBeZero();
        Expect(num).not.toBePositive();
        Expect(num).toBePositiveOrZero();
        Expect(num).not.toBeNegative();
        Expect(num).toBeNegativeOrZero();
    }

    @Test("it accepts instances of the underlying BigNumber class")
    public itAcceptsBigNumberInstances() {
        const plainNum = new Num(42);

        const bigNum = new Num.BigNumber(42);
        const bigNumNum = new Num(bigNum);
        Expect(bigNumNum).toBe(plainNum);
    }

    @Test("it converts all numbers to bignumbers")
    public itConvertsAllNumbersToBigNumbers() {
        const actualNum = new Num(5);
        const actualNumBigNum = Num.convertToBigNum(actualNum);
        Expect(actualNumBigNum instanceof Num.BigNumber).toBe(true);
        Expect(actualNumBigNum.toString()).toBe("5");

        const bigNum = new Num.BigNumber(7);
        const bigNumBigNum = Num.convertToBigNum(bigNum);
        Expect(bigNumBigNum instanceof Num.BigNumber).toBe(true);
        Expect(bigNum === bigNumBigNum).toBe(true);
        Expect(bigNumBigNum.toString()).toBe("7");

        const numberNum = 12;
        const numberNumBigNum = Num.convertToBigNum(numberNum);
        Expect(numberNumBigNum instanceof Num.BigNumber).toBe(true);
        Expect(numberNumBigNum.toString()).toBe("12");

        const stringNum = "21";
        const stringNumBigNum = Num.convertToBigNum(stringNum);
        Expect(stringNumBigNum instanceof Num.BigNumber).toBe(true);
        Expect(stringNumBigNum.toString()).toBe("21");
    }

    @TestCases(NumTest.invalidNumberExamples)
    @Test("it disallows invalid number values")
    public itDisallowsInvalidNumberValues(value: any) {
        const throwFn = () => new Num(value);
        Expect(throwFn).toThrowError(Error, "Invalid number supplied.");
    }

    @TestCases(NumTest.invalidNumberExamples)
    @Test("it disallows converting to bignumbers from invalid number values")
    public itDisallowsConvertingToBigNumberFromInvalidNumberValues(value: any) {
        const throwFn = () => Num.convertToBigNum(value);
        Expect(throwFn).toThrowError(Error, "Invalid number supplied.");
    }

    public static invalidNumberExamples() {
        const badValues: any[] = [NaN, Infinity, -Infinity, "bad", "", true, false];
        const badNumbers: any[] = [
            '123456789012345678-123456',
            '---123',
            '123456789012345678+13456',
            '-123456789012345678.-13456',
            '+123456789012345678.+13456',
        ];
        return ([] as any[]).concat(badValues, badNumbers).map((val: any) => [val]);
    }

    @Test("it accepts other Num instances during construction")
    public itAcceptsOtherNumInstances() {
        const num1 = new Num(123);
        const num2 = new Num(num1);

        Expect(num2 instanceof Num).toBeTruthy();
        Expect(num2.toString()).toBe("123");
        Expect(num2).toBe(num1);
    }

    @Test("it generates random numbers")
    public itGeneratesRandomNumbers() {
        for (let x = 1; x < 10; x++) {
            const num = Num.random(x);
            Expect(num.fractionalPart.length <= x).toBeTruthy();
            if (num.fractionalPart.length > 0) {
                Expect(num).toBeADecimal();
            } else {
                Expect(num).toBeAnInteger();
            }
        }
    }

    @Test("it generates random integers")
    public itGeneratesRandomIntegers() {
        const randomNum1 = Num.randomInt(1, 10);

        Expect(randomNum1 instanceof Num).toBeTruthy();
        Expect(randomNum1).toBeAnInteger();
        Expect(randomNum1).toBeGreaterThan(new Num(0));
        Expect(randomNum1).toBeLessThan(new Num(11));

        const randomNum2 = Num.randomInt(Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        Expect(randomNum2 instanceof Num).toBeTruthy();
        Expect(randomNum2).toBeAnInteger();
    }

    @TestCases(NumTest.equalityExamples)
    @Test("it equals to another number")
    public itEqualsToAnotherNumber(amount: number, equality: boolean) {
        const checkFn = (num: Num, otherNum: Num | BigNumber | number): void => {
            Expect(num.equals(otherNum)).toBe(equality);
            Expect(num.equalTo(otherNum)).toBe(equality);
            Expect(num.equalsTo(otherNum)).toBe(equality);
            Expect(num.isEqualTo(otherNum)).toBe(equality);
        };

        const num = new Num(DEFAULT_AMOUNT);
        checkFn(num, amount);
        checkFn(num, new Num(amount));
        checkFn(num, new Num.BigNumber(amount));
    }

    public static equalityExamples() {
        return [
            [DEFAULT_AMOUNT, true],
            [DEFAULT_AMOUNT + 1, false],
            [DEFAULT_AMOUNT - 1, false],
            [String(DEFAULT_AMOUNT), true],
            [String(DEFAULT_AMOUNT) + ".000", true],
        ];
    }

    @TestCases(NumTest.comparisonExamples)
    @Test("it compares two numbers")
    public itComparesTwoNumbers(otherAmount: number, result: number) {
        const checkFn = (num: Num, otherNum: Num | BigNumber | number): void => {
            Expect(num.compare(otherNum)).toBe(result);
            Expect(num.compareTo(otherNum)).toBe(result);
            Expect(num.comparedTo(otherNum)).toBe(result);

            Expect(num.greaterThan(otherNum)).toBe(result === 1);
            Expect(num.isGreaterThan(otherNum)).toBe(result === 1);

            Expect(num.greaterThanOrEqual(otherNum)).toBe(result >= 0);
            Expect(num.isGreaterThanOrEqualTo(otherNum)).toBe(result >= 0);

            Expect(num.lessThan(otherNum)).toBe(result === -1);
            Expect(num.isLessThan(otherNum)).toBe(result === -1);

            Expect(num.lessThanOrEqual(otherNum)).toBe(result <= 0);
            Expect(num.isLessThanOrEqualTo(otherNum)).toBe(result <= 0);
        };

        const num = new Num(DEFAULT_AMOUNT);
        const otherNum = new Num(otherAmount);
        checkFn(num, otherNum);
        if (result === 0) {
            Expect(num).toBe(otherNum);
        } else {
            Expect(num).not.toBe(otherNum);
        }

        checkFn(num, otherAmount);
        checkFn(num, new Num(otherAmount));
        checkFn(num, new Num.BigNumber(otherAmount));
    }

    public static comparisonExamples() {
        return [
            [DEFAULT_AMOUNT, 0],
            [DEFAULT_AMOUNT - 1, 1],
            [DEFAULT_AMOUNT - 10, 1],
            [DEFAULT_AMOUNT + 1, -1],
            [DEFAULT_AMOUNT + 10, -1],
        ];
    }

    @TestCases(NumTest.isCloserToNextExamples)
    @Test("it checks if number is closer to the next integer")
    public isCloserToNext(amount: numeric, isCloser: boolean) {
        const num = new Num(amount);
        if (isCloser) {
            Expect(num).toBeCloserToNext();
        } else {
            Expect(num).not.toBeCloserToNext();
        }
    }

    public static isCloserToNextExamples() {
        return [
            ["123", false],
            ["123.0", false],
            ["123.4", false],
            ["123.5", true],
            ["123.50", true],
            ["123.50001", true],
            ["123.6", true],
            ["123.000001", false],
            ["123.01", false],
            ["123.05", false],
            ["123.09", false],
            ["123.9", true],
            ["123.99999", true],
            ["124", false],
        ];
    }

    @TestCases(NumTest.addExamples)
    @Test("it adds numbers")
    public itAddsNumbers(addend: number, result1: string, result2: string) {
        const num = new Num(DEFAULT_AMOUNT);
        const result1Num = num.add(addend);
        const result2Num = result1Num.add(addend);

        Expect(result1Num instanceof Num).toBeTruthy();
        Expect(result1Num).toBe(new Num(result1));
        Expect(result1Num.toString()).toBe(result1);
        Expect(result2Num instanceof Num).toBeTruthy();
        Expect(result2Num).toBe(new Num(result2));
        Expect(result2Num.toString()).toBe(result2);

        const result1NumAlt = (new Num(addend)).add(DEFAULT_AMOUNT);
        const result2NumAlt = (new Num(addend)).add(result1NumAlt);

        Expect(result1NumAlt instanceof Num).toBeTruthy();
        Expect(result1NumAlt).toBe(result1Num);
        Expect(result1NumAlt).toBe(new Num(result1));
        Expect(result1NumAlt.toString()).toBe(result1);
        Expect(result2NumAlt instanceof Num).toBeTruthy();
        Expect(result2NumAlt).toBe(result2Num);
        Expect(result2NumAlt).toBe(new Num(result2));
        Expect(result2NumAlt.toString()).toBe(result2);
    }

    public static addExamples() {
        return [
            [0, '10', '10'],
            [5, '15', '20'],
            [10, '20', '30'],
            [100, '110', '210'],
            [-0, '10', '10'],
            [-5, '5', '0'],
            [-50, '-40', '-90'],
        ];
    }

    @TestCases(NumTest.staticAddExamples)
    @Test("it statically adds lots of numbers")
    public itStaticallyAddsNumbers(startValue: Num | numeric, addends: Iterable<Num | numeric>, expected: string) {
        const checkFn = (result: BigNumber): void => {
            Expect(result instanceof Num.BigNumber).toBeTruthy();
            Expect(result.toFixed()).toBe(expected);
        };

        const addResult = Num.add(startValue, addends);
        checkFn(addResult);

        const plusResult = Num.plus(startValue, addends);
        checkFn(plusResult);
    }

    public static staticAddExamples() {
        return [
            [0, [1, 2, 3], "6"],
            [new Num(0), [1, 2, 3], "6"],
            [new Num.BigNumber(0), [1, 2, 3], "6"],
            [0, [1, new Num(2), new Num.BigNumber(3)], "6"],
            [new Num(0), [1, new Num(2), new Num.BigNumber(3)], "6"],
            [new Num.BigNumber(0), [1, new Num(2), new Num.BigNumber(3)], "6"],
            [5, [2.5, 5, 7.5], "20"],
            [new Num(5), [2.5, 5, 7.5], "20"],
            [new Num.BigNumber(5), [2.5, 5, 7.5], "20"],
            [5, [new Num.BigNumber(2.5), 5, new Num(7.5)], "20"],
            [new Num(5), [new Num.BigNumber(2.5), 5, new Num(7.5)], "20"],
            [new Num.BigNumber(5), [new Num.BigNumber(2.5), 5, new Num(7.5)], "20"],
            [1.5, [2.25], "3.75"],
            [new Num(1.5), [2.25], "3.75"],
            [new Num.BigNumber(1.5), [2.25], "3.75"],
            [1.5, [new Num(2.25)], "3.75"],
            [new Num(1.5), [new Num(2.25)], "3.75"],
            [new Num.BigNumber(1.5), [new Num(2.25)], "3.75"],
            [1.5, [new Num.BigNumber(2.25)], "3.75"],
            [new Num(1.5), [new Num.BigNumber(2.25)], "3.75"],
            [new Num.BigNumber(1.5), [new Num.BigNumber(2.25)], "3.75"],
            [42, [], "42"],
        ];
    }

    @TestCases(NumTest.subtractExamples)
    @Test("it subtracts numbers")
    public itSubtractsNumbers(subtrahend: number, result1: string, result2: string, result1Alt: string) {
        const num = new Num(DEFAULT_AMOUNT);
        const result1Num = num.subtract(subtrahend);
        const result2Num = result1Num.subtract(subtrahend);

        Expect(result1Num instanceof Num).toBeTruthy();
        Expect(result1Num).toBe(new Num(result1));
        Expect(result1Num.toString()).toBe(result1);
        Expect(result2Num instanceof Num).toBeTruthy();
        Expect(result2Num).toBe(new Num(result2));
        Expect(result2Num.toString()).toBe(result2);

        const result1NumAlt = (new Num(subtrahend)).subtract(DEFAULT_AMOUNT);
        const result2NumAlt = (new Num(subtrahend)).subtract(result1NumAlt);

        Expect(result1NumAlt instanceof Num).toBeTruthy();
        Expect(result1NumAlt).toBe(new Num(result1Alt));
        Expect(result1NumAlt.toString()).toBe(result1Alt);
        Expect(result2NumAlt instanceof Num).toBeTruthy();
        Expect(result2NumAlt).toBe(new Num(DEFAULT_AMOUNT));
        Expect(result2NumAlt.toString()).toBe(String(DEFAULT_AMOUNT));
    }

    public static subtractExamples() {
        return [
            [0, '10', '10', '-10'],
            [5, '5', '0', '-5'],
            [10, '0', '-10', '0'],
            [100, '-90', '-190', '90'],
            [-0, '10', '10', '-10'],
            [-5, '15', '20', '-15'],
            [-50, '60', '110', '-60'],
        ];
    }

    @TestCases(NumTest.staticSubtractExamples)
    @Test("it statically subtracts lots of numbers")
    public itStaticallySubtractsNumbers(startValue: Num | numeric, subtrahends: Iterable<Num | numeric>, expected: string) {
        const checkFn = (result: BigNumber): void => {
            Expect(result instanceof Num.BigNumber).toBeTruthy();
            Expect(result.toFixed()).toBe(expected);
        };

        const subtractResult = Num.subtract(startValue, subtrahends);
        checkFn(subtractResult);

        const minusResult = Num.minus(startValue, subtrahends);
        checkFn(minusResult);
    }

    public static staticSubtractExamples() {
        return [
            [0, [1, 2, 3], "-6"],
            [new Num(0), [1, 2, 3], "-6"],
            [new Num.BigNumber(0), [1, 2, 3], "-6"],
            [0, [1, new Num(2), new Num.BigNumber(3)], "-6"],
            [new Num(0), [1, new Num(2), new Num.BigNumber(3)], "-6"],
            [new Num.BigNumber(0), [1, new Num(2), new Num.BigNumber(3)], "-6"],
            [5, [2.5, 5, 7.5], "-10"],
            [new Num(5), [2.5, 5, 7.5], "-10"],
            [new Num.BigNumber(5), [2.5, 5, 7.5], "-10"],
            [5, [new Num.BigNumber(2.5), 5, new Num(7.5)], "-10"],
            [new Num(5), [new Num.BigNumber(2.5), 5, new Num(7.5)], "-10"],
            [new Num.BigNumber(5), [new Num.BigNumber(2.5), 5, new Num(7.5)], "-10"],
            [1.5, [2.25], "-0.75"],
            [new Num(1.5), [2.25], "-0.75"],
            [new Num.BigNumber(1.5), [2.25], "-0.75"],
            [1.5, [new Num(2.25)], "-0.75"],
            [new Num(1.5), [new Num(2.25)], "-0.75"],
            [new Num.BigNumber(1.5), [new Num(2.25)], "-0.75"],
            [1.5, [new Num.BigNumber(2.25)], "-0.75"],
            [new Num(1.5), [new Num.BigNumber(2.25)], "-0.75"],
            [new Num.BigNumber(1.5), [new Num.BigNumber(2.25)], "-0.75"],
            [42, [], "42"],
        ];
    }

    // TODO: Introduce property-based testing for this test
    @TestCases(NumTest.constantNumberExamples)
    @Test("it multiplies the amount")
    public itMultipliesTheAmount(multiplier: Num | number) {
        const oneNum = new Num(1);
        const tenNum = new Num(10);

        const checkFunc = (numOne: Num, numTen: Num): void => {
            Expect(numOne).toBe(new Num(multiplier));
            Expect(numOne.toString()).toBe(String(multiplier));

            Expect(numTen).toBe(numOne.shiftRight(1));
            Expect(numOne).toBe(numTen.shiftLeft(1));
        };

        const compare = (num1: Num, num2: Num): void => {
            Expect(num1).toBe(num2);
            Expect(num2).toBe(num1);
        };

        const multipliedOne = oneNum.multiply(multiplier);
        const multipliedTen = tenNum.multiply(multiplier);
        checkFunc(multipliedOne, multipliedTen);

        const timesOne = oneNum.times(multiplier);
        const timesTen = tenNum.times(multiplier);
        checkFunc(timesOne, timesTen);
        compare(multipliedOne, timesOne);
        compare(multipliedTen, timesTen);

        const multipliedByOne = oneNum.multipliedBy(multiplier);
        const multipliedByTen = tenNum.multipliedBy(multiplier);
        checkFunc(multipliedByOne, multipliedByTen);
        compare(multipliedOne, multipliedByOne);
        compare(multipliedTen, multipliedByTen);
        compare(timesOne, multipliedByOne);
        compare(timesTen, multipliedByTen);
    }

    // TOOD: Introduce property-based testing for this test
    @TestCases(NumTest.constantNumberExamples)
    @Test("multiplying by zero always gives zero")
    public multiplyingByZeroGivesZero(amount: Num | number) {
        const num = new Num(amount);

        const checkFn = (multiplier: Num | BigNumber | number): void => {
            const multipliedNum = num.multiply(multiplier);
            Expect(multipliedNum instanceof Num).toBeTruthy();
            Expect(multipliedNum.toString()).toBe("0");
            Expect(multipliedNum).toEqual(new Num(0));
        };

        checkFn(0);
        checkFn(new Num(0));
        checkFn(new Num.BigNumber(0));
    }

    // TOOD: Introduce property-based testing for this test
    @TestCases(NumTest.constantNumberExamples)
    @Test("multiplying by one gives the same amount")
    public multiplyingByOneGivesSameAmount(amount: Num | number) {
        const num = new Num(amount);
        const multipliedNum = num.multiply(1);

        Expect(multipliedNum instanceof Num).toBeTruthy();
        Expect(multipliedNum.toString()).toBe(String(amount));
        Expect(multipliedNum).toEqual(num);
    }

    public static *constantNumberExamples() {
        const numbers = [1, 0.1, 0.5, 2, 10, 10.5, 100, 0, -0, -0.1, -0.5, -1, -2, -10, -15.8, -100];
        for (const num of numbers) {
            yield [num];
            yield [new Num.BigNumber(num)];
            yield [new Num(num)];
        }
    }

    @TestCases(NumTest.divisionExamples)
    @Test("it divides the amount")
    public itDividesTheAmount(amount: number, divisor: number, expected: string) {
        const num = new Num(amount);

        const compare = (num1: Num, num2: Num): void => {
            Expect(num1).toBe(num2);
            Expect(num2).toBe(num1);
        };

        const result1 = num.divide(divisor);
        Expect(result1 instanceof Num).toBeTruthy();
        Expect(result1).toBe(new Num(expected));
        Expect(result1.toString()).toBe(expected);

        const result2 = num.divideBy(divisor);
        const result3 = num.dividedBy(divisor);
        const result4 = num.div(divisor);
        compare(result1, result2);
        compare(result1, result3);
        compare(result1, result4);
        compare(result2, result3);
        compare(result2, result4);
        compare(result3, result4);
    }

    public static divisionExamples() {
        return [
            [1, 1, '1'],
            [1, 2, '0.5'],
            [1, 3, '0.33333333333333333333'],
            [2, 2, '1'],
            [2, 1, '2'],
            [2, 4, '0.5'],
            [4, 2, '2'],
            [4, 0.5, '8'],
            [24, 8, '3'],
            [20, 8, '2.5'],
            [-1, 1, '-1'],
            [-1, 2, '-0.5'],
            [-2, 1, '-2'],
            [-2, 2, '-1'],
            [-2, 4, '-0.5'],
            [-4, 2, '-2'],
            [-4, 0.5, '-8'],
            [-24, 8, '-3'],
            [-20, 8, '-2.5'],
        ];
    }

    @TestCases(NumTest.integerDivisionExamples)
    @Test("it performs integer division")
    public itPerformsIntegerDivision(amount: number, divisor: number, expected: string) {
        const num = new Num(amount);

        const compare = (num1: Num, num2: Num): void => {
            Expect(num1).toBe(num2);
            Expect(num2).toBe(num1);
        };

        const result1 = num.intDivide(divisor);
        Expect(result1 instanceof Num).toBeTruthy();
        Expect(result1).toBe(new Num(expected));
        Expect(result1.toString()).toBe(expected);
        Expect(result1).toBeAnInteger();
        Expect(result1).not.toBeADecimal();

        const result2 = num.dividedToIntegerBy(divisor);
        const result3 = num.idiv(divisor);
        const result4 = num.intdiv(divisor);
        compare(result1, result2);
        compare(result1, result3);
        compare(result1, result4);
        compare(result2, result3);
        compare(result2, result4);
        compare(result3, result4);
    }

    public static integerDivisionExamples() {
        return [
            [1, 1, "1"],
            [1, 2, "0"],
            [1, 3, "0"],
            [2, 2, "1"],
            [2, 1, "2"],
            [2, 4, "0"],
            [4, 2, "2"],
            [4, 3, "1"],
            [4, 0.5, "8"],
            [4.2, 0.5, "8"],
            [5, 0.5, "10"],
            [24, 9, "2"],
            ["20", 8, "2"],
            [-1, 1, "-1"],
            [-1, 2, "0"],
            [-1, 3, "0"],
            [-2, 2, "-1"],
            [-2, 1, "-2"],
            [-2, 4, "0"],
            [-4, 2, "-2"],
            [-4, 3, "-1"],
            [-4, 0.5, "-8"],
            [-4.2, 0.5, "-8"],
            [-5, 0.5, "-10"],
            [-24, 9, "-2"],
            [-20, 8, "-2"],
        ];
    }

    // TODO: Introduce property-based testing for this test
    @TestCases(NumTest.constantNumberExamples)
    @Test("dividing by one gives the same amount")
    public dividingByOneGivesSameAmount(amount: Num | number) {
        const num = new Num(amount);
        const dividedNum = num.divide(1);

        Expect(dividedNum instanceof Num).toBeTruthy();
        Expect(dividedNum).toBe(num);
        Expect(dividedNum.toString()).toBe(String(amount));
    }

    // TODO: Introduce property-based testing for this test
    @TestCases(NumTest.constantNumberExamples)
    @Test("dividing zero by anything gives zero")
    public dividingZeroByAnythingGivesZero(amount: Num | number) {
        // Easier than anything else
        if (amount instanceof Num && amount.isZero) {
            return;
        } else if (amount instanceof Num.BigNumber && amount.isZero()) {
            return;
        } else if (amount === 0) {
            return;
        }

        const num = new Num(0);
        const dividedNum = num.divide(amount);

        Expect(dividedNum instanceof Num).toBeTruthy();
        Expect(dividedNum).toBe(num);
        Expect(dividedNum.toString()).toBe("0");
    }

    @Test("it disallows divide-by-zero")
    public itDisallowsDivideByZero() {
        const num = new Num(1);

        const throwFn = (func: (...args: any[]) => any): void => {
            Expect(func).toThrowError(Error, "Cannot divide by zero.");
        }

        const throwingFn = (val: number | string): void => {
            throwFn(() => num.divide(val));
            throwFn(() => num.divideBy(val));
            throwFn(() => num.dividedBy(val));
            throwFn(() => num.div(val));
            throwFn(() => num.intDivide(val));
            throwFn(() => num.dividedToIntegerBy(val));
            throwFn(() => num.idiv(val));
            throwFn(() => num.intdiv(val));
        }

        throwingFn(0);
        throwingFn("0");
        throwingFn(-0);
        throwingFn("-0");
    }

    @TestCases(NumTest.ceilExamples)
    @Test("it rounds to the nearest integer at or above the current number")
    public itCeils(amount: numeric, expected: string) {
        const num = new Num(amount);
        const ceilNum = num.ceil();

        Expect(ceilNum instanceof Num).toBeTruthy();
        Expect(ceilNum).toBe(new Num(expected));
        Expect(ceilNum.toString()).toBe(expected);
    }

    public static *ceilExamples() {
        const examples = [
            [100, "100"],
            [99.999, "100"],
            [100.0001, "101"],
            ["100.0001", "101"],
            [100.1, "101"],
            [0.1, "1"],
            [0.4, "1"],
            [0.5, "1"],
            [0.6, "1"],
            [1.00001, "2"],
            [1.01, "2"],
            [1.999, "2"],
            [2.999, "3"],
            [0, "0"],
            [-0.1, "0"],
            [-0.5, "0"],
            [-0.9, "0"],
            [-1, "-1"],
            [-1.0, "-1"],
            [-1.9, "-1"],
            [-2, "-2"],
            [-2.3, "-2"],
        ];

        for (const [amount, expected] of examples) {
            yield [amount, expected];
            yield [String(amount), expected];
        }
    }

    @TestCases(NumTest.floorExamples)
    @Test("it rounds to the nearest integer at or below the current number")
    public itFloors(amount: numeric, expected: string) {
        const num = new Num(amount);
        const floorNum = num.floor();

        Expect(floorNum instanceof Num).toBeTruthy();
        Expect(floorNum).toBe(new Num(expected));
        Expect(floorNum.toString()).toBe(expected);
    }

    public static *floorExamples() {
        const examples = [
            [100, "100"],
            [99.999, "99"],
            [100.0001, "100"],
            ["100.0001", "100"],
            [100.1, "100"],
            [0.1, "0"],
            [0.4, "0"],
            [0.5, "0"],
            [0.6, "0"],
            [1.00001, "1"],
            [1.01, "1"],
            [1.999, "1"],
            [2.999, "2"],
            [0, "0"],
            [-0.1, "-1"],
            [-0.5, "-1"],
            [-0.9, "-1"],
            [-1, "-1"],
            [-1.0, "-1"],
            [-1.9, "-2"],
            [-2, "-2"],
            [-2.3, "-3"],
        ];

        for (const [amount, expected] of examples) {
            yield [amount, expected];
            yield [String(amount), expected];
        }
    }

    @TestCases(roundExamples)
    @Test("it rounds numbers to integers")
    public itRoundsToIntegers(amount: numeric, roundingMode: RoundingMode, expected: string) {
        const num = new Num(amount);
        const roundedNum = num.round(roundingMode);

        Expect(roundedNum instanceof Num).toBeTruthy();
        Expect(roundedNum).toBe(new Num(expected));
        Expect(roundedNum.toString()).toBe(expected);
    }

    @TestCases(roundToDecimalPlacesExamples)
    @Test("it rounds to N number of decimal places")
    public itRoundsToNDecimalPlaces(amount: string, places: number, roundingMode: RoundingMode, expected: string, expectedStr?: string) {
        const num = new Num(amount);

        const roundedNum = num.roundToDecimalPlaces(places, roundingMode);
        Expect(roundedNum instanceof Num).toBeTruthy();
        Expect(roundedNum).toBe(new Num(expected));
        Expect(roundedNum.toString()).toBe(expected);

        const roundedStr = num.toRoundedString(places, roundingMode);
        Expect(roundedStr).toBe(expectedStr ? expectedStr : expected);
    }

    @Test("it only understands decimal place counts that are positive integers")
    public itOnlyUnderstandsPositiveIntegerDecimalPlaceCounts() {
        const num = new Num(2.5);

        const throwFns = [
            () => num.roundToDecimalPlaces(2.5),
            () => num.roundToDecimalPlaces(-2.5),
            () => num.roundToDecimalPlaces(-1),
            () => num.toRoundedString(2.5),
            () => num.toRoundedString(-2.5),
            () => num.toRoundedString(-1),
        ];

        for (const throwFn of throwFns) {
            Expect(throwFn).toThrowError(Error, "Number of decimal places must be a positive integer.");
        }
    }

    @TestCases(NumTest.allocationExamples)
    @Test("it allocates an amount")
    public itAllocatesAmount(amount: number, ratios: number[], results: number[]) {
        const num = new Num(amount);
        const allocated = num.allocate(ratios);

        let entryCount = 0;
        for (const [key, num] of [...allocated].entries()) {
            entryCount++;
            const compareTo = new Num(results[key]);
            Expect(num).toBe(compareTo);
        }

        Expect(entryCount).toBe(ratios.length);
    }

    public static allocationExamples() {
        return [
            [99, [1, 1, 1], [33, 33, 33]],
            [100, [1, 1, 1], [34, 33, 33]],
            [101, [1, 1, 1], [34, 34, 33]],
            [5, [3, 7], [2, 3]],
            [5, [7, 3], [4, 1]],
            [5, [7, 3, 0], [4, 1, 0]],
            [-5, [7, 3], [-3, -2]],
            [5, [0, 7, 3], [0, 4, 1]],
            [5, [7, 0, 3], [4, 0, 1]],
            [5, [0, 0, 1], [0, 0, 5]],
            [5, [0, 3, 7], [0, 2, 3]],
            [0, [0, 0, 1], [0, 0, 0]],
            [2, [1, 1, 1], [1, 1, 0]],
            [1, [1, 1], [1, 0]],
            [1, [0.33, 0.66], [0, 1]],
            [101, [3, 7], [30, 71]],
            [101, [7, 3], [71, 30]],
            [500, [1, 1, 1], [167, 167, 166]],
            [1000, [1, 1, 1], [334, 333, 333]],
            [5.5, [1, 1], [3, 3]],
            [6.1, [1, 1], [4, 3]],
            [100.001, [1, 1, 1], [34, 34, 33]],
        ];
    }

    @TestCases(NumTest.allocationNamedExamples)
    @Test("it allocates named amounts")
    public itAllocatesNamedAmounts(amount: number, ratios: { [name: string]: number }, results: { [name: string]: number }) {
        const num = new Num(amount);
        const allocated = num.allocateNamed(ratios);

        let entryCount = 0;
        for (const [name, num] of Object.entries(allocated)) {
            entryCount++;
            const compareTo = new Num(results[name]);
            Expect(num).toBe(compareTo);
        }

        Expect(entryCount).toBe(Object.keys(ratios).length);
    }

    public static allocationNamedExamples() {
        return [
            [99, {"foo": 1, "bar": 1, "baz": 1}, {"foo": 33, "bar": 33, "baz": 33}],
            [100, {"foo": 1, "bar": 1, "baz": 1}, {"foo": 34, "bar": 33, "baz": 33}],
            [101, {"foo": 1, "bar": 1, "baz": 1}, {"foo": 34, "bar": 34, "baz": 33}],
            [100, {"foo": 7, "bar": 3}, {"foo": 70, "bar": 30}],
            [101, {"foo": 7, "bar": 3}, {"foo": 71, "bar": 30}],
            [100, {"foo": 0, "bar": 1, "baz": 1}, {"foo": 0, "bar": 50, "baz": 50}],
            [100, {"foo": 0, "bar": 5, "baz": 5}, {"foo": 0, "bar": 50, "baz": 50}],
            [100, {"foo": 0, "bar": 50, "baz": 50}, {"foo": 0, "bar": 50, "baz": 50}],
        ];
    }

    @Test("it rejects empty allocation ratio lists")
    public itRejectsEmptyAllocationRatioLists() {
        const num = new Num(100);

        const throwFn1 = () => num.allocate([]).next();
        Expect(throwFn1).toThrowError(Error, "Cannot allocate to none, ratios cannot be an empty array.");

        const throwFn2 = () => num.allocateNamed({});
        Expect(throwFn2).toThrowError(Error, "Cannot allocate to none, ratios cannot be an empty mapping.");
    }

    @Test("it rejects allocation ratio lists that sum to zero")
    public itRejectsAllocationRatioListsThatSumToZero() {
        const num = new Num(100);
        const errMsg = "Cannot allocate to none, sum of ratios must be greater than zero.";

        for (let x = 1; x < 10; x++) {
            const ratios: number[] = [];
            ratios.length = x;
            ratios.fill(0, 0, x);
            const throwFn1 = () => num.allocate(ratios).next();
            Expect(throwFn1).toThrowError(Error, errMsg);

            const namedRatios: { [name: string]: number } = {};
            for (let y = 1; y <= x; y++) {
                namedRatios["x".repeat(y)] = 0;
            }
            const throwFn2 = () => num.allocateNamed(namedRatios);
            Expect(throwFn2).toThrowError(Error, errMsg);
        }
    }

    @Test("it rejects allocation ratios that are less than zero")
    public itRejectsAllocationRatiosLessThanZero() {
        const num = new Num(100);
        const errMsg = "Cannot allocate to none, ratio must be zero or positive.";

        for (let x = 2; x < 10; x++) {
            const ratios: number[] = [];
            ratios.length = x;
            ratios.fill(2, 0, x);
            ratios[x - 1] = -1;
            const throwFn1 = () => num.allocate(ratios).next();
            Expect(throwFn1).toThrowError(Error, errMsg);

            const namedRatios: { [name: string]: number } = {};
            for (let y = 1; y <= x; y++) {
                namedRatios["z".repeat(y)] = x;
            }
            namedRatios["q"] = -1;
            const throwFn2 = () => num.allocateNamed(namedRatios);
            Expect(throwFn2).toThrowError(Error, errMsg);
        }
    }

    @TestCases(NumTest.allocationTargetExamples)
    @Test("it allocates an amount to N targets")
    public itAllocatesAmountToNTargets(amount: number, target: number, results: number[]) {
        const num = new Num(amount);
        const allocated = num.allocateTo(target);

        let entryCount = 0;
        for (const [key, num] of [...allocated].entries()) {
            entryCount++;
            const compareTo = new Num(results[key]);
            Expect(num).toBe(compareTo);
        }

        Expect(entryCount).toBe(target);
    }

    public static allocationTargetExamples() {
        return [
            [0, 2, [0, 0]],
            [0, 3, [0, 0, 0]],
            [15, 2, [8, 7]],
            [10, 2, [5, 5]],
            [15, 3, [5, 5, 5]],
            [10, 3, [4, 3, 3]],
            [5.5, 2, [3, 3]],
            [6.1, 2, [4, 3]],
            [100, 3, [34, 33, 33]],
            [101, 3, [34, 34, 33]],
            [100.01, 3, [34, 34, 33]],
        ];
    }

    @Test("it rejects invalid targets when allocating to a fixed number of targets")
    public itRejectsInvalidTargetsForAllocateTo() {
        const num = new Num(100);

        // @ts-expect-error
        const throwFnInt = () => num.allocateTo("matt").next();
        Expect(throwFnInt).toThrowError(Error, "Number of targets must be an integer.");

        for (let x = 0; x > -10; x--) {
            const throwFnPos = () => num.allocateTo(x).next();
            Expect(throwFnPos).toThrowError(Error, "Cannot allocate to none, target count must be greater than zero.");
        }
    }

    @TestCases(NumTest.absoluteExamples)
    @Test("it calculates the absolute amount")
    public itCalculatesTheAbsoluteAmount(amount: numeric, expected: string) {
        const num = new Num(amount);

        const compare = (num1: Num, num2: Num): void => {
            Expect(num1).toBe(num2);
            Expect(num2).toBe(num1);
        };

        const absoluteNum = num.absolute();
        const absNum = num.abs();
        compare(absoluteNum, absNum);

        Expect(absoluteNum instanceof Num).toBeTruthy();
        Expect(absoluteNum).toBe(new Num(expected));
        Expect(absoluteNum.toString()).toBe(expected);
    }

    public static absoluteExamples() {
        return [
            [1, '1'],
            [0, '0'],
            [-1, '1'],
            ['1', '1'],
            ['0', '0'],
            ['-1', '1'],
        ];
    }

    @TestCases(NumTest.negativeExamples)
    @Test("it calculates the negative amount")
    public itCalculatesTheNegativeAmount(amount: numeric, expected: string) {
        const num = new Num(amount);

        const compare = (num1: Num, num2: Num): void => {
            Expect(num1).toBe(num2);
            Expect(num2).toBe(num1);
        };

        const negativeNum = num.negative();
        const negateNum = num.negate();
        const negatedNum = num.negated();
        compare(negativeNum, negateNum);
        compare(negativeNum, negatedNum);
        compare(negateNum, negatedNum);

        Expect(negativeNum instanceof Num).toBeTruthy();
        Expect(negativeNum).toBe(new Num(expected));
        Expect(negativeNum.toString()).toBe(expected);
    }

    public static negativeExamples() {
        return [
            [1, '-1'],
            [-1, '1'],
            [0, '0'],
            [-0, '0'],
            ['1', '-1'],
            ['-1', '1'],
            ['0', '0'],
            ['-0', '0'],
        ];
    }

    @TestCases(NumTest.powExamples)
    @Test("it calculates exponentiation results")
    public itCalculatesExponentiationResults(amount: string, power: number, expected: string) {
        const num = new Num(amount);

        const pow = num.pow(power);
        Expect(pow instanceof Num).toBeTruthy();
        Expect(pow).toBe(new Num(expected));
        Expect(pow.toString()).toBe(expected);

        const exponentiated = num.exponentiatedBy(power);
        Expect(exponentiated).toBe(pow);
    }

    public static powExamples() {
        return [
            ["1", 2, "1"],
            ["2", 2, "4"],
            ["2", 3, "8"],
            ["2.5", 2, "6.25"],
            ["3", 2, "9"],
            ["3", 3, "27"],
            ["10", 2, "100"],
            ["12", 2, "144"],
        ];
    }

    @TestCases(NumTest.sqrtExamples)
    @Test("it calculates square roots correctly")
    public itCalculatesSquareRootsCorrectly(amount: string, expected: string) {
        const num = new Num(amount);

        const squareRoot = num.squareRoot();
        Expect(squareRoot instanceof Num).toBeTruthy();
        Expect(squareRoot).toBe(new Num(expected));
        Expect(squareRoot.toString()).toBe(expected);

        const sqrt = num.sqrt();
        Expect(sqrt).toBe(squareRoot);
    }

    public static sqrtExamples() {
        return [
            ["1", "1"],
            ["4", "2"],
            ["6.25", "2.5"],
            ["9", "3"],
            ["100", "10"],
            ["144", "12"],
        ];
    }

    @TestCases(NumTest.modExamples)
    @Test("it calculates the modulus of an amount")
    public itCalculatesTheModulusOfAnAmount(amount: numeric, divisor: Num | numeric, expected: string) {
        const num = new Num(amount);

        const compare = (num1: Num, num2: Num): void => {
            Expect(num1).toBe(num2);
            Expect(num2).toBe(num1);
        };

        const modNum = num.mod(divisor);
        const moduloNum = num.modulo(divisor);
        compare(modNum, moduloNum);

        Expect(modNum instanceof Num).toBeTruthy();
        Expect(modNum).toBe(new Num(expected));
        Expect(modNum.toString()).toBe(expected);
    }

    public static modExamples() {
        return [
            [11, 5, "1"],
            ["11", "5", "1"],
            ["11", new Num.BigNumber("5"), "1"],
            ["11", new Num("5"), "1"],
            [9, 3, "0"],
            ["9", "3", "0"],
            ["9", new Num.BigNumber("3"), "0"],
            ["9", new Num("3"), "0"],
            [1006, 10, "6"],
            ["1006", "10", "6"],
            ["1006", new Num.BigNumber("10"), "6"],
            ["1006", new Num("10"), "6"],
            [1007, 10, "7"],
            ["1007", "10", "7"],
            ["1007", new Num.BigNumber("10"), "7"],
            ["1007", new Num("10"), "7"],
        ];
    }

    @TestCases(NumTest.percentageExamples)
    @Test("it calculates percentages")
    public itCalculatesPercentages(amount: number, percent: number, expected: string) {
        const num = new Num(amount);

        const compare = (num1: Num, num2: Num): void => {
            Expect(num1).toBe(num2);
            Expect(num2).toBe(num1);
        };

        const percentageNum = num.percentage(percent);
        const percentNum = num.percent(percent);
        compare(percentageNum, percentNum);

        Expect(percentageNum instanceof Num).toBeTruthy();
        Expect(percentageNum).toBe(new Num(expected));
        Expect(percentageNum.toString()).toBe(expected);
        Expect(percentageNum).toBeLessThanOrEqual(num);
        Expect(percentageNum).toBeGreaterThanOrEqual(new Num(0));
    }

    public static percentageExamples() {
        return [
            [0, 0, '0'],
            [350, 0, '0'],
            [350, 100, '350'],
            [350, 50, '175'],
            [10, 100, '10'],
            [10, 30, '3'],
            [10, 25, '2.5'],
            [10, 24, '2.4'],
            [10, 26, '2.6'],
            [100, 25, '25'],
        ];
    }

    @TestCases(NumTest.subtractPercentageExamples)
    @Test("it subtracts a percentage")
    public itSubtractsAPercentage(amount: number, percent: number, expected: string) {
        const num = new Num(amount);

        const compare = (num1: Num, num2: Num): void => {
            Expect(num1).toBe(num2);
            Expect(num2).toBe(num1);
        };

        const percentageNum = num.subtractPercentage(percent);
        const percentNum = num.subtractPercent(percent);
        compare(percentageNum, percentNum);

        Expect(percentageNum instanceof Num).toBeTruthy();
        Expect(percentageNum).toBe(new Num(expected));
        Expect(percentageNum.toString()).toBe(expected);
        Expect(percentageNum).toBeLessThanOrEqual(num);
        Expect(percentageNum).toBeGreaterThanOrEqual(new Num(0));
    }

    public static subtractPercentageExamples() {
        return [
            [100, 25, '75'],
            [80, 25, '60'],
            [80, 75, '20'],
            [60, 70, '18'],
            [99.99, 15, '84.9915'],
            [50, 0, '50'],
            [250, 100, '0'],
        ];
    }

    @TestCases(NumTest.invalidPercentageExamples)
    @Test("it throws for invalid percentages")
    public itThrowsForInvalidPercentages(percent: number) {
        const num = new Num(DEFAULT_AMOUNT);

        const throwFn1 = () => num.percentage(percent);
        const throwFn2 = () => num.subtractPercentage(percent);

        const errMsg = "Percentage values must be between 0 and 100.";
        Expect(throwFn1).toThrowError(RangeError, errMsg);
        Expect(throwFn2).toThrowError(RangeError, errMsg);
    }

    public static invalidPercentageExamples() {
        return [
            [100.01],
            [101],
            [1000],
            [-0.01],
            [-1],
            [-101],
        ];
    }

    @TestCases(NumTest.numberExamples)
    @Test("it has attributes")
    public itHasAttributes(num: string | number, integer: boolean, decimal: boolean, half: boolean, even: boolean, odd: boolean, zero: boolean, positive: boolean, negative: boolean, integerPart: string, fractionalPart: string) {
        const numObj = new Num(num);

        Expect(numObj.isInteger).toBe(integer);
        Expect(numObj.isDecimal).toBe(decimal);
        Expect(numObj.isHalf).toBe(half);
        Expect(numObj.isEven).toBe(even);
        Expect(numObj.isOdd).toBe(odd);
        Expect(numObj.isZero).toBe(zero);
        Expect(numObj.isPositive).toBe(positive);
        Expect(numObj.isNegative).toBe(negative);
        Expect(numObj.integerPart).toBe(integerPart);
        Expect(numObj.fractionalPart).toBe(fractionalPart);
    }

    public static simpleNumberExamples() {
        /**
         *   n   int   dec   half   even   odd   zero   pos   neg   intPart fracPart
         */
        return [
            [0, true, false, false, true, false, true, false, false, '0', ''],
            [-0, true, false, false, true, false, true, false, false, '0', ''],
            ['0', true, false, false, true, false, true, false, false, '0', ''],
            ['-0', true, false, false, true, false, true, false, false, '0', ''],
            ['000', true, false, false, true, false, true, false, false, '0', ''],
            ['0.00', true, false, false, true, false, true, false, false, '0', ''],
            ['0.5', false, true, true, true, false, false, true, false, '0', '5'],
            ['0.500', false, true, true, true, false, false, true, false, '0', '5'],
            ['005', true, false, false, false, true, false, true, false, '5', ''],
            ['-0.5', false, true, true, true, false, false, false, true, '-0', '5'],
            ['3', true, false, false, false, true, false, true, false, '3', ''],
            ['3.00', true, false, false, false, true, false, true, false, '3', ''],
            ['3.5', false, true, true, false, true, false, true, false, '3', '5'],
            ['3.500', false, true, true, false, true, false, true, false, '3', '5'],
            ['-3', true, false, false, false, true, false, false, true, '-3', ''],
            ['-3.0', true, false, false, false, true, false, false, true, '-3', ''],
            ['-3.5', false, true, true, false, true, false, false, true, '-3', '5'],
            ['10', true, false, false, true, false, false, true, false, '10', ''],
            ['10.00', true, false, false, true, false, false, true, false, '10', ''],
            ['10.5', false, true, true, true, false, false, true, false, '10', '5'],
            ['10.500', false, true, true, true, false, false, true, false, '10', '5'],
            ['10.9', false, true, false, true, false, false, true, false, '10', '9'],
            ['-10', true, false, false, true, false, false, false, true, '-10', ''],
            ['-10.5', false, true, true, true, false, false, false, true, '-10', '5'],
            ['-.5', false, true, true, true, false, false, false, true, '-0', '5'],
            ['.5', false, true, true, true, false, false, true, false, '0', '5'],
        ];
    }

    public static numberExamples() {
        const maxIntStr = String(Number.MAX_SAFE_INTEGER);
        const minIntStr = String(Number.MIN_SAFE_INTEGER);

        const simpleExamples = NumTest.simpleNumberExamples();

        /**
         *   n   int   dec   half   even   odd   zero   pos   neg   intPart fracPart
         */
        const complexExamples = [
            ['+123456789', true, false, false, false, true, false, true, false, '123456789', ''],
            ['+123456789012345678.13456', false, true, false, true, false, false, true, false, '123456789012345678', '13456'],
            [maxIntStr, true, false, false, false, true, false, true, false, maxIntStr, ''],
            [minIntStr, true, false, false, false, true, false, false, true, minIntStr, ''],
            [
                maxIntStr + maxIntStr + maxIntStr,
                true,
                false,
                false,
                false,
                true,
                false,
                true,
                false,
                maxIntStr + maxIntStr + maxIntStr,
                '',
            ],
            [
                minIntStr + maxIntStr + maxIntStr,
                true,
                false,
                false,
                false,
                true,
                false,
                false,
                true,
                minIntStr + maxIntStr + maxIntStr,
                '',
            ],
            [
                maxIntStr.substr(0, maxIntStr.length - 1) + "0".repeat(maxIntStr.length - 1) + maxIntStr,
                true,
                false,
                false,
                false,
                true,
                false,
                true,
                false,
                maxIntStr.substr(0, maxIntStr.length - 1) + "0".repeat(maxIntStr.length - 1) + maxIntStr,
                '',
            ],
        ];

        const finalExampleList = [];
        for (const row of simpleExamples) {
            finalExampleList.push(row);
            const numVersion = row.slice();
            numVersion[0] = Number(row[0]);
            finalExampleList.push(numVersion);
        }

        return finalExampleList.concat(complexExamples);
    }

    @TestCases(NumTest.signCheckExamples)
    @Test("it has sign checks")
    public itHasSignChecks(value: string | number, zero: boolean, positive: boolean, negative: boolean) {
        const num = new Num(value);

        if (zero) {
            Expect(num).toBeZero();
        } else {
            Expect(num).not.toBeZero();
        }

        if (positive) {
            Expect(num).toBePositive();
        } else {
            Expect(num).not.toBePositive();
        }

        if (zero || positive) {
            Expect(num).toBePositiveOrZero();
        } else {
            Expect(num).not.toBePositiveOrZero();
        }

        if (negative) {
            Expect(num).toBeNegative();
        } else {
            Expect(num).not.toBeNegative();
        }

        if (zero || negative) {
            Expect(num).toBeNegativeOrZero();
        } else {
            Expect(num).not.toBeNegativeOrZero();
        }
    }

    public static *signCheckExamples() {
        for (const example of NumTest.simpleNumberExamples()) {
            yield [example[0], example[6], example[7], example[8]];
        }
    }

    @TestCases(NumTest.evennessCheckExamples)
    @Test("it has evenness checks")
    public itHasEvennessChecks(value: string | number, even: boolean, odd: boolean) {
        const num = new Num(value);

        if (even) {
            Expect(num).toBeEven();
        } else {
            Expect(num).not.toBeEven();
        }

        if (odd) {
            Expect(num).toBeOdd();
        } else {
            Expect(num).not.toBeOdd();
        }
    }

    public static *evennessCheckExamples() {
        for (const example of NumTest.simpleNumberExamples()) {
            yield [example[0], example[4], example[5]];
        }
    }

    @TestCases(NumTest.shiftExamples)
    @Test("it shifts the decimal place left and right")
    public shift(numStr: string, n: number, shiftLeftExpected: string, shiftRightExpected: string) {
        const shiftLeftExpectedObj = new Num(shiftLeftExpected);
        const shiftRightExpectedObj = new Num(shiftRightExpected);

        const shiftFunc = (numObj: Num): void => {
            const numObjShiftedLeft = numObj.shiftLeft(n);
            Expect(numObjShiftedLeft).toBe(shiftLeftExpectedObj);
            Expect(String(numObjShiftedLeft)).toBe(shiftLeftExpected);

            const numObjShiftedRight = numObj.shiftRight(n);
            Expect(numObjShiftedRight).toBe(shiftRightExpectedObj);
            Expect(String(numObjShiftedRight)).toBe(shiftRightExpected);
        };

        shiftFunc(new Num(numStr));
        shiftFunc(new Num(parseFloat(numStr)));
    }

    public static shiftExamples() {
        return [
            ['0', 10, '0', '0'],
            ['5', 1, '0.5', '50'],
            ['50', 2, '0.5', '5000'],
            ['50', 3, '0.05', '50000'],
            ['0.5', 2, '0.005', '50'],
            ['500', 2, '5', '50000'],
            ['500', 0, '500', '500'],
            ['500', -2, '50000', '5'],
            ['0.5', -2, '50', '0.005'],
            ['0.5', -3, '500', '0.0005'],
            ['-5', 3, '-0.005', '-5000'],
            ['-5', -3, '-5000', '-0.005'],
            ['-0.05', -3, '-50', '-0.00005'],
            ['-0.5', -3, '-500', '-0.0005'],
        ];
    }

    @Test("it can only shift left or right by whole integers")
    public itCanOnlyShiftByWholeIntegers() {
        const num = new Num("12.34");

        const throwLeft = () => num.shiftLeft(1.5);
        const throwRight = () => num.shiftRight(-1.5);

        Expect(throwLeft).toThrowError(Error, "Can only shift by whole number amounts.");
        Expect(throwRight).toThrowError(Error, "Can only shift by whole number amounts.");
    }

    @Test("it rejects unknown rounding modes")
    public itRejectsUnknownRoundingModes() {
        const num = new Num(123.5);

        const throwFns = [
            // @ts-expect-error
            () => num.round("unknown"),
            // @ts-expect-error
            () => num.roundToDecimalPlaces(0, "unknown"),
            // @ts-expect-error
            () => num.toRoundedString(0, "unknown"),
        ];

        for (const throwFn of throwFns) {
            Expect(throwFn).toThrowError(Error, "Unrecognised rounding mode.");
        }
    }

    @Test("it converts to JSON")
    public itConvertsToJson() {
        const num = new Num(DEFAULT_AMOUNT);

        const jsonStringifyOutput = JSON.stringify(num);
        Expect(jsonStringifyOutput).toBe('"' + String(DEFAULT_AMOUNT) + '"');

        const toJsonOutput = num.toJSON();
        Expect(toJsonOutput).toBe(String(DEFAULT_AMOUNT));
    }

    @Test("it supports max safe integer")
    public itSupportsMaxSafeInteger() {
        const maxInt = new Num(Number.MAX_SAFE_INTEGER);
        const maxIntPlusOne = maxInt.plus(1);
        const maxIntMinusOne = maxInt.minus(1);

        const checkFn = (num: Num): void => {
            Expect(num instanceof Num).toBeTruthy();
            Expect(num).toBeAnInteger();
            Expect(num).not.toBeADecimal();
        };

        checkFn(maxInt);
        checkFn(maxIntPlusOne);
        checkFn(maxIntMinusOne);
    }

    @Test("it supports min safe integer")
    public itSupportsMinSafeInteger() {
        const minInt = new Num(Number.MIN_SAFE_INTEGER);
        const minIntPlusOne = minInt.plus(1);
        const minIntMinusOne = minInt.minus(1);

        const checkFn = (num: Num): void => {
            Expect(num instanceof Num).toBeTruthy();
            Expect(num).toBeAnInteger();
            Expect(num).not.toBeADecimal();
        };

        checkFn(minInt);
        checkFn(minIntPlusOne);
        checkFn(minIntMinusOne);
    }

    @Test("it returns ratio of")
    public itReturnsRatioOf() {
        const zero = new Num(0);
        const three = new Num(3);
        const six = new Num(6);

        Expect(zero.ratioOf(six).toString()).toBe("0");
        Expect(three.ratioOf(six).toString()).toBe("0.5");
        Expect(three.ratioOf(three).toString()).toBe("1");
        Expect(six.ratioOf(three).toString()).toBe("2");
    }

    @Test("it throws when calculating ratio of zero")
    public itThrowsWhenCalculatingRatioOfZero() {
        const zero = new Num(0);
        const six = new Num(6);

        const throwFn = () => six.ratioOf(zero);

        Expect(throwFn).toThrowError(Error, "Cannot calculate a ratio of zero.");
    }

    @TestCases(minExamples)
    @Test("it calculates min")
    public itCalculatesMin(values: Num[], min: Num) {
        Expect(Num.min(...values)).toBe(min);
    }

    @TestCases(maxExamples)
    @Test("it calculates max")
    public itCalculatesMax(values: Num[], max: Num) {
        Expect(Num.max(...values)).toBe(max);
    }

    @TestCases(sumExamples)
    @Test("it calculates sums")
    public itCalculatesSum(values: Num[], sum: Num) {
        Expect(Num.sum(...values)).toBe(sum);
    }

    @TestCases(avgExamples)
    @Test("it calculates averages")
    public itCalculatesAverage(values: Num[], avg: Num) {
        Expect(Num.avg(...values)).toBe(avg);
    }

    @Test("the collection methods reject empty collections")
    public theCollectionMethodsRejectEmptyCollections() {
        const throwFns = [
            () => Num.min(),
            () => Num.max(),
            () => Num.sum(),
            () => Num.avg(),
        ];

        for (const throwFn of throwFns) {
            Expect(throwFn).toThrowError(Error, "Must pass at least one number.");
        }
    }
}
