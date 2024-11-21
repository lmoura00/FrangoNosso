import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
  KeyboardAvoidingView
} from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import MapView, {Marker} from "react-native-maps";
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { getDatabase, ref, set, child, push } from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { FloatingLabelInput } from 'react-native-floating-label-input';
import 'react-native-get-random-values';
import {app} from '../../firebaseConfig'

export function Cadastrar() {
  const key = require('../../app.json').expo.android.config.googleMaps.apiKey
  
  const [modalVisible, setModalVisible] = useState(false);
  const [pix, setPix] = useState(true);
  const [nome, setNome] = useState("");
  const [apelido, setApelido] = useState("");
  const [telefone, setTelefone] = useState("");
  const [especie, setEspecie] = useState(true);
  const [endereco, setEndereco] = useState("");
  const frango = {
    longitude:-42.8244316,
    latitude: - 5.1004679,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  };
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [descriptionPartida, setDescriptionPartida] = useState('');
  const db = getDatabase();
  const keyCliente = push(child(ref(db), "Child")).key;
  const navigation = useNavigation()
  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão foi negada!');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords.latitude,location.coords.longitude);
      console.log(location)
    })();
  }, []);

  let text = 'Esperando..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  function sendData(nome, apelido, endereco, pix, especie, descriptionPartida, telefone) {
    set(ref(db, 'Clientes/' + keyCliente + "/"), {
      name: nome,
      key: keyCliente,
      apelido: apelido,
      endereco: endereco,
      pix: pix,
      especie: especie,
      descriptionPartida: descriptionPartida,
      telefone: telefone
    })
      .then(() => {
        setModalVisible(true);
        console.log("enviado");
        setNome("");
        setApelido("");
        setEndereco("");
        setDescriptionPartida("");
        setTelefone("");
      });
  }

  function closeModal() {
    setModalVisible(false);
    navigation.navigate("Home");
  }

  return (
<View style={styles.container}>
      <Text style={styles.title}> CADASTRAR CLIENTES</Text>
      <ScrollView style={{ width: "100%" }}>
      <View style={{marginBottom:10, paddingHorizontal:10, marginTop:10}}>
          <FloatingLabelInput
              label='NOME'
              value={nome}
              onChangeText={value => setNome(value)}
              containerStyles={styles.inputFloat}
              customLabelStyles={{
                colorFocused:'#ffbc43',
                colorBlurred:'#ffbc43'
              }}
              inputStyles={{color:'#ffbc43'}}
          />
        </View>
        <View style={{marginBottom:10, paddingHorizontal:10, marginTop:10}}>
          <FloatingLabelInput
              label='APELIDO'
              value={apelido}
              onChangeText={value => setApelido(value)}
              containerStyles={styles.inputFloat}
              customLabelStyles={{
                colorFocused:'#ffbc43',
                colorBlurred:'#ffbc43'
              }}
              inputStyles={{color:'#ffbc43'}}
          />
        </View>
        <View style={{marginBottom:10, paddingHorizontal:10, marginTop:10}}>
          <FloatingLabelInput
              label='TELEFONE'
              value={telefone}
              onChangeText={value => setTelefone(value)}
              containerStyles={styles.inputFloat}
              customLabelStyles={{
                colorFocused:'#ffbc43',
                colorBlurred:'#ffbc43'
              }}
              inputStyles={{color:'#ffbc43'}}
          />
        </View>
        <View style={styles.title2}>
          <Text style={styles.texto}>FORMA DE PAGAMENTO</Text>
          <Text style={styles.texto}>PREFERIDA</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom:20
          }}
        >
          <BouncyCheckbox
            size={30}
            onPress={() => setPix(!pix) || console.log("Pix: ", pix)}
          />
          <Text style={styles.button1}>PIX</Text>
          <BouncyCheckbox
            bouncinessIn={10}
            bouncinessOut={1}
            onPress={() =>
              setEspecie(!especie) || console.log("Especie: ", especie)
            }
          />
          <Text style={styles.button1}>ESPECIE</Text>
        </View>
        <KeyboardAvoidingView>
          
        <GooglePlacesAutocomplete
          placeholder="ENDEREÇO?"
          onPress={(data, details = null) => {
            setDescriptionPartida(data.description);
            setEndereco({
              latitude: details.geometry.location.lat,
              longitude: details.geometry.location.lng,
              latitudeDelta: 0.00922,
              longitudeDelta: 0.00421,
            });
          }}
          query={{
            key: String(key),
            language: "pt-br",
            components: "country:br",
          }}
          enablePoweredByContainer={false}
          fetchDetails={true}
          
          textInputProps={{
            placeholderTextColor:'#ffbc43',
            returnKeyType:'search'
          }}
          suppressDefaultStyles={true}
          //currentLocation
          //currentLocationLabel='Current location'
          styles={{
            listView: { 
              minHeight: 150, 
              marginTop: 10,
              backgroundColor:'#2f2f2f',
              marginHorizontal:12
            },
            textInputContainer:{    
              backgroundColor: "#2f2f2f",
              width: "95%",
              height: 65,
              marginHorizontal:5,
              alignSelf:'center',
              borderRadius:8,
              borderWidth:1,
              justifyContent:'center',
              borderColor:"#ffbc43",
            },
            textInput:{
              color:'#ffbc43',
              marginHorizontal:10,
            },
            container:{
              height:350,
              display:'flex',
              ...endereco?{height:100}:{height:220},
              
            },
            loader:{
              backgroundColor:'#ffbc43'
            },
            row:{
              marginBottom:10,
              height:35,
              justifyContent:'center',
              
            },
            description:{
              color:"#ffbc43",
              fontSize:15,
              marginHorizontal:5
            },
            
            
          }}
          />
          </KeyboardAvoidingView>
        {/* <Text>{descriptionPartida}</Text> */}
        {
            endereco &&(
                <MapView style={styles.map} initialRegion={endereco} zoomEnabled loadingEnabled pitchEnabled={false} scrollEnabled={false}>
                <Marker coordinate={endereco}/>
                </MapView>
            )
        }

        <TouchableOpacity style={styles.buttonSalvar} onPress={() => sendData(nome, apelido, endereco, especie, pix, descriptionPartida, telefone)}>
          <Text style={styles.botao}>SALVAR</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Cliente cadastrado com sucesso!</Text>
            <TouchableOpacity
              style={{ ...styles.openButton, backgroundColor: "#007f00" }}
              onPress={closeModal}
            >
              <Text style={styles.textStyle} onPress={()=> setModalVisible(false)}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:55,
    backgroundColor: "#111111",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#ffcb74",
    width: "55%",
    elevation: 10,
    height: 45,
    margin: 10,
    borderRadius: 8,
    justifyContent: "center",
  },
  buttonSalvar: {
    backgroundColor: "green",
    width: "55%",
    elevation: 10,
    height: 45,
    margin: 10,
    alignSelf:'center',
    borderRadius: 8,
    justifyContent: "center",
  },
  text: {
    fontSize: 25,
    color: "#f6f6f6",
    textAlign: "center",
    fontFamily: "Inter_400Regular",
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    color: "#ffcb74",
    borderRadius: 10,
    elevation: 10,
    width: "70%",
    height: 65,
    textAlignVertical: "center",
    shadowColor: "#fff",
    backgroundColor: "#2f2f2f",
    textAlign: "center",
    fontFamily: "Inter_700Bold",
  },
  input: {
    backgroundColor: "#2f2f2f",
    width: "95%",
    height: 65,
    fontSize: 15,
    color: "#ffcb74",
    paddingHorizontal: 5,
    borderRadius: 8,
    borderColor: "#ffcb74",
    borderWidth: 1,
    margin: 10,
  },
  inputFloat: {
    backgroundColor: "#2f2f2f",
    width: "98%",
    height: 65,
    paddingHorizontal: 5,
    borderRadius: 8,
    borderColor: "#ffcb74",
    borderWidth:1
  },
  lastInput: {
    backgroundColor: "#2f2f2f",
    width: "95%",
    height: 65,
    fontSize: 15,
    color: "#ffcb74",
    paddingHorizontal: 5,
    borderRadius: 8,
    borderColor: "#ffcb74",
    borderWidth: 1,
    margin: 10,
    marginBottom: 45,
   
    
  },
  title2: {
    backgroundColor:'#ffcb74',
    opacity:0.8
  },
  texto: {
    color: "#2f2f2f",
    fontFamily: "Inter_400Regular",
    fontSize: 20,
    textAlign: "center",
  },
  button1: {
    color: "#ffcb74",
    fontFamily: "Inter_400Regular",
    fontSize: 20,
    textAlign: "center",
    margin: 5,
    marginRight: 20,
  },
  map: {
    width: "80%",
    height: 350,
    alignSelf:'center'
  },
  botao: {
    color: "#fff",
    textAlign: "center",
    fontSize: 25,
    fontFamily: "Inter_600SemiBold",
  },
  centeredView: {
    top:"50%",
    left:"50%",
    right:"50%",
    bottom:"50%",
    width:350,
    height:350
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});
