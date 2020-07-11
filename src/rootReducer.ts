import { combineReducers } from "redux";
import { useSelector, TypedUseSelectorHook } from "react-redux";

const rootReducer = combineReducers({});

/** Structure of the entire application state in redux */
export type AppRootState = ReturnType<typeof rootReducer>;

/** A typed variant of the useSelector hook, intended to prevent repetitively specifying selector types */
export const useTypedSelector: TypedUseSelectorHook<AppRootState> = useSelector;

export default rootReducer;
