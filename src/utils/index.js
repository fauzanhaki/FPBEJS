module.exports = {
  exclude: (model, keys) => {
    return Object.fromEntries(
      Object.entries(model).filter(([key]) => !keys.includes(key))
    );
  },

  apiSuccess: (msg, data) => {
    const response = {};
    response.error = false;
    response.message = msg;
    response.data = data;

    return response;
  },

  apiError: (msg) => {
    const response = {};
    response.error = true;
    response.message = msg;

    return response;
  },
};
