import Num from "src/number";
import { numeric } from "src/types";

function N(value: numeric): Num {
    return new Num(value);
}

export const sumExamples = [
    [[N(5), N(10), N(15)], N(30)],
    [[N(-5), N(-10), N(-15)], N(-30)],
    [[N(0)], N(0)],
    [[N(-5), N(0), N(5)], N(0)],
];

export const minExamples = [
    [[N(5), N(10), N(15)], N(5)],
    [[N(-5), N(-10), N(-15)], N(-15)],
    [[N(0)], N(0)],
    [[N(-5), N(5)], N(-5)],
];

export const maxExamples = [
    [[N(5), N(10), N(15)], N(15)],
    [[N(-5), N(-10), N(-15)], N(-5)],
    [[N(0)], N(0)],
    [[N(-5), N(5)], N(5)],
];

export const avgExamples = [
    [[N(5), N(10), N(15)], N(10)],
    [[N(-5), N(-10), N(-15)], N(-10)],
    [[N(0)], N(0)],
    [[N(-5), N(5)], N(0)],
    [[N(-5), N(0), N(5)], N(0)],
];
