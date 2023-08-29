const initialState = {
  user:{},
  login:false,
  skipLogin:false,
}

export default function ( state = initialState, action){
  let user_data;
  let attributes = {};
  switch(action.type){
    case 'FETCH_ADD_USER_SUCCESS':
      var rows = action.data.data;
      
      rows.custom_attributes.forEach(attribute => {
        attributes[attribute.attribute_code] = attribute.value;
      });

      return {
        ...state,
        user:rows,
        login:false,
      }
    case 'FETCH_VERIFICATION_USER_SUCCESS':
      var rows = action.data.data;

      Object.values(rows.custom_attributes).forEach(attribute => {
        attributes[attribute.attribute_code] = attribute.value;
      });
      
      rows.custom_attributes = attributes;

      return {
        ...state,
        user:rows,
        login:true
      }

    case 'FETCH_SAVE_ADDRESS_SUCCESS':
      var user = state.user;
      user.addresses = action.data.data.addresses;
      return {
        ...state,
        user:user
      }
    case 'FETCH_USER_LOGIN_SUCCESS':
      var rows = action.data.data;
      
      rows.custom_attributes.forEach(attribute => {
        attributes[attribute.attribute_code] = attribute.value;
      });
      
      rows.custom_attributes = attributes;
      return {
        ...state,
        user:rows,
        login:true
      }
    case 'FETCH_USER_OPEN_ID_LOGIN_SUCCESS':
      var rows = action.data.data;
      
      rows.custom_attributes.forEach(attribute => {
        attributes[attribute.attribute_code] = attribute.value;
      });
      
      rows.custom_attributes = attributes;
      return {
        ...state,
        user:rows,
        login:true
      }
    case 'FETCH_USER_DATA_START':
      return {
        ...state,
      }
    case 'FETCH_USER_DATA_SUCCESS':
      var rows = action.data.data;

      rows.custom_attributes.forEach(attribute => {
        attributes[attribute.attribute_code] = attribute.value;
      });
      
      rows.custom_attributes = attributes;
      return {
        ...state,
        user:rows,
        isLoading:false
      }
    case 'FETCH_USER_DATA_ERROR':
      return {
        ...state,
        isLoading:false
      }
    case 'ADDRESS_SET_DEFAULT':
      state.user.default_shipping = action.payload;
      return{
        ...state,
        // list:state.list.splice(action.index, 1)
      }
    case 'FETCHING_MINE_INFO_SUCCESS':
      state.user.address = action.data.data.addresses;
      
      action.data.data.custom_attributes.forEach(attribute => {
        attributes[attribute.attribute_code] = attribute.value;
      });

      state.user.custom_attributes = attributes;

      if(action.data.data.default_shipping){
        state.user.default_shipping = action.data.data.default_shipping;
      }else{
        if(action.data.data.addresses[0]){
          state.user.default_shipping = action.data.data.addresses[0].id
        }
      }
      
      return{
        ...state,
        // list:state.list.splice(action.index, 1)
      }
    case 'SKIP_LOGIN':
      return{
        ...state,
        skipLogin:true,
        // list:state.list.splice(action.index, 1)
      }
    case 'LOGOUT_USER':
      state = initialState;
      return { 
        ...state
      };
    case 'USER_TOKEN_EXPIRED':
      state = initialState;
      return { 
        ...state
      };
    case 'ADDRESS_ADD':
      user_data = state.user;
      if(action.data.default){
        user_data.address = action.data
      }
      return { 
        ...state,
        user:user_data
      };
    case 'FETCH_VERIFICATION_ICCID_SUCCESS':
      var rows = action.data.data;
      
      rows.custom_attributes.forEach(attribute => {
        attributes[attribute.attribute_code] = attribute.value;
      });
      
      rows.token = state.user.token;
      rows.tokenExpired = state.user.tokenExpired;
      rows.custom_attributes = attributes;
      return { 
        ...state,
        user:rows
      };
      
    case 'SEND_REFERRAL_CODE_SUCCESS':
      var rows = action.data.data;
      
      rows.custom_attributes.forEach(attribute => {
        attributes[attribute.attribute_code] = attribute.value;
      });
      
      rows.custom_attributes = attributes;
      return { 
        ...state,
        user:rows
      };

    case 'SEND_REFERRAL_CODE_ERROR':
        return state
    case 'UPDATE_STATUS_SUCCESS':
        user_data = state.user;
        user_data.points = action.data.points;
        return { 
          ...state,
          user:user_data
        };
    default:
      return state
  }
}