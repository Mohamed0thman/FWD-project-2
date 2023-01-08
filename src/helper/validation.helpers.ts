import db from "../db";

export class Validation {
  quary: { [x: string]: string | number };
  key: string;
  value: string | number;
  constructor(quary: { [x: string]: string | number }) {
    this.quary = quary;
    this.key = Object.keys(this.quary)[0];
    this.value = Object.values(this.quary)[0];
  }

  required(): this {
    console.log(Object.keys(this.quary)[0]);
    if (!this.value) {
      throw new Error(`${this.key} is required`);
    }
    return this;
  }

  async uniqe(tableName: string): Promise<this> {
    const connection = await db.connect();
    const sql = `SELECT COUNT(*) from ${tableName} WHERE ${this.key} = $1`;
    const result = await connection.query(sql, [this.value]);
    console.log(result);

    connection.release();
    if (result.rows[0].count > 0) {
      throw new Error(`${this.key} is exist`);
    }
    return this;
  }
}
