const onError = async function (error) {
  console.error("Response Error Interceptor:", error);
  return error;
};

const onResponse = function (response) {
  // 
  return response;
};

export default {
  onResponse,
  onError,
};
