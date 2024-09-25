
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ParamListBase, useNavigation,useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

function Intro(): React.JSX.Element {
    console.log('--Intro()');
    const welcomeText = ['택시 앱 입니다.', '편하게 택시를 호출하세요.','테스트 문장1', '테스트 문장2', '테스트 문장3'];
    const [wText, setwText] = useState('');
    const rand = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    useFocusEffect(React.useCallback(()=>{
        setTimeout(async ()=>{
            let userId = await AsyncStorage.getItem('userId');
            let isAutoLogin = userId ? true : false;

            if(isAutoLogin){
                navigation.push('Main');
            }else{
                navigation.push('Login');
            }
        }, 5000);
    },[]));
    useEffect(()=>{
        setTimeout(()=>{
            let rand_int = rand(0,4);
            setwText(welcomeText[rand_int]);
        },1000);
    });

    return(
        <SafeAreaView style={styles.container}>
            <Icon name="taxi" size={100} color={'#3498db'}/>
            <Text style={{color:'black'}}>{wText}</Text>
        </SafeAreaView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default Intro;
