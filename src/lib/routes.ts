/**
 * Shared route constants.
 *
 * Kept out of src/middleware.ts on purpose: that module is compiled for the
 * middleware runtime, so importing it from Server Components or Server Actions
 * drags a differently-compiled module graph into the Node bundle.
 */
export const LOGIN_PATH = "/admin/login";
export const ADMIN_HOME_PATH = "/admin";
export const FORBIDDEN_PATH = "/admin/forbidden";
