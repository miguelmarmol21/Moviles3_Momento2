import { Text,View } from "react-native"
import { styles } from "../assets/styles/styles"
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useEffect } from "react";

export default function ProfileScreen({navigation}){
    const [messageProfile, setMessageProfile] = useState("");

    useEffect(()=>{
        userLogin()
    },[])

    const getUser = async () =>{
        let values = await AsyncStorage.getItem('keyUserLogin')
        return new Promise((resolve,  ) =>{
            if(values.length === 0){
                reject(new Error('No existen datos'))
            }else{
                setTimeout(()=>{
                    resolve(JSON.parse(values));
                },1000)
            }
        });
    }

 function userLogin(){
        let user = getUser()
        user
        .then((values)=>{
            console.log(values)
            let usr
            values.forEach(value =>{
                usr = value.name
            })
            setMessageProfile(`Bienvenido ${usr}`)
        })
    }

    
    return (
    <View style = {styles.container}>
        <Text style={{fontFamily:'Arial',fontSize:30,marginTop:10}}>{messageProfile}</Text>
    </View>
    );
}