import {SafeAreaView, StyleSheet, Text, Modal, TouchableOpacity, View,Alert} from 'react-native';
import React, {useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Geolocation from '@react-native-community/geolocation';
import MapView,{PROVIDER_GOOGLE,Marker,Polyline} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import api from './Api.tsx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {useNavigation,ParamListBase} from '@react-navigation/native';

function Main_Map(): React.JSX.Element {
    console.log('--Main()');
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();

    const callTaxi = async ()=>{
        let userId = await AsyncStorage.getItem('userId') || '';
        let startAddr = autoComplete1.current.getAddressText();
        let endAddr = autoComplete2.current.getAddressText();
        let startLat = `${marker1.latitude}`;
        let startLng = `${marker1.longitude}`;
        let endLat = `${marker2.latitude}`;
        let endLng = `${marker2.longitude}`;
        if(!(startAddr&&endAddr)){
            Alert.alert('알림','출발지, 도착지가 모두 입력되어야합니다.',[
                {text:'확인',style:'cancel'},
              ]);
            return;
        }
        api.call(userId,startLat,startLng,
          startAddr,endLat,endLng,endAddr)
          .then(res=>{
           let {code, message} = res.data[0];
           let title = '알림';
           if(code == 0){
               navigation.navigate("Main_List");
           }else{
               title = '오류';
           }
           Alert.alert(title, message, [{
               text:'확인',style:'cancel',
           }]);


          }).catch(err=>{
              console.log('api call / err = '+JSON.stringify(err));
        });
    };

    const [showBtn, setShowBtn] = useState(false);
    const [initialRegion, setInitialRegion] = useState({
        latitude: 37.5666612,
        longitude: 126.9783785,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });
    const mapRef : any = useRef(null);
    const [loading, setLoading] = useState(false);
    const [selectedLatLng, setSelectedLatLng] = useState({
        latitude: 0,
        longitude: 0,
    });
    const [selectedAddress, setSelectedAddress] = useState('');

    const handleLongPress = async (event : any)=>{
        const {coordinate} = event.nativeEvent;
        setSelectedLatLng(coordinate);
        setLoading(true);
        api.geoCoding(coordinate,query.key)
          .then(res=>{
            setSelectedAddress(res.data.results[0].formatted_address);
            setShowBtn(true);
            setLoading(false);
          })
          .catch(err=>{
              console.log(JSON.stringify(err));
              setLoading(false);
          });
    };

    const autoComplete1 : any = useRef(null);
    const autoComplete2 : any = useRef(null);

    const handlerMarker = (title:string) => {
        if(selectedAddress){
            if(title=='출발지'){
                setMarker1(selectedLatLng);
                if(autoComplete1.current){
                    autoComplete1.current.setAddressText(selectedAddress);
                }
            }else{
                setMarker2(selectedLatLng);
                if(autoComplete2.current){
                    autoComplete2.current.setAddressText(selectedAddress);
                }
            }
            setShowBtn(false);
        }
    };

    // const callHandler = () => {
    //     axios.post('http://10.0.2.2:3000/taxi/call',{
    //         userId: 'a',
    //         startAddr: `${startAddr}`,
    //         endAddr: `${endAddr}`,
    //         startLat: "0",
    //         startLng: "0",
    //         endLat: "0",
    //         endLng: "0",
    //     })
    //     .then(res => {
    //        console.log(res.data);
    //        console.log('call');
    //     })
    //       .catch(err => {
    //           console.log(err);
    //       });
    // };
    
    let query = {
      key: 'AIzaSyBCYowvUvStx61Cw4efeACvKAb3VlHkfNU',
        lang: 'ko',
        components:'country:kr',
    };

    const [marker1, setMarker1] = useState({latitude:0,longitude:0});
    const [marker2, setMarker2] = useState({latitude:0,longitude:0});
    const onSelectAddr = (data:any, details:any, type:string) => {
        if(details){
            let lat = details.geometry.location.lat;
            let lng = details.geometry.location.lng;

            if(type=='start'){
                setMarker1({latitude: lat, longitude: lng});
                if(marker2.longitude==0){
                    setInitialRegion({latitude:lat, longitude:lng,latitudeDelta:0.0073,longitudeDelta: 0.0064});
                }
            }else{
                setMarker2({latitude: lat,longitude: lng});
                if(marker1.longitude == 0){
                    setInitialRegion({
                        latitude:lat,
                        longitude:lng,
                        latitudeDelta: 0.0073,
                        longitudeDelta: 0.0064,
                    });
                }
            }
        }
    };
    if(marker1.latitude != 0 && marker2.latitude != 0){
        if(mapRef.current){
            mapRef.current.fitToCoordinates([marker1,marker2],{
                edgePadding: {top:120,right:50,bottom:50,left:50},
                animated:true,
            });
        }
    }

    const setMyLocation = () =>{
        setLoading(true);
        Geolocation.getCurrentPosition((position)=>{
            const {latitude, longitude} = position.coords;
            let coords = {latitude,longitude};
            setMarker1(coords);
            setInitialRegion({latitude: 0,longitude: 0,latitudeDelta: 0,longitudeDelta: 0});
            setInitialRegion({latitude:latitude,longitude:longitude,latitudeDelta:0.0073,longitudeDelta:0.0064});

            api.geoCoding(coords,query.key)
              .then(res=>{
                  let addr = res.data.results[0].formatted_address;
                  autoComplete1.current.setAddressText(addr);
                  setLoading(false);
              })
              .catch(err=>{
                  console.log(JSON.stringify(err));
                  setLoading(false);
              });
        },
          (error) => {
            setLoading(false);
            console.log('Geolocation 오류 / error = '+JSON.stringify(error));
          },
          {
              enableHighAccuracy:false,
              timeout:10000,
              maximumAge:1000,
          }
        );


    };

    return(
        <SafeAreaView style={styles.container}>
            <MapView style={styles.container} provider={PROVIDER_GOOGLE}
                     region={initialRegion} ref={mapRef} onLongPress={handleLongPress}
                    onPress={()=>{setShowBtn(false)}}>
                <Marker coordinate={marker1} title={'출발 위치'}/>
                <Marker coordinate={marker2} title={'도착 위치'} pinColor={'blue'}/>
                {marker1.latitude != 0 && marker2.latitude != 0 && (
                  <Polyline coordinates={[marker1,marker2]}
                            strokeColor={'blue'}
                            strokeWidth={3}/>
                )}
            </MapView>

            <View style={{position:'absolute',width:'100%',height:'100%',padding:10}}>
                <View style={{position:'absolute', padding:wp(2)}}>
                    <View style={{width:wp(75)}}>
                        <GooglePlacesAutocomplete placeholder={'출발지 검색'} query={query} ref={autoComplete1}
                                                  minLength={2} keyboardShouldPersistTaps={'handled'}
                                                  fetchDetails={true} enablePoweredByContainer={false}
                                                  onFail={(err)=>console.log(err)}
                                                  onNotFound={()=>console.log('no results')}
                                                  styles={{autoCompleteStyles}}
                                                  onPress={(data, details)=>onSelectAddr(data,details,'start')}
                        />
                    </View>
                    <View style={{width:wp(75)}}>
                        <GooglePlacesAutocomplete placeholder={'도착지 검색'} query={query} ref={autoComplete2}
                                                  minLength={2} keyboardShouldPersistTaps={'handled'}
                                                  fetchDetails={true} enablePoweredByContainer={false}
                                                  onFail={(err)=>console.log(err)}
                                                  onNotFound={()=>console.log('no results')}
                                                  styles={{autoCompleteStyles}}
                                                  onPress={(data, details)=>onSelectAddr(data,details,'end')}

                        />
                    </View>
                </View>
                <TouchableOpacity style={[styles.button, {position:'absolute',width:wp(18), top:wp(2),
                right:wp(2), height:90, justifyContent:'center'}]}>
                    <Text style={[styles.buttonText]}
                    onPress={callTaxi}>호출</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={[{position:'absolute', bottom:20,right:20}]}
            onPress={setMyLocation}>
                <Icon name={"crosshairs"} size={40} color={"34db98"}/>
            </TouchableOpacity>
            {
                showBtn && <View style={{position:'absolute', top: hp(50)-45, left:wp(50)-75,
                  height:90,width:150}}>
                  <TouchableOpacity style={[styles.button, {flex:1, marginVertical:1}]}
                                    onPress={()=>{handlerMarker('출발지');}}>
                      <Text style={styles.buttonText}>출발지로 등록</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.button, {flex:1}]}
                                    onPress={()=>{handlerMarker('목적지');}}>
                      <Text style={styles.buttonText}>목적지로 등록</Text>
                  </TouchableOpacity>
              </View>
            }
            <Modal transparent={true} visible={loading}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <Icon name={'spinner'} size={50} color={'blue'}/>
                    <Text style={{backgroundColor:'white',color:'black',height:20}}>
                        Loading...
                    </Text>
                </View>
            </Modal>
        </SafeAreaView>
    );
}
const autoCompleteStyles = StyleSheet.create({
    textInputContainer: {
        width:'100%',
        backgroundColor:'#e9e9e9',
        borderRadius:8,
        height:40
    },
    textInput:{
        height:40,
        color:'#5d5d5d',
        fontSize:16,
    },
    predefinedPlacesDescription:{
        color:'#1faadb',
        zIndex: 1,
    },
})
const styles = StyleSheet.create({
    textBlack: {
        fontSize:18,
        color: 'black',
    },
    textBlue:{
        fontSize:18,
        color:'blue',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width:'100%',
    },
    input:{
        height:40,
        borderWidth:2,
        borderColor:'gray',
        marginVertical:1,
        padding:10,
    },
    button: {
        backgroundColor: '#3498db',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonDisable:{
        backgroundColor: 'gray',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        textAlign:'center',
    },
});
export default Main_Map;
