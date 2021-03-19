import co from "../../const/permissions";
import { mapPermissions } from "../../const/permissions";
import {
  GET_USER,
  SET_USER,
  SET_USER_ERROR,
  SET_USER_LOGGED_IN,
  LOG_OUT,
  LOADING_OFF,
  LOADING_ON,
  GET_OPTIONS,
  SET_OPTIONS,
  GET_LANG,
  SET_LANG,
  SET_NOTIFICATION,
  SET_STOCK,
} from "./../types";

const initialUser = {
  isLoggedIn: false,
  data: {
    role: 5,
  },
  message: "",
  notify: true,
};

export function userReducer(userData = initialUser, action) {
  switch (action.type) {
    case GET_USER:
      return userData;
    case SET_USER_LOGGED_IN:
      let data = {
        userId: action.payload.userId,
        userName: action.payload.userName,
        userGender: action.payload.userGender,
        userPermissions: mapPermissions(
          co,
          action.payload.userPermissions.values
        ),
        purchaseLimit:
          action.payload.userPermissions !== null
            ? action.payload.userPermissions.purchaseLimit
            : 50000,
      };
      return {
        data,
        isLoggedIn: true,
        message: "",
        notify: !userData.notify,
      };
    case SET_USER:
      return {
        data: action.payload.data,
        isLoggedIn: true,
        message: "Successfully logged in",
        notify: !userData.notify,
      };
    case SET_USER_ERROR:
      return {
        ...userData,
        message: action.payload.message,
        notify: !userData.notify,
      };
    case LOG_OUT:
      return {
        notify: userData.notify,
        message: "",
        data: {},
        isLoggedIn: false,
      };
    default:
      return userData;
  }
}

export function loaderReducer(isLoading = 0, action) {
  switch (action.type) {
    case LOADING_ON:
      return ++isLoading;
    case LOADING_OFF:
      return isLoading === 0 ? 0 : --isLoading;
    default:
      return isLoading;
  }
}

const initialOptions = {
  warehouseCategories: [],
  measurementUnits: [],
  parcelCategories: [],
  permissionGroups: [],
  mainIngredients: [],
  fertilizerKinds: [],
  annualWorkPlans: [],
  cropCategories: [],
  deliveryTerms: [],
  parcelRegions: [],
  parcelSectors: [],
  reproductions: [],
  paymentKinds: [],
  paymentTerms: [],
  workStatuses: [],
  fertilizers: [],
  warehouses: [],
  positions: [],
  customers: [],
  countries: [],
  cropSorts: [],
  reserves: [],
  parcels: [],
  modules: [],
  todos: [],
  users: [],
  tools: [],
  crops: [],

  temporaryOperationKinds: [],
  temporaryInAndOutItems: [],
  temporaryCustomers: [],
  temporaryAccountKinds: [],
  temporaryPayAccounts: [],
  temporaryParcels: [],
  temporarySectors: [],
};

export function optionsReducer(
  options = {
    az: { ...initialOptions },
    en: { ...initialOptions },
    ru: { ...initialOptions },
  },
  action
) {
  switch (action.type) {
    case SET_OPTIONS:
      return action.payload;
    // case RESET_OPTION:
    case GET_OPTIONS:
      return options;
    default:
      return options;
  }
}

export function langReducer(
  lang = localStorage.getItem("locale") || "az",
  action
) {
  switch (action.type) {
    case SET_LANG:
      return action.payload;
    case GET_LANG:
      return lang;
    default:
      return lang;
  }
}

export function notificationReducer(
  data = { description: "", isHappy: true, notify: false },
  action
) {
  switch (action.type) {
    case SET_NOTIFICATION:
      let newData = { ...action.payload, notify: !data.notify };
      return newData;
    default:
      return data;
  }
}

export function stockReducer(
  data = { medicalStock: 0, cropStock: 0, reserveStock: 0 },
  action
) {
  switch (action.type) {
    case SET_STOCK:
      return action.payload;
    default:
      return data;
  }
}
