export default {
  root_dir: process.cwd(),
  static_dir: process.env.STATIC_DIR,
  jwt_key: process.env.JWT_KEY || '',
}