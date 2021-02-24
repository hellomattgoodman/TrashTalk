/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';

import auth from '@react-native-firebase/auth';

import Greeting from './components/greeting';
import Registration from './components/registration';
import LoginError from './components/login-error';
import Login from './components/login';
import ConfigureProfile from './components/configure-profile';
import CreateOrJoin from './components/create-or-join';
import firestore from '@react-native-firebase/firestore';
import ChatRoom from './components/chat-room';

const App: () => React$Node = () => {
  const [currentScreen, setCurrentScreen] = useState('greeting');
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const [error, setError] = useState({errorTitle: '', errorDescription: '', returnScreen: '' });
  const [roomCode, setRoomCode] = useState(null);
  const [roomUsers, setRoomUsers] = useState();
  const [roomMessages, setRoomMessages] = useState();

  //subscribe to authorization events
  useEffect(() => {
    const authSubscriber = auth().onAuthStateChanged(onAuthStateChanged);

    //check for location permissions here

    //destroy the authSubscriber when the component unmounts
    return authSubscriber;
  }, []);

  //when the roomCode state variable changes, cancel any current subscriptions and then create a new one
  //add the roomCode useEffect hook here 

  //get user's current location
  //write the getCurrentPosition function here

  //handle user state changes
  const onAuthStateChanged = user => {
    setUser(user);
    if (initializing) {
      setInitializing(false);
    }
  };

  //register a new account
  const doRegister = (email, password) => {
    auth().createUserWithEmailAndPassword(email, password)
    .then(() => {
      setCurrentScreen('configure-profile');
    })
    .catch(err => {
      if (err.code === 'auth/email-already-in-use') {
        //show error screen
        setError({ errorTitle: 'You shall not pass.', errorDescription: 'Someone has already created an account with this email address. Was it you?', returnScreen: 'registration'});
      } else if (err.code === 'auth/invalid-email') {
        //show error screen
        setError({ errorTitle: 'You shall not pass.', errorDescription: "Whoops. Looks like the email address you provided wasn't valid. Do you want to try again?", returnScreen: 'registration' });
      } else if (err.code === 'auth/operation-not-allowed') {
        setError({ errorTitle: 'You shall not pass.', errorDescription: "Sorry, but we're not accepting new accounts at this time. Please try again later!", returnScreen: 'greeting'});
      } else if (err.code === 'auth/weak-password') {
        setError({ errorTitle: 'You shall not pass.', errorDescription: "Your password isn't strong enough. Please try a new password that uses mixed case letters, numbers, and symbols.", returnScreen: 'registration'});
      }
      setCurrentScreen('error');
    });
  };

  //log in an existing account
  const doSignIn = (email, password) => {
    auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      setCurrentScreen('join-or-create');
    })
    .catch(err => {
      if ((err.code === 'auth/invalid-email') || (err.code === 'auth/wrong-password') || (err.code === 'auth/user-not-found')) {
        setError({ errorTitle: 'You shall not pass.', errorDescription: "The email address or password you've entered don't match our records. Would you like to try again?", returnScreen: 'login' });
      } else if (err.code === 'auth/user-disabled') {
        setError({ errorTitle: 'You shall not pass.', errorDescription: "Your account has been disabled by an administrator.", returnScreen: 'greeting'});
      }
      setCurrentScreen('error');
    });
  };

  //log out a logged in user
  const doSignOut = () => {
    auth().signOut();
  };

  //switch the view to a different screen
  const updateScreen = screen => {
    setCurrentScreen(screen);
  };

  //join a room with a given room code
  //write the joinRoom function here

  //if still waiting on Firebase to authenticate, show a blank screen
  if (initializing) {
    return null;
  }

  /*return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ChatRoom Auth={auth} CurrentLocation={currentLocation} updateScreen={updateScreen} RoomCode="SHKW" RoomUsers={users} Messages={messages}/>
      </SafeAreaView>
    </>
  )*/

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        { currentScreen === 'error' ? <LoginError ErrorDetails={error} updateScreen={updateScreen} /> : null }
        { currentScreen === 'greeting' ? <Greeting updateScreen={updateScreen} Auth={auth} doSignOut={doSignOut} /> : null }
        { currentScreen === 'registration' ? <Registration updateScreen={updateScreen} doRegister={doRegister} /> : null }
        { currentScreen === 'configure-profile' ? <ConfigureProfile Auth={auth} updateScreen={updateScreen} /> : null }
        { currentScreen === 'login' ? <Login doSignIn={doSignIn} updateScreen={updateScreen} /> : null }
        { currentScreen === 'join-or-create' ? <CreateOrJoin updateScreen={updateScreen} joinRoom={joinRoom} /> : null }
        { currentScreen === 'messages' ? <ChatRoom Auth={auth} updateScreen={updateScreen} RoomCode={roomCode} RoomUsers={roomUsers} Messages={roomMessages} /> : null }
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({

});

export default App;
