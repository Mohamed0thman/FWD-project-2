class Query {
  insert(
    table: string,
    columns: { [x: string]: unknown }[],
    returning: string[] = []
  ): { sql: string; values: unknown[] } {
    let counter = 1;
    const keys: string[] = [];
    const placeHolder: string[] = [];
    const values: (string | number)[] = [];

    columns.map((item) => {
      const num: string[] = [];
      Object.entries(item).map(([key, value]) => {
        if (keys.length < Object.keys(item).length) {
          keys.push(key);
        }
        num.push(`$${counter}`);
        values.push(value as string | number);
        counter++;
      });

      placeHolder.push(`(${num.toString()})`);
    });

    const sql = `INSERT INTO ${table} (${keys.toString()})
    values ${placeHolder.toString()} RETURNING ${returning?.toString()}`;
    return { sql, values };
  }

  update(
    table: string,
    column: { [x: string]: unknown },
    returning: string[] = []
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
    RETURNING ${returning?.toString()}`;
    return { sql, values };
  }
}

const query = new Query();

export default query;
