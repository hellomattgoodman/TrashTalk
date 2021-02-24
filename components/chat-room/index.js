import React, { useState } from 'react';
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import firestore from '@react-native-firebase/firestore';

const ChatRoom = props => {
  const [messageText, setMessageText] = useState('');

  const submitMessage = () => {
    firestore()
      .collection('chats')
      .doc(props.RoomCode)
      .collection("messages")
      .add({
        messageText: messageText,
        author: {
          uid: props.Auth().currentUser.uid,
          photoURL: props.Auth().currentUser.photoURL,
          displayName: props.Auth().currentUser.displayName,
        },
        messageDate: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Keyboard.dismiss();
        setMessageText('');
      });
  }


  /* put the getMyself function here */

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
        <View style={styles.innerContainer}>
          <View style={styles.headerColumn}>
            <View style={styles.headerNavRow}>
              <TouchableOpacity style={styles.backButton} onPress={() => props.updateScreen('join-or-create')}>
                <Icon name="arrow-back" size={24} color="#D7F75B" />
              </TouchableOpacity>
              <View style={styles.roomCodeContainer}>
                <Text style={styles.roomCodeLabel}>
                  {"Room Code"}
                </Text>
                <Text style={styles.roomCode}>
                  {props.RoomCode}
                </Text>
              </View>
              <View style={{height: 36, width: 36, borderRadius: 18}} />
            </View>

            {/* Put your ScrollView here */}

          </View>
          <FlatList
            style={styles.chatMessages}
            contentContainerStyle={styles.chatMessagesContainer}
            inverted={true}
            data={props.Messages}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item, index }) => (
              <View style={styles.messageContainer} onStartShouldSetResponder={() => { return true }}>
                {item.data.author.uid === props.Auth().currentUser.uid ? (
                  <>
                    <View style={styles.myMessage}>
                      <Text style={styles.messageText}>
                        {item.data.messageText}
                      </Text>
                    </View>
                    <Image source={{uri: item.data.author.photoURL}} style={{...styles.chatAvatar, marginLeft: 12}} />
                  </>
                  ) : (
                  <>
                    <Image source={{uri: item.data.author.photoURL}} style={{...styles.chatAvatar, marginRight: 12}} />
                    <View style={styles.yourMessage}>
                      <Text style={styles.messageText}>
                        {item.data.messageText}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            )}
          />
          <View style={styles.newMessage}>
            <TextInput
              style={styles.textInput}
              placeholder="Type your message here..."
              placeholderTextColor="#A682FF"
              value={messageText}
              onChangeText={text => setMessageText(text)}
              multiline={true}
              onSubmitEditing={() => submitMessage()}
              returnKeyType="done"
              blurOnSubmit={true}
              />
            <TouchableOpacity style={styles.addIcon} onPress={() => submitMessage()}>
              <Icon name="add-circle-outline" color="#A682FF" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#302853",
    flexDirection: "column",
    flexGrow: 1,
    height: "100%",
  },
  innerContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    height: "100%",
  },
  headerColumn: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#434187",
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  headerNavRow: {
    flexDirection: "row",
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 24,
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B3772",
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  roomCodeContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  roomCodeLabel: {
    fontFamily: "Roboto-Light",
    fontSize: 12,
    color: "#FFFFFF",
    textTransform: "uppercase",
    textAlign: "center",
  },
  roomCode: {
    fontFamily: "Roboto-Black",
    fontSize: 14,
    color: "#D7F75B",
    textTransform: "uppercase",
    textAlign: "center",
  },
  participantAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#434187",
    borderWidth: 1,
    borderColor: "#8A8A8A",
  },
  userContainer: {
    flexDirection: "column",
    marginLeft: 12,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "flex-start",
    maxWidth: 60,
  },
  userName: {
    fontFamily: "Roboto-Light",
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
  distance: {
    fontFamily: "Roboto-Black",
    fontSize: 12,
    color: "#FFFFFF",
    textAlign: "center",
  },
  scrollViewStyles: {
    paddingLeft: 6,
    paddingBottom: 12,
    flexGrow: 0,
    width: "100%",
  },
  scrollViewContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexGrow: 1,
  },
  chatMessages: {
    padding: 12,
    width: "100%",
    flex: 1,
  },
  chatMessagesContainer: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  messageContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
    marginVertical: 12,
  },
  myMessage: {
    flex: 1,
    marginLeft: 36,
    backgroundColor: "#186355",
    padding: 12,
    borderRadius: 4,
  },
  yourMessage: {
    flex: 1,
    marginRight: 36,
    backgroundColor: "#434187",
    padding: 12,
    borderRadius: 4,
  },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderColor: "#858585",
    borderWidth: 1,
  },
  messageText: {
    fontFamily: "Roboto-Light",
    fontSize: 14,
    color: "#FFFFFF",
  },
  newMessage: {
    padding: 12,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: "#434187",
    flexDirection: "row",
    width: "100%",
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: "#3B3772",
    padding: 12,
    fontFamily: "Roboto-Light",
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "left",
    borderTopLeftRadius: 2,
    borderBottomLeftRadius: 2,
    flex: 1,
  },
  addIcon: {
    backgroundColor: "#3B3772",
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },

});

export default ChatRoom;
