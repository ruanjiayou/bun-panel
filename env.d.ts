declare module "bun" {
  interface Env {
    PORT: string;
    DATABASE_DIR: string;
  }
}