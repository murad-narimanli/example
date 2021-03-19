import {
  SET_USER_ERROR,
  LOADING_ON,
  LOADING_OFF,
  SET_USER_LOGGED_IN,
  LOG_OUT,
  SET_OPTIONS,
  SET_LANG,
  SET_NOTIFICATION,
  SET_STOCK,
} from "./../types";
import agros from "./../../const/api";
import history from "./../../const/history";
import { ourls } from "../../utils/options";

export const getStock = () => async (dispatch) => {
  await agros.get("auth/stockinfo").then((res) => {
    dispatch({
      type: SET_STOCK,
      payload: res.data,
    });
  });
};

export const getUserData = () => async (dispatch) => {
  dispatch({ type: LOADING_ON });
  await agros
    .get("auth")
    .then((res) => {
      console.log("Here asdfasd");
      console.log(res.data);
      let payload = {
        ...res.data,
      };
      console.log(payload);
      dispatch({
        type: SET_USER_LOGGED_IN,
        payload: res.data,
        // payload: res.data
      });
    })
    .catch((err) => {
      dispatch({
        type: LOG_OUT,
      });
    })
    .finally(() => {
      dispatch({ type: LOADING_OFF });
    });
};

export const logInUser = (username, password) => async (dispatch) => {
  if (username.trim().length === 0 || password.trim().length === 0) {
    dispatch({
      type: SET_USER_ERROR,
      payload: { message: "İstifadəçi adı və şifrə daxil edilməlidir" },
    });
  } else {
    dispatch({ type: LOADING_ON });
    await agros
      .post(`auth/login`, JSON.stringify({ username, password }))
      .then((res) => {
        localStorage.setItem("access_token", res.data.token);
        dispatch(getUserData());
        history.push("/");
      })
      .catch((error) => {
        dispatch({
          type: SET_USER_ERROR,
          payload: { message: "İstifadəçi adı və ya şifrə yanlışdır" },
        });
      })
      .finally(() => {
        dispatch({ type: LOADING_OFF });
      });
  }
};

export const toggleLoading = (payload) => ({
  type: payload ? LOADING_ON : LOADING_OFF,
});

export const logOut = () => ({
  type: LOG_OUT,
});

export const getAllOptions = (keys, props) => async (dispatch) => {
  let obj = {};
  const ops = new Promise((resolve, reject) => {
    let ind = 0;
    keys.forEach(async (key) => {
      if (!props[key].length) {
        await agros.get(ourls[key]).then((res) => {
          obj[key] = res.data;
          ind++;
        });
      } else {
        ind++;
      }
      if (ind === keys.length) {
        resolve();
      }
    });
  });

  ops.then(() => {
    dispatch({
      type: SET_OPTIONS,
      payload: obj,
    });
  });
};

export const getOptions = (keys, props, lang) => async (dispatch) => {
  let obj = { ...props };
  const ops = new Promise((resolve, reject) => {
    let ind = 0;
    keys.forEach(async (key) => {
      if (!props[lang][key].length) {
        await agros.get(ourls[key]).then((res) => {
          console.log(res.data)
          obj[lang][key] = res.data;
          ind++;
        });
      } else {
        ind++;
      }
      if (ind === keys.length) {
        resolve();
      }
    });
  });

  ops.then(() => {
    dispatch({
      type: SET_OPTIONS,
      payload: obj,
    });
  });
};

export const changeLanguage = (payload) => {
  return {
    type: SET_LANG,
    payload,
  };
};

export const notify = (description, isHappy) => {
  return {
    type: SET_NOTIFICATION,
    payload: { description, isHappy },
  };
};
