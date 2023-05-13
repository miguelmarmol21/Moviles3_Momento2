import { Text, View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { styles } from "../assets/styles/styles";

// const rents = [{rentNumber: "1012",userName: "luismm",plateNumber: "1010",rentDate: "30/04/2023",}];

export default function RentScreen({ navigation }) {
  const [plateNumber, setPlateNumber] = useState("");
  const [stateCar, setStateCar] = useState("");
  const [userName, setUserName] = useState("");
  const [rentNumber, setRentNumber] = useState("");
  const [rentDate, setRentDate] = useState("");
  const [errorMess, setErrorMess] = useState("");
  const [sw, setSw] = useState("");

  //Funcion que obtiene los datos del Screen CarScreen
  const getValuesCars = async () => {
    let values = await AsyncStorage.getItem("keyCar");
    return new Promise((resolve, reject) => {
      if (values.length === 0) {
        reject(new Error("No existen datos"));
      } else {
        setTimeout(() => {
          resolve(JSON.parse(values));
        }, 1500);
      }
    });
  };

  const getValuesRent = async () => {
    let values = await AsyncStorage.getItem("keyRent");
    return new Promise((resolve, reject) => {
      if (values.length === 0) {
        reject(new Error("No existen datos"));
      } else {
        setTimeout(() => {
          resolve(JSON.parse(values));
        }, 1500);
      }
    });
  };

  function loadDataCar(){
    const valuesCars = getValuesCars();
    valuesCars
    .then((values)=>{
      console.log(values)
      let findPlateNumber = values.find((value) => plateNumber == value.plateNumber);
      console.log(findPlateNumber.state);
      if(plateNumber === ''){
        setErrorMess("Ingrese una placa a buscar");
      }else if(findPlateNumber != undefined){
        setStateCar(findPlateNumber.state ? 'Disponible':'NO Disponible');
        setErrorMess("Placa Consultada");
      }else{
        setStateCar('NO Disponible');
        setErrorMess("Placa NO existe");
      }
      setSw('1')
    })
    .catch((Error)=>{
      console.log(Error.message);
      if(plateNumber === ''){
        setErrorMess("Ingrese una placa a buscar");
      }else{
        setStateCar('NO Disponible');
        setErrorMess("Placa NO existe");
      }
      setSw('1')
    })
  }

  function setRentCars() {
    const valuesCars = getValuesRent();
    valuesCars
      .then((values) => {
        console.log(values);
        let findRent = values.find((value) => rentNumber == value.rentNumber);
        //Condiciones
        if (userName === '' || rentNumber === '' || rentDate === '') {
          setErrorMess("Ingrese todos los valores");
        } else if (findRent != undefined) {
          setErrorMess("Numero de renta ya existe");
        } else if(stateCar == false) {
          setErrorMess("La Placa NO esta Disponible");
        }else{
          values.push({plateNumber:plateNumber,stateCar:false,userName:userName,rentNumber:rentNumber,rentDate:rentDate})
          AsyncStorage.setItem("keyRent", JSON.stringify(values));
          setErrorMess("Renta Guardada");
          pushArrayCar()
          Limpiar()
          setSw('0')
          setTimeout(() => {
            Limpiar()
          }, 3000);
        }

      })
      .catch((Error) => {
        console.log(Error.message);
        if (userName === '' || rentNumber === '' || rentDate === '') {
          setErrorMess("Ingrese todos los valores");
        } else {
          let rentObj = [{plateNumber:plateNumber,stateCar:false,userName:userName,rentNumber:rentNumber,rentDate:rentDate}];
          AsyncStorage.setItem("keyRent", JSON.stringify(rentObj));
          setErrorMess("Renta Guardada");
          pushArrayCar()
          setSw('0')
          setTimeout(() => {
            Limpiar()
          }, 3000);
        }
      });
  }

  function pushArrayCar() {
    const valuesCars = getValuesCars();
    valuesCars
      .then((values) => {
        console.log(values);
        values.forEach(value =>{
          if(value.plateNumber === plateNumber){
            value.state = false
          }
        })
        console.log(values);
        AsyncStorage.setItem("keyCar", JSON.stringify(values));
      })
  }

  let searchRent = () =>{
    const searchValuesRent = getValuesRent();
    searchValuesRent
    .then((values) =>{
      let loadRent = values.find((value) => value.plateNumber === plateNumber)
      if(plateNumber === ''){
        setErrorMess('Ingrese todos los valores')
      }else if(loadRent != undefined){
        setStateCar(loadRent.stateCar ? 'Disponible':'NO Disponible')
        setUserName(loadRent.userName)
        setRentNumber(loadRent.rentNumber)
        setRentDate(loadRent.rentDate)
        setErrorMess('Renta Encontrada')
      }else{
        setErrorMess("Renta no Existe");
      }
    })
    .catch((Error) =>{
      console.log(Error.message);
      if (plateNumber === "") {
        setErrorMess("Ingrese una Placa");
      } else {
        setErrorMess("Renta no Existe");
      }
    });
  }

  let Limpiar = () => {
    setPlateNumber('')
    setStateCar('')
    setUserName('')
    setRentNumber('')
    setRentDate('')
    setErrorMess('')
  };

  return (
    <View style={[styles.container]}>
      <Text style={{fontFamily:'Arial',fontSize:30,marginTop:10}}>Renta de Carros</Text>
      <TextInput
        style={styles.texinput}
        activeOutlineColor="#0265FE"
        outlineColor="#919191"
        label="Nro Placa"
        mode="outlined"
        onChangeText={(plateNumber) => setPlateNumber(plateNumber)}
        value={plateNumber}
      />
      <TextInput
        style={styles.texinput}
        activeOutlineColor="#0265FE"
        outlineColor="#919191"
        label="Estado Placa"
        mode="outlined"
        editable={false}
        value={stateCar =='' ? 'Disponible': stateCar}
      />
      <TextInput
        style={styles.texinput}
        activeOutlineColor="#0265FE"
        outlineColor="#919191"
        label="Usuario"
        mode="outlined"
        onChangeText={(userName) => setUserName(userName)}
        value={userName}
      />
      <TextInput
        style={styles.texinput}
        activeOutlineColor="#0265FE"
        outlineColor="#919191"
        label="Nro Renta"
        mode="outlined"
        onChangeText={(rentNumber) => setRentNumber(rentNumber)}
        value={rentNumber}
      />
      <TextInput
        style={styles.texinput}
        activeOutlineColor="#0265FE"
        outlineColor="#919191"
        label="Fecha Renta"
        mode="outlined"
        onChangeText={(rentDate) => setRentDate(rentDate)}
        value={rentDate}
      />
      <View style={[{flexDirection: "row", marginTop:20 }]}>
        <Button
          style={{ marginTop: 15, marginEnd: 10 }}
          icon="share"
          mode="contained"
          buttonColor="#0265FE"
          onPress={() => {
            if(sw==='1'){
              setRentCars();
            }else{
              setErrorMess('Se debe consultar una placa')
            }
          }}
        >Guardar</Button>
        <Button
          style={{ marginTop: 15 }}
          icon="repeat"
          mode="contained"
          buttonColor="#0265FE"
          onPress={loadDataCar}
        >Buscar Placa</Button>
      </View>
      <View style={[{flexDirection: "row" }]}>
      <Button
        style={{ marginTop: 15, marginEnd: 10 }}
        icon="repeat"
        mode="contained"
        buttonColor="#0265FE"
        onPress={searchRent}
      >Listar</Button>
      <Button
        style={{ marginTop: 15, marginEnd: 10 }}
        textColor="#0265FE"
        onPress={Limpiar}
      >Limpiar</Button>
      </View>
      <Text style={{fontFamily:'Arial',fontSize:15,marginTop:20,color:'red'}}>{errorMess}</Text>
    </View>
  );
}


