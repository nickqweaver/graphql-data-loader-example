type Resource = {
  id: number;
};

// Maps a single resource to the ID that was used to query it
export function orderOneToOne<T extends Resource>(
  ids: readonly number[],
  items: T[],
  key: keyof T = "id",
) {
  const map = new Map<number, (typeof items)[0]>();

  items.forEach((i) => {
    const lookup = i[key] as number;
    map.set(lookup, i);
  });

  return ids.map((id) => map.get(id) as (typeof items)[0]);
}

// Maps multiple resources to the ID that was used to query it
export function orderOneToMany<T extends Resource>(
  ids: readonly number[],
  items: T[],
  key: keyof T = "id",
) {
  const map = new Map<number, typeof items>();

  items.forEach((item) => {
    const lookup = item[key] as number;
    const existing = map.get(lookup);

    if (existing) {
      map.set(lookup, [...existing, item]);
    } else {
      map.set(lookup, [item]);
    }
  });

  return ids.map((id) => {
    const match = map.get(id) as T[];
    if (!match) {
      return [];
    }
    return match;
  });
}
