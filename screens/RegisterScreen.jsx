import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, Button } from "react-native-paper";
import { useState } from "react";
import { styles } from "../assets/styles/styles";
import { validateEmail } from "../utils/helpers";
import { size } from "lodash";

export default function RegisterScreen({navigation}) {
    const [formDataRegister,setFormDataRegister] = useState(defaultFormValuesRegister());
    const [errorMess,setErrorMess] = useState('');
    const [showPass,setShowPass] = useState(false);
    const [showPassConf,setShowPassConf] = useState(false);

    const onChange = (e, type) =>{
        setFormDataRegister({ ...formDataRegister,[type]: e})
    }

    //Funcion que obtiene los datos del Screen LoginScreen
    const getValuesArrayUser = async () =>{
        let values = await AsyncStorage.getItem('keyUsers')
        return new Promise((resolve, reject) =>{
            if(values.length === 0){
                reject(new Error('No existen datos'))
            }
            else{
                setTimeout(()=>{ 
                    resolve(JSON.parse(values));
                },1500)
            }
        });
    }

    //Funcion que realiza las validaciones
    function setRegisterUser(){
        const valuesArray = getValuesArrayUser()
        valuesArray.then((values) =>{
            console.log(values)
            //if(values.length != undefined){
                let findArrayUser = values.find(value => formDataRegister.userName == value.userName)
                let findArrayEmail = values.find(value => formDataRegister.email == value.email)
                console.log(findArrayUser);
                console.log(findArrayEmail);
                //Condiciones
                if(formDataRegister.name === "" || formDataRegister.email === "" ||  formDataRegister.userName === "" || formDataRegister.password === "" || formDataRegister.confPassword === ""){
                    setErrorMess('Se debe ingresar todos los campos')
                }else if(findArrayEmail != undefined){
                    setErrorMess('Correo electronico ya fue registrado, intenta con otro')
                }else if(findArrayUser != undefined){
                    setErrorMess('Usuario ya fue registrado, intenta con otro')
                }else if(!validateEmail(formDataRegister.email)){
                    setErrorMess('Se debe Ingresar un Email Valido')
                }else if(size(formDataRegister.password)<6){
                    setErrorMess('Se debe Ingresar una contraseña de al menos de 6 caracteres')
                }else if(formDataRegister.password !== formDataRegister.confPassword){
                    setErrorMess('Las contraseñas no coinciden')
                }else{
                    setErrorMess('Registrado Exitosamente')
                    values.push({name:formDataRegister.name,email:formDataRegister.email,userName:formDataRegister.userName,password:formDataRegister.password,confPassword:formDataRegister.confPassword})
                    // Se envia el arreglo por medio del metodo AsyncStorage para la validacion en el Screen LoginScreen
                    AsyncStorage.setItem('keyUsers', JSON.stringify(values))
                    console.log(values);
                    setTimeout(()=>{
                        navigation.navigate('Login')
                    },3000)
                }
        }).catch((Error) =>{
            console.log(Error.message)
            if(formDataRegister.email === "" || formDataRegister.name === "" || formDataRegister.userName === "" || formDataRegister.password === "" || formDataRegister.confPassword === ""){
                setErrorMess('Se debe ingresar todos los campos')
            }else if(!validateEmail(formDataRegister.email)){
                setErrorMess('Se debe Ingresar un Email Valido')
            }else if(size(formDataRegister.password)<6){
                setErrorMess('Se debe Ingresar una contraseña de al menos de 6 caracteres')
            }else if(formDataRegister.password !== formDataRegister.confPassword){
                setErrorMess('Las contraseñas no coinciden')
            }else{
                setErrorMess('Registrado Exitosamente')
                let usrs = [{name:formDataRegister.name,email:formDataRegister.email,userName:formDataRegister.userName,password:formDataRegister.password,confPassword:formDataRegister.confPassword}]
                // Se envia el arreglo por medio del metodo AsyncStorage para la validacion en el Screen LoginScreen
                AsyncStorage.setItem('keyUsers', JSON.stringify(usrs))
                console.log(usrs);
                setTimeout(()=>{
                    navigation.navigate('Login')
                },3000)
            }
        })
    }

    return (
        <View style={[styles.container]}>
            <Text style={{fontFamily:'Arial',fontSize:40,marginTop:10}}>Crea tu cuenta</Text>
            <TextInput
                style={styles.texinput}
                label="Nombre"
                activeOutlineColor="#0265FE"
                outlineColor="#919191"
                mode="outlined"
                left={<TextInput.Icon icon="account"/>}
                onChangeText={(e) => onChange(e,"name")}
                defaultValue={formDataRegister.name}
            />
            <TextInput
                style={styles.texinput}
                activeOutlineColor="#0265FE"
                outlineColor="#919191"
                label="Correo Electronico"
                mode="outlined"
                left={<TextInput.Icon icon="account"/>}
                onChangeText={(e) => onChange(e,"email")}
                keyboardType="email-address"
                defaultValue={formDataRegister.email}
            />
            <TextInput
                style={styles.texinput}
                activeOutlineColor="#0265FE"
                outlineColor="#919191"
                label="Usuario"
                mode="outlined"
                left={<TextInput.Icon icon="account"/>}
                onChangeText={(e) => onChange(e,"userName")}
                defaultValue={formDataRegister.userName}
            />
            <TextInput
                style={styles.texinput}
                activeOutlineColor="#0265FE"
                outlineColor="#919191"
                label="Contraseña"
                mode="outlined"
                left={<TextInput.Icon icon="key"/>}
                right={<TextInput.Icon icon={showPass ? "eye-off":"eye"} onPress={()=>setShowPass(!showPass)}/>}
                onChangeText={(e) => onChange(e,"password")}
                secureTextEntry={!showPass}
                defaultValue={formDataRegister.password}
            />
            <TextInput
                style={styles.texinput}
                activeOutlineColor="#0265FE"
                outlineColor="#919191"
                label="Confirmacion"
                mode="outlined"
                left={<TextInput.Icon icon="key"/>}
                right={<TextInput.Icon icon={showPassConf ? "eye-off":"eye"} onPress={()=>setShowPassConf(!showPassConf)}/>}
                onChangeText={(e) => onChange(e,"confPassword")}
                secureTextEntry={!showPassConf}
                defaultValue={formDataRegister.confPassword}
            />
            <View style={[{ backgroundColor: "#fff", flexDirection: "row",marginTop:20 }]}>
            <Button
                style={{marginTop:20,marginEnd: 10}}
                icon="login"
                mode="contained"
                buttonColor="#0265FE"
                onPress={()=>{
                    //Se llama la funcion que realiza la validacion de los datos
                    setRegisterUser()
                    
                }}
            >Registrarse</Button>
            <Button
                style={{marginTop:20}}
                textColor="#0265FE"
                onPress={()=>{
                    setTimeout(()=>{
                        navigation.navigate('Login')
                    },1000)
            }}
            >Volver</Button>
            </View>
            <Text style={{fontFamily:'Arial',fontSize:15,marginTop:20,color:'red'}}>{errorMess}</Text>
        </View>
    );
}

  const defaultFormValuesRegister = () =>{
    return { name:"", email:"", userName: "", password:"", confPassword:"" }
    }