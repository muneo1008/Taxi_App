
import {SafeAreaView, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ParamListBase, useFocusEffect, useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Intro2(): React.JSX.Element {
    console.log('--Intro2()');
    const welcomeText = ['택시 앱 입니다.', '편하게 택시를 호출하세요.','테스트 문장1', '테스트 문장2', '테스트 문장3'];
    const [wText, setwText] = useState('');
    const [nickName, setNickName] = useState('');

    const navigation = useNavigation<StackNavigationProp<ParamListBase>>();
    useFocusEffect(React.useCallback(()=>{
        const loadNickname = async () => {
            const storedNickname = await AsyncStorage.getItem('nickname');
            // @ts-ignore
            setNickName(storedNickname);
        };
        loadNickname();
        setTimeout(async ()=>{
                navigation.push('Login');
        }, 5000);
    },[]));
    useEffect(()=>{
        welcomeText.map((text,index)=>{
            setTimeout(()=>{
                setwText(text);
            },1000 * index);
        });
    },[]);

    return(
        <SafeAreaView style={styles.container}>
            <Text style={{color:'black'}}>{nickName}님 환영합니다!</Text>
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
export default Intro2;
