class Query {
  insert(
    table: string,
    columns: { [x: string]: unknown }[]
  ): { sql: string; values: unknown[] } {
    let counter = 1;
    const keys: string[] = [];
    const placeHolder: string[] = [];
    const values: (string | number)[] = [];

    columns.map((item) => {
      const num: string[] = [];
      for (const [key, val] of Object.entries(item)) {
        num.push(`$${counter}`);
        keys.push(key);
        values.push(val as string | number);
        counter++;
      }
      placeHolder.push(`(${num.toString()})`);
    });

    const sql = `INSERT INTO ${table} (${keys.toString()})
    values ${placeHolder.toString()} RETURNING*`;
    return { sql, values };
  }

  update(
    table: string,
    column: { [x: string]: unknown }
  ): { sql: string; values: unknown[] } {
    const values: (string | number)[] = [];
    const placeHolders: string[] = [];
    Object.entries(column).map(([key, value], i) => {
      placeHolders.push(`${key}=$${i + 1}`);
      values.push(value as string | number);
    });
    const sql = `UPDATE ${table}
    SET ${placeHolders.toString()}
    WHERE id=$${placeHolders.length + 1}
    RETURNING id, name, price, category`;
    return { sql, values };
  }
}

export default Query;
