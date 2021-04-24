import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import rootReducer from './reducers/reducerIndex'
import { composeWithDevTools } from 'redux-devtools-extension';

const saveToLocalStorage = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem("state", serializedState);
    } catch (error) {
      console.log(error);
    }
  };
  
  const loadFromLocalStorage = () => {
    try {
      const serializedState = localStorage.getItem("state");
      if (serializedState == null) return undefined;
      return JSON.parse(serializedState);
    } catch (error) {
      console.log(error);
      return undefined;
    }
  };
const persistedState = loadFromLocalStorage();

// const initialState = {}
const middleware = [ thunk ]
const store = createStore( rootReducer, persistedState, composeWithDevTools( applyMiddleware( ...middleware ) ) )

store.subscribe(() => saveToLocalStorage(store.getState()));

export default store;