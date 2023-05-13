import { Text, View } from "react-native";
import { TextInput, Button, IconButton } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { styles } from "../assets/styles/styles";

export default function CarScreen({ navigation }) {
  const [plateNumber, setPlateNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [state, setState] = useState("");
  const [errorMess, setErrorMess] = useState("");

  const getValuesRent = async () => {
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

  let saveCar = () => {
    const saveArrayCar = getValuesRent();
    saveArrayCar
      .then((values) => {
        let findCar = values.find((value) => value.plateNumber == plateNumber);
        if (plateNumber === "" || brand === "") {
          setErrorMess("Ingrese todos los valores");
        } else if(findCar != undefined) {
          setErrorMess("La placa ingresada ya existe");
        }else{
          values.push({plateNumber: plateNumber,brand: brand,state: true});
          AsyncStorage.setItem("keyCar", JSON.stringify(values));
          setErrorMess("Placa Registrada");
        }
      })
      .catch((Error) => {
        console.log(Error.message);
        if (plateNumber === "" || brand === "") {
          setErrorMess("Ingrese todos los valores");
        } else {
          let obj = [{ plateNumber: plateNumber, brand: brand, state: true}];
          AsyncStorage.setItem("keyCar", JSON.stringify(obj));
          setErrorMess("Placa Registrada");
        }
      });
  };

  let searchCar = () => {
    const searchValuesCar = getValuesRent();
    searchValuesCar
      .then((values) => {
        console.log(values);
        let loadCar = values.find((value) => value.plateNumber === plateNumber);
        if (plateNumber === "") {
          setErrorMess("Ingrese todos los valores");
        } else if(loadCar != undefined){
            setBrand(loadCar.brand);
            setState(loadCar.state ? 'Disponible':'NO Disponible');
            setErrorMess("Placa Encontrada");
         } else {
            setState(loadCar.state ? 'Disponible':'NO Disponible');
            setErrorMess("Placa no existe");
          }
        })
      .catch((Error) => {
        console.log(Error.message);
        if (plateNumber === "") {
          setErrorMess("Ingrese una placa");
        } else {
          setState('NO Disponible');
          setErrorMess("Placa no existe");
        }
      });
  };

  let Limpiar = () => {
    setPlateNumber("");
    setBrand("");
    setState("");
    setErrorMess("");
  };

  return (
    <View style={[styles.container]}>
      <Text style={{fontFamily:'Arial',fontSize:30,marginTop:10}}>Ingresar Carro</Text>
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
        label="Marca"
        mode="outlined"
        onChangeText={(brand) => setBrand(brand)}
        value={brand}
      />
      <TextInput
        style={styles.texinput}
        activeOutlineColor="#0265FE"
        outlineColor="#919191"
        label="Estado"
        mode="outlined"
        editable={false}
        value={state =='' ? 'Disponible': state}
      />
      <View style={[{flexDirection: "row", marginTop:20}]}>
        <Button
          style={{ marginTop: 10, marginEnd: 10 }}
          icon='share'
          mode="contained"
          buttonColor="#0265FE"
          onPress={saveCar}
        >Guardar</Button>
        <Button
          style={{ marginTop: 10 }}
          icon='repeat'
          mode="contained"
          buttonColor="#0265FE"
          onPress={searchCar}
        >Listar</Button>
      </View>
      <Button  
      style={{ marginTop: 10 }}
      textColor="#0265FE" 
      onPress={Limpiar}
      >Limpiar</Button>
      <Text style={{fontFamily:'Arial',fontSize:15,marginTop:20,color:'red'}}>{errorMess}</Text>
    </View>
  );
}