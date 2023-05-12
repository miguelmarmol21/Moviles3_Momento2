import { Text, View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { styles } from "../assets/styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { responsiveFontSizes } from "@mui/material";

export default function LoginScreen({navigation}) {
    const [formData,setFormData] = useState(defaultFormValues());
    const [showPass,setShowPass] = useState(false)
    const [errorMess,setErrorMess] = useState('');

    const onChange = (e, type) =>{
        setFormData({ ...formData,[type]: e})
    }
    
    //Funcion que obtiene los datos del Screen de RegisterScreen
    const getValuesArrayRegister = async () =>{
        let values = await AsyncStorage.getItem('keyUsers')
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
        
    function validationUser(){
        const usersValues = getValuesArrayRegister();
        usersValues.then((array) => {
            console.log(array)
                let findUser = array.find(arrayValue => arrayValue.userName == formData.userName  && arrayValue.password == formData.password)
                console.log(findUser);
                if(formData.userName == '' || formData.password == ''){
                    setErrorMess('Ingrese todos los campos')
                }else if(findUser != undefined){
                    setErrorMess('Iniciando Sesion')
                    setTimeout(()=>{
                        navigation.navigate('HomeTabs')
                        let user = [{name:findUser.name}]
                        AsyncStorage.setItem('keyUserLogin', JSON.stringify(user))
                    },3000)
                }else{
                    setErrorMess('Usuario y/o Contraseña INVALIDA')
                }
        }).catch((Error) =>{
            console.log(Error.message)
            if(formData.userName == '' || formData.password == ''){
                setErrorMess('Ingrese todos los campos')
            }else{
                setErrorMess('Usuario y/o Contraseña INVALIDA')
            }
        })
    }
    
    return (
        <View style={[styles.container]}>
            <Text style={{fontFamily:'Arial',fontSize:40}}>Inicia sesión</Text>
            <Text style={{fontFamily:'Arial',fontSize:15,marginTop:10}}>Utiliza tu cuenta de RentCar</Text>
            <TextInput
                style={styles.texinput}
                activeOutlineColor="#0265FE"
                outlineColor="#919191"
                label="Usuario"
                mode="outlined"
                onChangeText={(e) => onChange(e,"userName")}
                defaultValue={formData.userName}
                />
            <TextInput
                style={styles.texinput}
                activeOutlineColor="#0265FE"
                outlineColor="#919191"
                label="Contraseña"
                mode="outlined"
                right={<TextInput.Icon icon={showPass ? "eye-off":"eye"} onPress={()=>setShowPass(!showPass)}/>}
                onChangeText={(e) => onChange(e,"password")}
                defaultValue={formData.password}
                secureTextEntry={!showPass}
                />
            <View style={[{ backgroundColor: "#fff", flexDirection: "row",marginTop:20 }]}>
            <Button
                style={{marginTop:10,marginEnd: 10}}
                textColor="#0265FE"
                onPress={()=>{
                    setTimeout(()=>{
                        setErrorMess('')
                        navigation.navigate('Register')
                    },1000)
                }}
            >Crear Cuenta</Button>
            <Button
                style={{marginTop:10}}
                icon="login"
                mode="contained"
                buttonColor="#0265FE"
                onPress={()=>{
                    //Se llama la funcion que realiza la validacion de los datos
                        validationUser()
                        AsyncStorage.removeItem('keyUserLogin')
                    // AsyncStorage.clear()
                }}
            >Ingresar</Button>
            </View>
            <Text style={{fontFamily:'Arial',fontSize:15,marginTop:20,color:'red'}}>{errorMess}</Text>
        </View>
    );
}

const defaultFormValues = () =>{
    return { userName: "", password:"" }
}