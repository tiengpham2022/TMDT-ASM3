import { useCallback, useState } from "react";

const useHttpFormdata = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);

  const sendRequest = useCallback(async (option, cb) => {
    try {
      setIsError(null);
      setIsLoading(true);
      const response = await fetch(option.url, {
        method: option.method ? option.method : "GET",
        body: option.body ? option.body : null,
        headers: option.headers ? option.headers : {},
      });
      const resData = await response.json();
      if (response.status === 401) {
        throw new Error("Unauthorized!");
      }
      if (response.status !== 200) {
        throw new Error(resData.message);
      }

      //ok thì gọi cb đối số là data
      cb(resData);
    } catch (err) {
      setIsError(err.message || "Something is wrong!");
    }
    setIsLoading(false);
  }, []);
  return {
    isLoading,
    isError,
    sendRequest,
  };
};

export default useHttpFormdata;
