const initialState = {
  lang:null,
  langIndex:null
}

export default function ( state = initialState, action){
  switch(action.type){
    case 'SET_LANG':
      return {
        ...state,
        lang:action.payload.langType,
        langIndex:action.payload.index
      }
    default:
      return state
  }
}