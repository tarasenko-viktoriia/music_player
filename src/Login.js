import React, {useState, useEffect,useRef} from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import {Provider, useSelector, useDispatch}         from 'react-redux';
import {Router, Route, Link, Redirect, useParams, Switch} from 'react-router-dom';
import createHistory from "history/createBrowserHistory";
import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query'
import storage from 'redux-persist/lib/storage'; //рушій localStorage для персіста
import {persistReducer, persistStore, FLUSH,     //localStoredReducer, екшони та таке інше
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER} from 'redux-persist';

const history = createHistory()

function jwtDecode(token){
  try {
    const [,data] = token.split('.')
    const json    = atob(data)
    const result  = JSON.parse(json) 
    return  result
  }
  catch(e){} 
}



const ShowLogin = () => {
  const login = useSelector(state => state.auth.payload?.sub.login)
  return (
    <span> Hi, {login || 'Anon'}</span>
  )
}

const Logout = () => {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(state => state.auth.token)
  return (
    <button onClick={() => dispatch(logout())}
            disabled={!isLoggedIn}>Logout</button>
  )
}



const authSlice = createSlice({
  name: 'auth',
  initialState: {token: null, payload: null, profile: null},
  reducers: {
      login(state, {payload:token}){
          const payload = jwtDecode(token)
          if (payload){
              state.payload = payload
              state.token   = token
          }
      },
      logout(state){
          state.payload = null
          state.token   = null
          state.profile = null
      },
      setProfile(state, {payload}){
        //встановити profile в state в передане значення payload
      }
  }
})
const {login, logout} = authSlice.actions

const api = createApi({
  baseQuery: graphqlRequestBaseQuery({
    //   url: 'http://shop-roles.node.ed.asmer.org.ua/graphql',
      url: 'http://player.node.ed.asmer.org.ua/graphql',
      prepareHeaders(headers, {getState}){
        const { token } = getState().auth //отримуємо токен
        if (token){ //якщо ми залогінени
            headers.set('Authorization', "Bearer " + token) //додаємо токен до заголовків
        }
        console.log(getState().auth)
        return headers
    }
  }),
  endpoints: (builder) => ({
    getRootCats:builder.query({
        query: () => ({
            document: `query {
                            CategoryFind(query: "[{\\"parent\\": null}]"){
                                _id name
                            }
                        }`
        }),
    }),
    login: builder.mutation({
      query: ({login, password}) => ({
          document: `
              query login($login: String!, $password: String!) {
                  login(login: $login, password: $password) 
              }
              `,
          variables: {login, password}})
    }),
    getUserById: builder.query({
      query: ({_id}) => ({ 
          document: `query oneUser($query: String){
              UserFindOne(query: $query){
                  _id login nick avatar{ url }
              }
          }`,
          variables: {query: JSON.stringify([{_id}])}
      }),
      providesTags: (result, error, {_id}) => {  //функція, яка створює тег, який ідентіфікує користувача
          return ([{ type: 'User', id: _id}])
      }
    }),
    setUserNick: builder.mutation({
      query: ({_id, nick}) => ({
          document: `
              mutation setNick($_id:String!, $nick:String!) {
                  UserUpsert(user: {_id: $_id, nick: $nick}){
                      _id nick
                  }
              }
              `,
          variables: {_id, nick}
      }),
      invalidatesTags: (result, error, {_id}) => ([{type: 'User', id: _id}])
    })
  })
})

const {useGetUserByIdQuery, useGetRootCatsQuery, useGetCategoryByIdQuery, useLoginMutation, useSetUserNickMutation} = api 

const actionFullLogin = ({login, password}) =>
  async dispatch => {
      const token = await dispatch(api.endpoints.login.initiate({login, password}))  
      console.log(token)
      if (token?.data?.login){
          dispatch(authSlice.actions.login(token.data.login))
          await dispatch(actionAboutMe()) 
      }
  }

const actionAboutMe = () => 
    async (dispatch, getState) => {
        const {auth} = getState()
        if (auth.payload){
            const {id} = auth.payload.sub
            await dispatch(api.endpoints.getUserById.initiate({_id: id})) //для зручності має сенс перекласти інформацію про себе в додатковий ключ authReducer
            //треба додати якесь збереження нашого поточного користувача в authSlice
        }
    }


const ShowNick = () => {
  const {isLoading, data} = useGetUserByIdQuery({_id: '668e258eca40d81010702e0d'})
  if (isLoading)
    return <h2>loading user data</h2>
  console.log(data)
  const nick = data?.UserFindOne?.nick 
  return (
    <h2>{nick || 'NO NICK'}</h2>
  )
}

const ChangeNick = () => {
  const [nick, setNick] = useState('')
  const [updateNick, {isLoading, data}] = useSetUserNickMutation()
  return (
    <>
    <input value={nick} onChange={e => setNick(e.target.value)} />
    <button disabled={isLoading}
          onClick={() => updateNick({_id: '668e258eca40d81010702e0d', nick})}
          >Save Nick</button>
    </>
  )
}

const LoginForm = () => {
  const [login, setLogin] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  return (
      <div>
          <input value={login} onChange={e => setLogin(e.target.value)}/>
          <input value={password} onChange={e => setPassword(e.target.value)}/>
          <button onClick={() => dispatch(actionFullLogin({login, password}))}>
              Login...
          </button>
      </div>
  )
}


const store = configureStore({
  reducer: { 
            [authSlice.name]:persistReducer({key: 'auth', storage}, authSlice.reducer),
            [api.reducerPath]: api.reducer 
           },
  middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware) 
})
const persistor = persistStore(store)
store.subscribe(() => console.log(store.getState()))
console.log(store)


const PageMain = () => 
<>
  <h1>Головна</h1>
  <ShowNick/>
  <ChangeNick/>
</>

const PageAbout = () => 
<>
  <h1>О нас</h1>
</>


const PageLogin = () => {
  const isLoggedIn = useSelector(state => state.auth.token)
  if (isLoggedIn)
    history.push('/')
  return (
    <>
      <h1>Сторінка Логіну</h1>
      <LoginForm/>
    </>
  )
}

const Header = () =>
<header>
  <ShowLogin /><Logout/>
  <Link to="/">Головна</Link>
  <Link to="/login">Увійти</Link>
</header>


function App(){ 
  return (
      <Provider store={store}>
        <Router history = {history}>
          <Header />
         
          <main>
            <div>
            <Switch>
              <Route path="/" component={PageMain} exact />
              <Route path="/about" component={PageAbout} />
              <Route path="/login" component={PageLogin} />   
            </Switch>
            </div>      
          </main>
        </Router>
      </Provider> 
  )
}

export default App;
