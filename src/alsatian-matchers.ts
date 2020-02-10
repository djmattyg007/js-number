import { Matcher } from "alsatian";
import Num from "./number";

export class NumMatcher extends Matcher<Num> {
    public toBe(other: Num) {
        this._registerMatcher(
            (this.actualValue.equals(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to equal ${JSON.stringify(other)}.`,
            other
        );
    }

    public toEqual(other: Num) {
        this.toBe(other);
    }

    public toBeLessThan(other: Num) {
        this._registerMatcher(
            (this.actualValue.lessThan(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be less than ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeLessThanOrEqual(other: Num) {
        this._registerMatcher(
            (this.actualValue.lessThanOrEqual(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be less than or equal to ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeGreaterThan(other: Num) {
        this._registerMatcher(
            (this.actualValue.greaterThan(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be greater than ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeGreaterThanOrEqual(other: Num) {
        this._registerMatcher(
            (this.actualValue.greaterThanOrEqual(other)) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be greater than or equal to ${JSON.stringify(other)}.`,
            other
        );
    }

    public toBeZero() {
        this._registerMatcher(
            (this.actualValue.isZero) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be zero.`,
            this.shouldMatch ? "zero" : "not zero"
        );
    }

    public toBePositive() {
        this._registerMatcher(
            (this.actualValue.isPositive) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be positive.`,
            this.shouldMatch ? "positive" : "negative"
        );
    }

    public toBeNegative() {
        this._registerMatcher(
            (this.actualValue.isNegative) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be negative.`,
            this.shouldMatch ? "negative" : "positive"
        );
    }

    public toBeAnInteger() {
        this._registerMatcher(
            (this.actualValue.isInteger) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be an integer.`,
            this.shouldMatch ? "integer" : "decimal"
        );
    }

    public toBeADecimal() {
        this._registerMatcher(
            (this.actualValue.isDecimal) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be a decimal.`,
            this.shouldMatch ? "decimal" : "integer"
        );
    }

    public toBeEven() {
        this._registerMatcher(
            (this.actualValue.isEven) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be even.`,
            this.shouldMatch ? "even" : "odd"
        );
    }

    public toBeOdd() {
        this._registerMatcher(
            (this.actualValue.isOdd) === this.shouldMatch,
            `Expected ${JSON.stringify(this.actualValue)} ${
                !this.shouldMatch ? "not " : ""
            }` + `to be odd.`,
            this.shouldMatch ? "odd" : "even"
        );
    }
}
