const initialState = {
  base_url:'',
  base_media_url:'',
  isLoading:true,
}

export default function ( state = initialState, action){
  let user_data;
  switch(action.type){
    case 'FETCHING_STORE_CONFIG_SUCCESS':
      var rows = action.data.data;
      global.storeMediaURL = rows[0].base_media_url;
      global.storeURL = rows[0].base_url;
      global.websiteId = rows[0].website_id;
      global.storeId = rows[0].id;
      return {
        base_url:rows[0].base_url,
        base_media_url:rows[0].base_media_url,
      }
    case 'FETCHING_STORE_CONFIG_ERROR':
      return {
        ...state,
        isLoading:false
      }
    default:
      return state
  }
}