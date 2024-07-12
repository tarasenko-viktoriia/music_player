import React, { useState } from 'react';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { Router, Route, Link, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

const history = createHistory();

function jwtDecode(token) {
  try {
    const [, data] = token.split('.');
    const json = atob(data);
    const result = JSON.parse(json);
    return result;
  } catch (e) {
    console.error('Failed to decode JWT:', e);
    return null;
  }
}

const ShowLogin = () => {
  const login = useSelector((state) => state.auth.payload?.sub.login);
  const nick = useSelector((state) => state.auth.payload?.sub.nick);
  const avatarUrl = useSelector((state) => state.auth.profile?.avatar?.url);

  return (
    <span>
      {avatarUrl && <img src={avatarUrl} alt="avatar" style={{ width: '50px', borderRadius: '50%' }} />}
      Hi, {nick || login || 'Anon'}
    </span>
  );
};

const Logout = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.token);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button onClick={handleLogout} disabled={!isLoggedIn}>
      Logout
    </button>
  );
};

const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, payload: null, profile: null },
  reducers: {
    login(state, { payload: token }) {
      const decoded = jwtDecode(token);
      if (decoded) {
        state.payload = decoded;
        state.token = token;
      }
    },
    logout(state) {
      state.payload = null;
      state.token = null;
      state.profile = null;
    },
    setProfile(state, { payload }) {
      state.profile = payload;
    },
    registerSuccess(state, { payload }) {
      // Handle successful registration if needed
    },
  },
});

const { login, logout, registerSuccess } = authSlice.actions;

const api = createApi({
  baseQuery: graphqlRequestBaseQuery({
    url: 'http://player.node.ed.asmer.org.ua/graphql',
    prepareHeaders(headers, { getState }) {
      const { token } = getState().auth;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getRootCats: builder.query({
      query: () => ({
        document: `query {
          CategoryFind(query: "[{\\"parent\\": null}]"){
            _id name
          }
        }`,
      }),
    }),
    login: builder.mutation({
      query: ({ login, password }) => ({
        document: `
          query login($login: String!, $password: String!) {
            login(login: $login, password: $password) 
          }
        `,
        variables: { login, password },
      }),
    }),
    getUserById: builder.query({
      query: ({ _id }) => ({
        document: `query oneUser($query: String){
          UserFindOne(query: $query){
            _id login nick avatar { url }
          }
        }`,
        variables: { query: JSON.stringify([{ _id }]) },
      }),
      providesTags: (result, error, { _id }) => [{ type: 'User', id: _id }],
    }),
    setUserNick: builder.mutation({
      query: ({ _id, nick }) => ({
        document: `
          mutation setNick($_id: String!, $nick: String!) {
            UserUpsert(user: { _id: $_id, nick: $nick }) {
              _id nick
            }
          }
        `,
        variables: { _id, nick },
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: 'User', id: _id }],
    }),
    registerUser: builder.mutation({
      query: ({ login, password }) => ({
        document: `
        mutation register($login:String!, $password:String!) {
          createUser(login:$login, password:$password){
          _id login
          }
        }
        `,
        variables: { login, password },
      }),
      onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          if (result.data && result.data.register) {
            dispatch(authSlice.actions.login(result.data.register.token));
            // Optionally dispatch other actions after successful registration
          }
        } catch (error) {
          console.error('Registration error:', error);
        }
      },
    }),
    uploadAvatar: builder.mutation({
      query: ({ _id, avatar }) => ({
        document: `
          mutation uploadAvatar($_id: String!, $avatar: ImageInput!) {
            UserUpsert(user: { _id: $_id, avatar: $avatar }) {
              _id
              avatar {
                url
              }
            }
          }
        `,
        variables: { _id, avatar },
      }),
      invalidatesTags: (result, error, { _id }) => [{ type: 'User', id: _id }],
    }),
  }),
});

const { useGetUserByIdQuery, useLoginMutation, useSetUserNickMutation, useUploadAvatarMutation } = api;

