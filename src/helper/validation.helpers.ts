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
      throw new Error(`${this.key} is required`);
    }
    return this;
  }

  isEmail(): this | undefined {
    if (this.value === undefined) return;
    const validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (this.value.toString().match(validRegex) === null) {
      throw Error("pleast insert valid  Email");
    }
    return this;
  }
  ConfirmPassword(password: string) {
    if (this.value !== password) {
      throw Error("password not match");
    }
    return this;
  }
  isPassword(strong?: string, max = 16, min = 5): this | undefined {
    if (this.value === undefined) return;
    const strongRegex = strong ? strong : new RegExp("^(?=.*[a-z])(?=.*[0-9])");
    const value = this.value.toString();
    if (value.length > max) {
      throw Error(`password must be smaller than ${max} characters`);
    } else if (value.length < min) {
      throw Error(`password must be biger than ${min} characters`);
    } else if (value.match(strongRegex) === null) {
      throw Error(`password must have numbers and characters`);
    }

    return this;
  }
  isNotEmpty(): this | undefined {
    if (this.value === undefined) return;
    if (!this.value.toString().length) {
      throw Error(`${this.key} is empty `);
    }
    return this;
  }
  isInt(): this | undefined {
    if (this.value === undefined) return;

    if (/^\d+$/.test(this.value as string)) return this;
    throw Error(`${this.key} should be integer`);
  }
}

class Validation {
  static validate(quary: { [x: string]: string | number }): Validate {
    return new Validate(quary);
  }
}

export default Validation;
