import axios from "axios";
import { createContext, useReducer } from "react";

export const AppContext = createContext();
const Context = ({ Children }) => {
  const initialState = {
    // instructor
    getCourse: {},
  };
  const reducer = (state, action) => {
    return { ...state, [action.type]: action.payload };
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  const apiPOSTMethod = async (urlpath, apiData, action) => {
    const url = `${
      process.env.REACT_APP_BACKEND_URL
        ? process.env.REACT_APP_BACKEND_URL
        : window.location.origin
    }/api/elearning${urlpath}`;
    try {
      const data = await axios.post(url, apiData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("elearningToken")}`,
        },
      });
      dispatch({ type: action, payload: data });
      return data;
    } catch (err) {
      window.location.origin = "/elearning";
    }
  };
  const apiGETMethod = async (urlpath, action) => {
    const url = `${
      process.env.REACT_APP_BACKEND_URL
        ? process.env.REACT_APP_BACKEND_URL
        : window.location.origin
    }/api/elearning${urlpath}`;

    const data = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("elearningToken")}`,
      },
    });
    dispatch({ type: action, payload: data });
    return data;
  };
  return (
    <AppContext.Provider
      value={{ apiPOSTMethod: apiPOSTMethod, state, apiGETMethod }}
    >
      {Children}
    </AppContext.Provider>
  );
};
export default Context;