const actionFullLogin = ({ login, password }) => async (dispatch) => {
  try {
    const token = await dispatch(api.endpoints.login.initiate({ login, password }));
    if (token?.data?.login) {
      dispatch(authSlice.actions.login(token.data.login));
      await dispatch(actionAboutMe());
    }
  } catch (error) {
    console.error('Login failed:', error);
  }
};

const actionAboutMe = () => async (dispatch, getState) => {
  const { auth } = getState();
  if (auth.payload) {
    const { id } = auth.payload.sub;
    await dispatch(api.endpoints.getUserById.initiate({ _id: id }));
  }
};

const RegisterForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleRegister = async () => {
    try {
      const result = await dispatch(api.endpoints.registerUser.initiate({ login, password }));
      console.log(result);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div>
      <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

const AvatarUpload = () => {
  const [avatar, setAvatar] = useState(null);
  const [uploadAvatar, { isLoading }] = useUploadAvatarMutation();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.payload?.sub?.id);
  const [avatarUrl, setAvatarUrl] = useState(null); // Додано стан для зберігання URL аватара

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('avatar', avatar);
    const result = await uploadAvatar({ _id: userId, avatar: formData });


    if (result.data?.UserUpsert?.avatar?.url) {
      setAvatarUrl(result.data.UserUpsert.avatar.url);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={isLoading || !avatar}>
        Upload Avatar
      </button>
      {avatarUrl && (
        <div>
          <h2>Uploaded Avatar:</h2>
          <img src={avatarUrl} alt="Avatar" style={{ maxWidth: '100px', maxHeight: '100px' }} />
        </div>
      )}
    </div>
  );
};
const store = configureStore({
  reducer: {
    [authSlice.name]: persistReducer({ key: 'auth', storage }, authSlice.reducer),
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
});

const persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <Router history={history}>
        <Header />
        <main>
          <Switch>
            <Route path="/" component={PageMain} exact />
            <Route path="/login" component={PageLogin} />
            <Route path="/register" component={RegisterForm} /> {/* Route for registration */}
          </Switch>
        </main>
      </Router>
    </Provider>
  );
}

const PageMain = () => (
  <>
    <h1>Головна</h1>
    <ShowNick />
    <ChangeNick />
    <AvatarUpload /> {/* Додано для завантаження аватара */}
  </>
);

const PageLogin = () => {
  const isLoggedIn = useSelector((state) => state.auth.token);
  if (isLoggedIn) {
    history.push('/');
  }

  return (
    <>
      <h1>Сторінка Логіну</h1>
      <LoginForm />
    </>
  );
};

const ShowNick = () => {
  const { isLoading, data } = useGetUserByIdQuery({ _id: '668e258eca40d81010702e0d' });
  if (isLoading) return <h2>Завантаження інформації користувача...</h2>;

  console.log('User data:', data);
  const nick = data?.UserFindOne?.nick;

  return <h2>{nick || 'NO NICK'}</h2>;
};

const ChangeNick = () => {
  const [nick, setNick] = useState('');
  const [updateNick, { isLoading }] = useSetUserNickMutation();

  const handleUpdateNick = () => {
    updateNick({ _id: '668e258eca40d81010702e0d', nick });
  };

  return (
    <>
      <input value={nick} onChange={(e) => setNick(e.target.value)} />
      <button disabled={isLoading} onClick={handleUpdateNick}>
        Save Nick
      </button>
    </>
  );
};

const LoginForm = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleLogin = () => {
    dispatch(actionFullLogin({ login, password }));
  };

  return (
    <div>
      <input value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleLogin}>Login...</button>
    </div>
  );
};

const Header = () => (
  <header>
    <ShowLogin />
    <Logout />
    <Link to="/">Головна</Link>
    <Link to="/login">Увійти</Link>
    <Link to="/register">Зареєструватись</Link>
  </header>
);

export default App;
