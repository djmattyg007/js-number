/// <reference path = "../src/alsatian-ambient.d.ts" />
import { TestFixture, Test, TestCases, Expect } from "alsatian";

import Num from "src/number";
import { numeric } from "src/types";

const DEFAULT_AMOUNT = 10;

@TestFixture("Number")
export default class NumTest {
    @TestCases(NumTest.invalidNumberExamples)
    @Test("it disallows invalid number values")
    public itDisallowsInvalidNumberValues(value: any) {
        const throwFn = () => new Num(value as numeric);
        Expect(throwFn).toThrow();
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

    @TestCases(NumTest.equalityExamples)
    @Test("it equals to another number")
    public itEqualsToAnotherNumber(amount: number, equality: boolean) {
        const num = new Num(DEFAULT_AMOUNT);
        const compareTo = new Num(amount);

        Expect(num.equals(compareTo)).toBe(equality);
        Expect(num.equalTo(compareTo)).toBe(equality);
        Expect(num.equalsTo(compareTo)).toBe(equality);
        Expect(num.isEqualTo(compareTo)).toBe(equality);
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
        const num = new Num(DEFAULT_AMOUNT);
        const otherNum = new Num(otherAmount);

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

        if (result === 0) {
            Expect(num).toBe(otherNum);
        } else {
            Expect(num).not.toBe(otherNum);
        }
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

    // TODO: Introduce property-based testing for this test
    @TestCases(NumTest.constantNumberExamples)
    @Test("it multiplies the amount")
    public itMultipliesTheAmount(multiplier: number) {
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
    public multiplyingByZeroGivesZero(amount: number) {
        const num = new Num(amount);
        const multipliedNum = num.multiply(0);

        Expect(multipliedNum instanceof Num).toBeTruthy();
        if (num.isPositive) {
            Expect(multipliedNum.toString()).toBe("0");
        } else {
            Expect(multipliedNum.toString()).toBe("-0");
        }
        Expect(multipliedNum).toEqual(new Num(0));
    }

    // TOOD: Introduce property-based testing for this test
    @TestCases(NumTest.constantNumberExamples)
    @Test("multiplying by one gives the same amount")
    public multiplyingByOneGivesSameAmount(amount: number) {
        const num = new Num(amount);
        const multipliedNum = num.multiply(1);

        Expect(multipliedNum instanceof Num).toBeTruthy();
        Expect(multipliedNum.toString()).toBe(String(amount));
        Expect(multipliedNum).toEqual(num);
    }

    public static constantNumberExamples() {
        const numbers = [1, 0.1, 0.5, 2, 10, 10.5, 100, 0, -0.1, -0.5, -1, -2, -10, -15.8, -100];
        return numbers.map(num => [num]);
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
        const result2 = num.dividedBy(divisor);
        compare(result1, result2);

        Expect(result1 instanceof Num).toBeTruthy();
        Expect(result1).toBe(new Num(expected));
        Expect(result1.toString()).toBe(expected);
        Expect(result2 instanceof Num).toBeTruthy();
        Expect(result2).toBe(new Num(expected));
        Expect(result2.toString()).toBe(expected);
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

    // TODO: Introduce property-based testing for this test
    @TestCases(NumTest.constantNumberExamples)
    @Test("dividing by one gives the same amount")
    public dividingByOneGivesSameAmount(amount: number) {
        const num = new Num(amount);
        const dividedNum = num.divide(1);

        Expect(dividedNum instanceof Num).toBeTruthy();
        Expect(dividedNum).toBe(num);
        Expect(dividedNum.toString()).toBe(String(amount));
    }

    // TODO: Introduce property-based testing for this test
    @TestCases(NumTest.constantNumberExamples)
    @Test("dividing zero by anything gives zero")
    public dividingZeroByAnythingGivesZero(amount: number) {
        if (amount === 0) {
            // Easier than anything else
            return;
        }

        const num = new Num(0);
        const dividedNum = num.divide(amount);

        Expect(dividedNum instanceof Num).toBeTruthy();
        Expect(dividedNum).toBe(num);

        if (dividedNum.isPositive === true) {
            Expect(dividedNum.toString()).toBe("0");
        } else {
            Expect(dividedNum.toString()).toBe("-0");
        }
    }

    @Test("it disallows divide-by-zero")
    public itDisallowsDivideByZero() {
        const num = new Num(1);

        Expect(() => num.divide(0)).toThrow();
        Expect(() => num.dividedBy(0)).toThrow();
        Expect(() => num.divide("0")).toThrow();
        Expect(() => num.dividedBy("0")).toThrow();
        Expect(() => num.divide(-0)).toThrow();
        Expect(() => num.dividedBy(-0)).toThrow();
        Expect(() => num.divide("-0")).toThrow();
        Expect(() => num.dividedBy("-0")).toThrow();
    }

    @TestCases(NumTest.allocationExamples)
    @Test("it allocates an amount")
    public itAllocatesAmount(amount: number, ratios: number[], results: number[]) {
        const num = new Num(amount);
        const allocated = num.allocate(ratios);

        for (const [key, num] of [...allocated].entries()) {
            const compareTo = new Num(results[key]);
            Expect(num).toBe(compareTo);
        }
    }

    public static allocationExamples() {
        return [
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
        ];
    }

    @TestCases(NumTest.allocationNamedExamples)
    @Test("it allocates named amounts")
    public itAllocatesNamedAmounts(amount: number, ratios: { [name: string]: number }, results: { [name: string]: number }) {
        const num = new Num(amount);
        const allocated = num.allocateNamed(ratios);

        for (const [name, num] of Object.entries(allocated)) {
            const compareTo = new Num(results[name]);
            Expect(num).toBe(compareTo);
        }
    }

    public static allocationNamedExamples() {
        return [
            [101, {'foo': 7, 'bar': 3}, {'foo': 71, 'bar': 30}],
        ];
    }

    @TestCases(NumTest.allocationTargetExamples)
    @Test("it allocates an amount to N targets")
    public itAllocatesAmountToNTargets(amount: number, target: number, results: number[]) {
        const num = new Num(amount);
        const allocated = num.allocateTo(target);

        for (const [key, num] of [...allocated].entries()) {
            const compareTo = new Num(results[key]);
            Expect(num).toBe(compareTo);
        }
    }

    public static allocationTargetExamples() {
        return [
            [15, 2, [8, 7]],
            [10, 2, [5, 5]],
            [15, 3, [5, 5, 5]],
            [10, 3, [4, 3, 3]],
        ];
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
            [0, '-0'],
            [-0, '0'],
            ['1', '-1'],
            ['-1', '1'],
            ['0', '-0'],
            ['-0', '0'],
        ];
    }

    @TestCases(NumTest.modExamples)
    @Test("it calculates the modulus of an amount")
    public itCalculatesTheModulusOfAnAmount(amount: number, divisor: number, expected: string) {
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
            [11, 5, '1'],
            [9, 3, '0'],
            [1006, 10, '6'],
            [1007, 10, '7'],
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
    public itHasAttributes(num: string | number, decimal: boolean, half: boolean, even: boolean, negative: boolean, integerPart: string, fractionalPart: string) {
        const numObj = new Num(num);

        Expect(numObj.isInteger).toBe(!decimal);
        Expect(numObj.isDecimal).toBe(decimal);
        Expect(numObj.isHalf).toBe(half);
        Expect(numObj.isEven).toBe(even);
        Expect(numObj.isPositive).toBe(!negative);
        Expect(numObj.isNegative).toBe(negative);
        Expect(numObj.integerPart).toBe(integerPart);
        Expect(numObj.fractionalPart).toBe(fractionalPart);
        Expect(numObj.getIntegerRoundingMultiplier()).toBe(negative ? -1 : 1);
    }

    public static numberExamples() {
        const maxIntStr = String(Number.MAX_SAFE_INTEGER);
        const minIntStr = String(Number.MIN_SAFE_INTEGER);

        const simpleExamples = [
            [0, false, false, true, false, '0', ''],
            ['0', false, false, true, false, '0', ''],
            ['000', false, false, true, false, '0', ''],
            ['0.00', false, false, true, false, '0', ''],
            ['0.5', true, true, true, false, '0', '5'],
            ['0.500', true, true, true, false, '0', '5'],
            ['005', false, false, false, false, '5', ''],
            ['-0', false, false, true, true, '-0', ''],
            ['-0.5', true, true, true, true, '-0', '5'],
            ['3', false, false, false, false, '3', ''],
            ['3.00', false, false, false, false, '3', ''],
            ['3.5', true, true, false, false, '3', '5'],
            ['3.500', true, true, false, false, '3', '5'],
            ['-3', false, false, false, true, '-3', ''],
            ['-3.5', true, true, false, true, '-3', '5'],
            ['10', false, false, true, false, '10', ''],
            ['10.00', false, false, true, false, '10', ''],
            ['10.5', true, true, true, false, '10', '5'],
            ['10.500', true, true, true, false, '10', '5'],
            ['10.9', true, false, true, false, '10', '9'],
            ['-10', false, false, true, true, '-10', ''],
            ['-0', false, false, true, true, '-0', ''],
            ['-10.5', true, true, true, true, '-10', '5'],
            ['-.5', true, true, true, true, '-0', '5'],
            ['.5', true, true, true, false, '0', '5'],
        ];

        const complexExamples = [
            ['+123456789', false, false, false, false, '123456789', ''],
            ['+123456789012345678.13456', true, false, true, false, '123456789012345678', '13456'],
            [maxIntStr, false, false, false, false, maxIntStr, ''],
            [minIntStr, false, false, false, true, minIntStr, ''],
            [
                maxIntStr + maxIntStr + maxIntStr,
                false,
                false,
                false,
                false,
                maxIntStr + maxIntStr + maxIntStr,
                '',
            ],
            [
                minIntStr + maxIntStr + maxIntStr,
                false,
                false,
                false,
                true,
                minIntStr + maxIntStr + maxIntStr,
                '',
            ],
            [
                maxIntStr.substr(0, maxIntStr.length - 1) + "0".repeat(maxIntStr.length - 1) + maxIntStr,
                false,
                false,
                false,
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
}
