export const respuesta = (res, status, data) => {
  return res.status(status).json(data);
};
