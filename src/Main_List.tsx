import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  RefreshControl,
  Modal,
  Alert,
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React, {useEffect, useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './Api.tsx';
import messaging from '@react-native-firebase/messaging';
function Main_List(): React.JSX.Element {
    console.log('--Main()');
    const [callList, setCallList] = useState([]);
    const [loading, setLoading] = useState(false);


    useFocusEffect(React.useCallback(()=>{
        requestCallList();
    },[]));

    const requestCallList = async () =>{
        setLoading(true);
        let userId = await AsyncStorage.getItem('userId') || '';
        api.list(userId)
          .then(res=>{
              let {code,message,data} = res.data[0];
              if(code == 0){
                  setCallList(data);

              }else{
                  Alert.alert('오류',message,[{
                      text:'확인',
                      onPress: ()=>console.log('Cancel pressed'),
                      style:'cancel',
                  }]);
              }
              setLoading(false);
          })
          .catch(err=>{
              console.log(JSON.stringify(err));
              setLoading(false);
          });

    };
    const Header = ()=>(
        <View style={styles.header}>
            <Text style={[styles.headerText, {width:wp(80)}]}>출발지 / 도착지</Text>
            <Text style={[styles.headerText, {width:wp(20)}]}>상태</Text>
        </View>
    );

    const ListItem = (row:any) =>{
        console.log('row = '+ JSON.stringify(row));
        return(
          <View style={{flexDirection:'row',marginBottom:5, width:wp(100)}}>
              <View style={{width:wp(80)}}>
                  <Text style={styles.textForm}>{row.item.start_addr}</Text>
                  <Text style={[styles.textForm,{borderTopWidth:0}]}>{row.item.end_addr}</Text>
                  <Text style={styles.textForm}>{row.item.formatted_time}</Text>
              </View>
              <View style={{width:wp(20),alignSelf:'center',justifyContent:'center'}}>
                {row.item.call_state == "RES" ? (
                  <Text style={{color:'blue'}}>{row.item.call_state}</Text>
                ) : (
                  <Text style={{color:'gray'}}>{row.item.call_state}</Text>
                  )}
              </View>
          </View>
        );
    };

  useEffect(() => {
    const message = messaging().onMessage(remoteMessage=>{
      console.log('remote message = '+remoteMessage);
      requestCallList();
    });
    return message;
  }, []);

    return(
        <SafeAreaView style={styles.container}>
            <FlatList data={callList}
                      renderItem={ListItem}
                      style={{flex:1}}
                      ListHeaderComponent={Header}
              // @ts-ignore
                      keyExtractor={(item)=>item.id}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={requestCallList}/>
            }/>
            <Modal transparent={true} visible={loading}>
                <View style={{flex:1, justifyContent:'center', alignSelf:'center'}}>
                    <Icon name={'spinner'} size={50} color={'#3498db'}/>
                    <Text style={{color:'black'}}>Loading...</Text>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
    },
    header:{
        flexDirection:'row',
        height:50,
        marginBottom:5,
        backgroundColor:'#3498db',
        color:'white',
        alignItems:'center',
    },
    headerText:{
        fontSize:18,
        textAlign:'center',
        color:'white',
    },
    textForm:{
        flex:1,
        borderWidth:1,
        borderColor:'#3498db',
        height:hp(5),
        paddingLeft:10,
        paddingRight:10,

    },
  button: {
    width: '70%',
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
export default Main_List;
