export function fetchData (data) {
  return {
    type: 'FETCH_DATA',
    payload:data
  }
}

export function fetchingData (data) {
  return {
    type: 'FETCHING_DATA',
    payload:data
  }
}

export function resetSimProductData () {
  return {
    type: 'FETCH_SIM_PRODUCT_DATA_RESET'
  }
}

export function resetSimData () {
  return {
    type: 'FETCH_SIM_DATA_RESET',
  }
}

export function getDataFailure (error) {
  return {
    type: 'FETCH_DATA_FAILURE',
    errorMessage: error
  }
}
