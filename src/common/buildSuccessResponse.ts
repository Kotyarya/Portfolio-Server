export const buildSuccessResponse = <T>(
  data: T,
): { status: number; message: string; data: T } => ({
  status: 200,
  message: 'Success',
  data,
});
