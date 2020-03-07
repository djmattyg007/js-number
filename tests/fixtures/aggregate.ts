import type BigNumber from "bignumber.js";
import Num from "src/number";
import { numeric } from "src/types";

function N(value: numeric): Num {
    return new Num(value);
}

function BN(value: numeric): BigNumber {
    return new Num.BigNumber(value);
}

export const sumExamples = [
    [[N(5), N(10), N(15)], N(30)],
    [[N(-5), N(-10), N(-15)], N(-30)],
    [[N(0)], N(0)],
    [[N(-5), N(0), N(5)], N(0)],
];

export const minExamples = [
    [[5, 10, 15], 5],
    [[-5, -10, -15], -15],
    [[0], 0],
    [[-5, 5], -5],
    [[N(5), N(10), N(15)], N(5)],
    [[N(-5), N(-10), N(-15)], N(-15)],
    [[N(0)], N(0)],
    [[N(-5), N(5)], N(-5)],
    [[N(BN(5)), N(BN(10)), N(BN(15))], N(BN(5))],
    [[N(BN(-5)), N(BN(-10)), N(BN(-15))], N(BN(-15))],
    [[N(BN(0))], N(BN(0))],
    [[N(BN(-5)), N(BN(5))], N(BN(-5))],
    [[BN(5), BN(10), BN(15)], BN(5)],
    [[BN(-5), BN(-10), BN(-15)], BN(-15)],
    [[BN(0)], BN(0)],
    [[BN(-5), BN(5)], BN(-5)],
    [[BN(BN(5)), BN(BN(10)), BN(BN(15))], BN(BN(5))],
    [[BN(BN(-5)), BN(BN(-10)), BN(BN(-15))], BN(BN(-15))],
    [[BN(BN(0))], BN(BN(0))],
    [[BN(BN(-5)), BN(BN(5))], BN(BN(-5))],
];

export const maxExamples = [
    [[5, 10, 15], 15],
    [[-5, -10, -15], -5],
    [[0], 0],
    [[-5, 5], 5],
    [[N(5), N(10), N(15)], N(15)],
    [[N(-5), N(-10), N(-15)], N(-5)],
    [[N(0)], N(0)],
    [[N(-5), N(5)], N(5)],
    [[N(BN(5)), N(BN(10)), N(BN(15))], N(BN(15))],
    [[N(BN(-5)), N(BN(-10)), N(BN(-15))], N(BN(-5))],
    [[N(BN(0))], N(BN(0))],
    [[N(BN(-5)), N(BN(5))], N(BN(5))],
    [[BN(5), BN(10), BN(15)], BN(15)],
    [[BN(-5), BN(-10), BN(-15)], BN(-5)],
    [[BN(0)], BN(0)],
    [[BN(-5), BN(5)], N(BN(5))],
    [[BN(BN(5)), BN(BN(10)), BN(BN(15))], BN(BN(15))],
    [[BN(BN(-5)), BN(BN(-10)), BN(BN(-15))], BN(BN(-5))],
    [[BN(BN(0))], BN(BN(0))],
    [[BN(BN(-5)), BN(BN(5))], BN(BN(5))],
];

export const avgExamples = [
    [[N(5), N(10), N(15)], N(10)],
    [[N(-5), N(-10), N(-15)], N(-10)],
    [[N(0)], N(0)],
    [[N(-5), N(5)], N(0)],
    [[N(-5), N(0), N(5)], N(0)],
];
