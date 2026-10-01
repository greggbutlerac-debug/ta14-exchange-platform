/**
 * Minimal chainable stand-in for the Supabase query builder, for route tests only.
 * Every awaited query is passed to `handler`, which returns `{ data, error }`.
 */
export type FakeQuery = {
  table: string;
  action: 'select' | 'insert' | 'update' | 'upsert' | 'delete';
  payload: unknown;
  filters: [string, string, unknown][];
  single: boolean;
};
export type FakeResult = { data: unknown; error: { message: string; code?: string } | null };

export function fakeSupabase(handler: (q: FakeQuery) => FakeResult) {
  const log: FakeQuery[] = [];
  const from = (table: string) => {
    const q: FakeQuery = { table, action: 'select', payload: null, filters: [], single: false };
    const builder: Record<string, unknown> = {};
    const chain = (name: string) => (...args: unknown[]) => {
      if (name === 'insert' || name === 'update' || name === 'upsert' || name === 'delete') {
        q.action = name;
        q.payload = args[0];
      } else if (['eq', 'in', 'is', 'lt', 'gte', 'or'].includes(name)) {
        q.filters.push([name, String(args[0]), args[1]]);
      } else if (name === 'single' || name === 'maybeSingle') {
        q.single = true;
      }
      return builder;
    };
    for (const name of ['select', 'insert', 'update', 'upsert', 'delete', 'eq', 'in', 'is', 'lt', 'gte', 'or', 'order', 'limit', 'single', 'maybeSingle']) builder[name] = chain(name);
    builder.then = (resolve: (r: FakeResult) => unknown, reject: (e: unknown) => unknown) => {
      log.push(q);
      try {
        return Promise.resolve(handler(q)).then(resolve, reject);
      } catch (error) {
        return Promise.reject(error).then(resolve, reject);
      }
    };
    return builder;
  };
  return { client: { from, schema: () => ({ from }), rpc: async () => ({ data: null, error: null }) }, log };
}

export function filterValue(q: FakeQuery, column: string): unknown {
  return q.filters.find(([op, col]) => op === 'eq' && col === column)?.[2];
}
