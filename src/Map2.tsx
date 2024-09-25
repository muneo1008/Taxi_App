import React, {useState} from 'react';
import {Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import axios from 'axios';

function Map2(): React.JSX.Element{
  console.log('--Map2()');
  const [showBtn, setShowBtn] = useState(false);
  const [pos1, setPos1] = useState('');
  const [pos2, setPos2] = useState('');
  const [imgNum, setImgNum] = useState(0);
  let startPos = ['대구가톨릭대학교','경북대','서울 시청','포항시청','인천시청'];
  let endPos = ['하양역','영진전문대','광화문','영일대','인제고등학교'];
  const rand = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  const images = {
    0: require('./imgs/1.png'),
    1: require('./imgs/2.png'),
    2: require('./imgs/3.png'),
    3: require('./imgs/4.png'),
    4: require('./imgs/5.png'),
  };
  const handleAddMarker = (title: string) => {
    setShowBtn(false);
  };
  const changeMap = () =>{
    let rand_int = rand(0,4);
    setPos1(startPos[rand_int]);
    setPos2(endPos[rand_int]);
    setImgNum(rand_int);
  };
  const callAddHandler = ()=>{
    axios.post('http://10.0.2.2:3000/taxi/call',{
        userId: 'test',
        startAddr: pos1,
        startLat: '0',
        startLng: '0',
        endAddr: pos2,
        endLat: '0',
        endLng: '0',
    }).then(res => {
      console.log('call ='+JSON.stringify(res.data[0]));
    }).catch(err => {
      console.log(JSON.stringify(err));
    });
  };


  return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.container,{transform: [{scaleX:1},{scaleY:2}]}]}>
          <Image source={images[imgNum]}/>
        </View>

        <View style={{position:'absolute',width:'100%',height:'100%',padding:10}}>
          <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}>
              <TextInput style={styles.input} placeholder={'출발지'} value={pos1}/>
              <TextInput style={styles.input} placeholder={'목적지'} value={pos2}/>
            </View>
            <TouchableOpacity style={[styles.button,{marginLeft:10,justifyContent:'center'}]}>
              <Text style={styles.buttonText} onPress={callAddHandler}>호출</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={[{position:'absolute',bottom:20,right:20}]}>
          <Icon name={'crosshairs'} size={40} color={'34db98'} onPress={changeMap}/>
        </TouchableOpacity>
        {
          showBtn && <View style={{position:'absolute',top:hp(50),left:wp(50)-75,height:90,width:150}}>
            <TouchableOpacity style={[styles.button,{flex:1, marginVertical:1}]}
                              onPress={()=>handleAddMarker('출발지')}>
              <Text style={styles.buttonText}>출발지로 등록</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{flex:1, marginVertical:1}]}
                              onPress={()=>handleAddMarker('도착지')}>
              <Text style={styles.buttonText}>도착지로 등록</Text>
            </TouchableOpacity>
          </View>
        }


      </SafeAreaView>
  );
}
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
export default Map2;