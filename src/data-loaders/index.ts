import { store } from "./store";

export function createDataLoaders() {
  const loaders = new Map<
    keyof typeof store,
    ReturnType<(typeof store)[keyof typeof store]>
  >();

  type LoaderArgs = {
    [K in keyof typeof store]: Parameters<(typeof store)[K]>[0]; // Extract the argument type
  };

  return {
    get: function <K extends keyof typeof store>(
      key: K,
      args?: LoaderArgs[K],
    ): ReturnType<(typeof store)[K]> {
      if (!loaders.has(key)) {
        // @ts-expect-error - Expected 0 arguments, received 1
        loaders.set(key, store[key](args));
      }

      return loaders.get(key) as ReturnType<(typeof store)[K]>;
    },
  };
}

export type DataLoadersType = ReturnType<typeof createDataLoaders>;
