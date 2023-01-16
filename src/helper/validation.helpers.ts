import { throwError } from "./error.helper";

class Validate {
  quary: { [x: string]: string | number };
  key: string;
  value: string | number;
  constructor(quary: { [x: string]: string | number }) {
    this.quary = quary;
    this.key = Object.keys(this.quary)[0];
    this.value = Object.values(this.quary)[0];
  }

  required(): this {
    if (!this.value) {
      throwError(`${this.key} is required`, 422);
    }
    return this;
  }

  isEmail(): this | undefined {
    if (this.value === undefined) return;
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (this.value.toString().match(validRegex) === null) {
      throwError(`pleast insert valid  Email`, 422);
    }
    return this;
  }
  ConfirmPassword(password: string) {
    if (this.value !== password) {
      throwError(`password not match`, 422);
    }
    return this;
  }
  isPassword(strong?: string, max = 16, min = 5): this | undefined {
    if (this.value === undefined) return;
    const strongRegex = strong ? strong : new RegExp("^(?=.*[a-z])(?=.*[0-9])");
    const value = this.value.toString();
    if (value.length > max) {
      throwError(`password must be smaller than ${max} characters`, 422);
    } else if (value.length < min) {
      throwError(`password must be biger than ${min} characters`, 422);
    } else if (value.match(strongRegex) === null) {
      throwError(`password must have numbers and characters`, 422);
    }

    return this;
  }
  isNotEmpty(): this | undefined {
    if (this.value === undefined) return;
    if (!this.value.toString().length) {
      throwError(`${this.key} is empty `, 422);
    }
    return this;
  }
  isInt(): this | undefined {
    if (this.value === undefined) return;

    if (/^\d+$/.test(this.value as string)) return this;
    throwError(`${this.key} should be integer`, 422);
  }
}

class Validation {
  static validate(quary: { [x: string]: string | number }): Validate {
    return new Validate(quary);
  }
}

export default Validation;
