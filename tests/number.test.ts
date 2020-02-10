import { TestFixture, Test, TestCases, Expect } from "alsatian";

import Num from "src/number";

@TestFixture("Number")
export default class NumberTest {
    @TestCases(NumberTest.numberExamples)
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

    @TestCases(NumberTest.invalidNumberExamples)
    @Test("it fails parsing invalid numbers")
    public itFailsParsingInvalidNumbers(num: string) {
        const throwFn = () => new Num(num);

        Expect(throwFn).toThrow(); 
    }

    @TestCases(NumberTest.shiftExamples)
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
