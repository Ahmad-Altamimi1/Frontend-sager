export const SOCKET_IO_URL: string =
  (import.meta.env.VITE_WS_URL as string | undefined) ??
  "http://localhost:9013";

export const MAPBOX_ACCESS_TOKEN: string | undefined = import.meta.env
  .VITE_MAP_BOX_ACCESS_TOKEN as string | undefined;
