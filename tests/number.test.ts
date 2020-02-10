import { TestFixture, Test, TestCases, Expect } from "alsatian";

import Num from "src/number";

const DEFAULT_AMOUNT = 10;

@TestFixture("Number")
export default class NumTest {
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

    // TOOD: Introduce property-based testing for this test
    @TestCases(NumTest.multiplyingByConstantExamples)
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
    @TestCases(NumTest.multiplyingByConstantExamples)
    @Test("multiplying by one gives the same amount")
    public multiplyingByOneGivesSameAmount(amount: number) {
        const num = new Num(amount);
        const multipliedNum = num.multiply(1);

        Expect(multipliedNum instanceof Num).toBeTruthy();
        Expect(multipliedNum.toString()).toBe(String(amount));
        Expect(multipliedNum).toEqual(num);
    }

    public static multiplyingByConstantExamples() {
        const numbers = [1, 0.1, 0.5, 2, 10, 10.5, 100, 0, -0.1, -0.5, -1, -2, -10, -15.8, -100];
        return numbers.map(num => [num]);
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

    @TestCases(NumTest.invalidNumberExamples)
    @Test("it fails parsing invalid numbers")
    public itFailsParsingInvalidNumbers(num: string) {
        const throwFn = () => new Num(num);

        Expect(throwFn).toThrow();
    }

    public static invalidNumberExamples() {
        return [
            [''],
            ['123456789012345678-123456'],
            ['---123'],
            ['123456789012345678+13456'],
            ['-123456789012345678.-13456'],
            ['+123456789012345678.+13456'],
        ];
    }

    @TestCases(NumTest.shiftExamples)
    @Test("it shifts the decimal place left and right")
    public shift(numStr: string, n: number, shiftLeftExpected: string, shiftRightExpected: string) {
        const shiftLeftExpectedObj = new Num(shiftLeftExpected);
        const shiftRightExpectedObj = new Num(shiftRightExpected);

        const shiftFunc = (numObj: Num): void => {
            const numObjShiftedLeft = numObj.shiftLeft(n);
            const numObjShiftedRight = numObj.shiftRight(n);
            Expect(numObjShiftedLeft).toBe(shiftLeftExpectedObj);
            Expect(String(numObjShiftedLeft)).toBe(shiftLeftExpected);
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
}
