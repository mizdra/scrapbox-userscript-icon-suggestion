declare module 'rollup/dist/loadConfigFile' {
  import type { RollupWatchOptions } from 'rollup';

  interface LoadConfigFileResult {
    options: RollupWatchOptions[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    warning: any;
  }
  const loadConfigFile: (fileName: string, commandOptions: Record<string, unknown>) => Promise<LoadConfigFileResult>;
  export = loadConfigFile;
}
