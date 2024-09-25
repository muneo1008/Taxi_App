/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text, TouchableOpacity,
  View,
} from 'react-native';

function App(): React.JSX.Element {
  const [data, setData] = useState([]);
  const [addBtnState, setAddBtnState] = useState(true);
  const [cntNum, setCntNum] = useState(1);
  const [loss, setLoss] = useState(0);
  const [lossTotal, setLossTotal] = useState(0);
  const [disable, setDisable] = useState(false);
  const [totalKey, setTotalKey] = useState(0);

  let newData = [...data];
  let cnt = cntNum;
  const addItem = ()=>{
    if(addBtnState){
        while(newData.length < 10){
          const newItem = {key:String(cnt),value: `순번: ${cnt}`};
          cnt++;
          // @ts-ignore
          newData.push(newItem);
        }
        setCntNum(cnt);
      setData(newData);
      setAddBtnState(false);
    }else{
      const BData = [];
      newData.map((item)=>{
        // @ts-ignore
        if(item.key % 2 == 0){
          BData.push(item);
        };
      });
      while(BData.length < 10){
        const newItem = {key:String(cnt),value: `순번: ${cnt}`};
        cnt++;
        // @ts-ignore
        BData.push(newItem);
      }
      setCntNum(cnt);
      // @ts-ignore
      setData(BData);
      console.log(data);
    }
    console.log(newData);
    console.log(cntNum);
  };
  const arrayItem = ()=>{
      while(cnt % 10 !== 0){
        cnt++;
      }
      setCntNum(cnt);
      console.log(cntNum);
      const newData = [...data];
    for (let i = 0; i < 10; i++) {
      const newItem = {key:String(cnt),value: `순번: ${cnt}`};
      cnt++;
      // @ts-ignore
      newData.push(newItem);
    }
    setCntNum(cnt);
    // @ts-ignore
    setData(newData);

  };
  const delItem = ()=>{

    let middle = data.length / 2;
    console.log(middle);
    if(data.length % 2 != 0){
      newData = [...data];
      // @ts-ignore
      setLoss(Number(newData[Math.ceil(middle) - 1].key));
      // @ts-ignore
      setLossTotal(lossTotal + Number(newData[Math.ceil(middle) - 1].key));
      // @ts-ignore
      newData.splice(middle, 1);
      setData(newData);
      data.map((item)=>{
        // @ts-ignore
        setTotalKey(totalKey + item.key);
      })
      if(lossTotal < totalKey){
        setDisable(true);
      }
    }else{
      // @ts-ignore
      setLoss(Number(newData[Math.ceil(middle) - 1].key));
      // @ts-ignore
      setLossTotal(lossTotal + Number(newData[Math.ceil(middle) - 1].key));
      newData.splice(middle-1,1);
      setData(newData);
      data.map((item)=>{
        // @ts-ignore
        setTotalKey(totalKey + item.key);
      })
      if(lossTotal < totalKey){
        setDisable(true);
      }
    }
    console.log(data);
  };
  // @ts-ignore
  const renderItem = ({item})=>(
    <View style={styles.listItem}>
      <Text>{item.value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, {flex:5}]} onPress={addItem}>
          <Text style={styles.buttonText}>데이터 추가</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {flex:1}]} onPress={arrayItem}>
          <Text style={styles.buttonText}>정렬</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[disable ? styles.buttonDisable : styles.button, {flex:5}]} onPress={delItem} disabled={disable}>
          <Text style={styles.buttonText}>삭제</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.container, {flex: 5}]}>
        <FlatList data={data} renderItem={renderItem} keyExtractor={(item)=>item.key}/>
      </View>
      <View style={styles.container}>
        <Text>손실값: {loss}</Text>
        <Text>총 손실값: {lossTotal}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent:'flex-start',
    width:'100%',
    paddingTop:5,
  },
  listItem:{
    paddingTop:15,
    marginVertical:5,
    backgroundColor:'#f9c2ff',
    alignItems: 'center',
  },
  buttonContainer:{
    flexDirection:'row',
    width:'100%',
    paddingTop:5,
  },
  button: {
    backgroundColor: '#3498db', // 버튼 배경색상 추가
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    margin: 2,
  },
  buttonText: {
    color: '#fff', // 버튼 글자색상 추가
    fontSize: 18,
    fontWeight: 'bold',
    textAlign:'center',
  },
  buttonDisable:{
    width:'70%',
    backgroundColor: 'gray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default App;
