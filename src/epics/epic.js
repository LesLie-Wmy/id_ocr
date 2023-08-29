import { Alert, BackHandler } from 'react-native'
import { combineEpics, ofType } from "redux-observable";
import { concat, of, forkJoin, Observer, Observable, throwError, timer, from } from 'rxjs'
import {
  switchMap,
  map,
  flatMap,
  concatMap,
  catchError,
  mapTo,
  mergeMap,
  concatMapTo,
  startWith,
  takeUntil,
  tap,
  retryWhen,
  delayWhen,
  delay,
  filter,
  throttle,
  finalize,
  toArray
} from "rxjs/operators";
import { ajax } from 'rxjs/ajax';
import { Actions } from 'react-native-router-flux'
import { fetchingData as refetch } from '../actions/fetch'
import I18n from '../langs';
// import axios from 'axios';
import RNExitApp from 'react-native-exit-app';

const host = "hkwSimBackend/";
var retries = 3;

var result;

var isExpired = false;
// const hosting = "hkwSimBackend/";
const checkToken = (data) => {
  let now = new Date;
  let utc_timestamp = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
    now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

  // if(data.tokenExpired && utc_timestamp > data.tokenExpired){
  isExpired = true;
  // throwError('tokenExpired');
  // return({ type: "NAVIGATE_BACK" });

  return Observable.create((observer: Observer<Action>) => {
    if (global.isExpiredAlert) {
      // observer.complete();
      of({ type: "NOTHING_TO_DO" })
    } else {
      global.isExpiredAlert = true;
      setTimeout(() => {
        Alert.alert(
          I18n.t("Token Expired"),
          I18n.t("Please login your account again"),
          [
            { text: I18n.t('Exit'), onPress: () => RNExitApp.exitApp() },
            {
              text: I18n.t('Go to Login'), onPress: () => {
                global.isExpiredAlert = false;
                Actions.Login();
                observer.next({ type: 'USER_TOKEN_EXPIRED', payload: data });
                observer.complete();
              }
            },
          ],
          { cancelable: false }
        )
      }, 2000);
    }

  })
  // }

}

const dataFetching = action => {
  let now = new Date;
  let utc_timestamp = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
    now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

  if(action.payload.data){
    if(action.payload.data.tokenExpired && utc_timestamp > action.payload.data.tokenExpired){
      return Observable.create((observer: Observer<Action>) => {
        if (global.isExpiredAlert) {
          // observer.complete();
          // of({ type: "NOTHING_TO_DO" })
          of({ type: action.payload.rejected, data: action.payload.data })
        } else {
          global.isExpiredAlert = true;
          setTimeout(() => {
            Alert.alert(
              I18n.t("Token Expired"),
              I18n.t("Please login your account again"),
              [
                { text: I18n.t('Exit'), onPress: () => RNExitApp.exitApp() },
                {
                  text: I18n.t('Go to Login'), onPress: () => {
                    global.isExpiredAlert = false;
                    Actions.Login();
                    observer.next({ type: 'USER_TOKEN_EXPIRED' });
                    observer.complete();
                  }
                },
              ],
              { cancelable: false }
            )
          }, 1000);
        }
    
      })
    }
  }
  
  return ajax({
    url: global.storeApiURL + action.payload.url,
    method: action.payload.method,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      'Accept': 'application/json',
      "Authorization": `Bearer ${action.payload.Auth}`
    },
    body: action.payload.data,
    timeout: 1000 * 30,
    responseType: 'json'
  })
    .pipe(
      // map(response => action.payload.callback?action.payload.callback(response, false):''),
      map(response => {
        /** For ajax */
        result = response.response;

        /** For axios */
        // result = response.data;

        // count = 0;
        // console.log("epics" + JSON.stringify(data));
        if (result != null) {
          if (result.status === 'success') {
            // if(action.payload.callback)
            //   action.payload.callback(result, false);
            return ({ type: action.payload.next, data: result })
          } else {
            // if (action.payload.callback) {
            //   result['status'] = "On Load Data Error";
            //   // action.payload.callback(result, true);
            // }
            return ({ type: action.payload.rejected, data: result })
          }
        } else {
          throw 'no data';
        }
      })
      ,finalize(() => {
        if (action.payload.callback) {
          if (result.status === 'success') {
            action.payload.callback(result, false);
          } else {
            action.payload.callback(result, true);
          }
        }
      })
      // ,takeUntil(action.type == 'NAVIGATE_BACK')
      // ,retryWhen(errors$ => 
      //   errors$.pipe(
      //     delay(1000),
      //     map(() =>{
      //       retries -= 1;
      //       if(retries===0){
      //         throw new Error('Maximum retries reached')
      //       }
      //     })
      //     //log error message
      //     // tap(() => console.log(`Value 3 was too high!`)),
      //     //restart in 6 seconds
      //     // delayWhen(() => timer(3 * 1000))
      //   )
      // )
      ,catchError((error, source) => {
        if (error.status == 0) {
          if (error.name == "AjaxTimeoutError") {
            return Observable.create((observer: Observer<Action>) => {
              setTimeout(() => {
                Alert.alert(
                  I18n.t("Network Error"),
                  I18n.t("NetworkTimeout"),
                  [
                    { text: I18n.t('Exit'), onPress: () => RNExitApp.exitApp() },
                    { text: I18n.t('RETRY'), onPress: () => { observer.next({ type: 'FETCH_DATA', payload: action.payload }); observer.complete() } },
                  ],
                  { cancelable: false }
                )
              }, 2000);
            })
          } else { //if(error.name=="AjaxError"){
            return Observable.create((observer: Observer<Action>) => {
              setTimeout(() => {
                Alert.alert(
                  I18n.t("Network Error"),
                  I18n.t("Connect To Network Error"),
                  [
                    { text: I18n.t('Exit'), onPress: () => RNExitApp.exitApp() },
                    { text: I18n.t('RETRY'), onPress: () => { observer.next({ type: 'FETCH_DATA', payload: action.payload }); observer.complete() } },
                  ],
                  { cancelable: false }
                )
              }, 2000);
            })
          }


        } else if (action.payload.callback)
          action.payload.callback(error, true)
        return (
          of({
            type: action.payload.rejected,
            payload: error,
            error: action
          })
        )
      })
    )
  
}

const start = action => {
  if(action.payload.start)
    return of({ type: action.payload.start, data: action.payload.data }); 
  else
    return of({ type: "NOTHING_TO_DO" })
}


const fetchData = (action$, store) => action$.pipe(
  ofType('FETCH_DATA'),
  mergeMap(action => concat(
      // concat(
      // tap(action => action.payload.start ? of({ type: action.payload.start, data: action.payload.data }) : of({ type: "NOTHING_TO_DO" }))
      // ajax.getJSON(`https://api.github.com/users/torvalds`)
      /*  ajax  */
      start(action)
      ,dataFetching(action)
    )
  )
  ,takeUntil(action$.ofType('NAVIGATE_BACK'))
  
);


export default epics = combineEpics(
  fetchData
);