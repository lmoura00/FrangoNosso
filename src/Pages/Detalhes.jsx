import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { useRoute } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import AntDesign from '@expo/vector-icons/AntDesign';
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  onValue,
  remove,
  update,
} from "firebase/database";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import { FloatingLabelInput } from 'react-native-floating-label-input';


export function Detalhes() {
  const navigation = useNavigation();
  const [pix, setPix] = useState(false);
  const [especie, setEspecie] = useState(false);
  const [endereco, setEndereco] = useState();
  const [destinoPartida, setDestinoPartida] = useState();
  const [aberto, setAberto] = useState(false);
  const [abertoEdit, setAbertoEdit] = useState(false);
  const [key, setKey] = useState("");
  const [nome, setNome] = useState();
  const [apelido, setApelido] = useState("");
  const [telefone, setTelefone] = useState("");
  const [keyCliente, setKeyCliente] = useState('')
  const route = useRoute();
  const db = getDatabase();
  useEffect(() => {
    console.log(route.params);
    if (route.params.pix === "true") {
      setPix(true);
    }
    if (route.params.especie === "true") {
      setEspecie(true);
    }
    if (route.params.endereco != "") {
      setEndereco(true);
    }
    console.log(pix, especie);
    console.log(route.params.telefone);
    setNome(route.params.name)
    setTelefone(route.params.telefone)
    setApelido(route.params.apelido)
    setDestinoPartida(route.params.destinoPartida)
    setKeyCliente(route.params.keyCliente)
  }, []);


  function removeCliente() {
    setAberto(false);
    remove(ref(db, "Clientes/" + key));
    navigation.goBack();
    console.log("Cliente apagado");
  }

  useEffect(() => {
    setKey(route.params.key);
    console.log(route.params.telefone);
  }, []);

  function up(){
    update(ref(db, 'Clientes/' + key), {
      name: nome,
      apelido: apelido,
      descriptionPartida:destinoPartida,
      telefone:telefone,
    })
    .then(()=>{
      console.log('Dados atualizados')
    });
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <Modal transparent visible={aberto} statusBarTranslucent>
          <View
            style={{
              width: "90%",
              height: 150,
              backgroundColor: "#2f2f2f",
              alignSelf: "center",
              marginTop: 320,
              borderRadius: 10,
              elevation: 10,
              borderWidth: 2,
              borderColor: "#ffbc43",
            }}
          >
            <Text style={styles.titleModal}>Tem certeza?</Text>
            <TouchableOpacity style={styles.botaoModal} onPress={removeCliente}>
              <Text style={styles.nome}>APAGAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botaoModalFechar}
              onPress={() => setAberto(false)}
            >
              <Text style={styles.nome}>FECHAR</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal transparent visible={abertoEdit} statusBarTranslucent>
          <View
            style={{
              width: "90%",
              height: 550,
              backgroundColor: "#2f2f2f",
              alignSelf: "center",
              marginTop: 200,
              borderRadius: 10,
              elevation: 10,
              borderWidth: 2,
              borderColor: "#ffbc43",
            }}
          >
            <Text style={styles.titleModal}>EDITAR CLIENTE</Text>
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
                inputMode="tel"
                hint="(86) 9 0000-0000"
                mask="(86) 9 0000-0000"
              />
            </View>
            <View style={{marginBottom:10, paddingHorizontal:10, marginTop:10}}>
              <FloatingLabelInput
                label='ENDEREÇO'
                value={destinoPartida}
                onChangeText={value => setDestinoPartida(value)}
                containerStyles={styles.inputFloat}
                customLabelStyles={{
                  colorFocused:'#ffbc43',
                  colorBlurred:'#ffbc43'
                }}
                inputStyles={{color:'#ffbc43'}}

              />
            </View>
            <TouchableOpacity style={styles.botaoModal} onPress={()=>up()}>
              <Text style={styles.nome}>ATUALIZAR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.botaoModalFechar}
              onPress={() => setAbertoEdit(false)}
            >
              <Text style={styles.nome}>CANCELAR</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Text style={styles.nomeTitulo}>CLIENTE</Text>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Text style={styles.nomeTit}>NOME: </Text>
          <Text style={styles.nome}>{route.params.name}</Text>
        </View>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Text style={styles.nomeTit}>APELIDO: </Text>
          {route.params.apelido != "" ? (
            <Text style={styles.nome}>{route.params.apelido}</Text>
          ) : (
            <Text style={styles.nomeGrande}>Sem apelido</Text>
          )}
        </View>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <Text style={styles.nomeTit}>TELEFONE: </Text>
          {route.params.telefone != "" ? (
            <Text style={styles.nome}>{route.params.telefone}</Text>
          ) : (
            <Text style={styles.nomeGrande}>Sem número</Text>
          )}
        </View>

        <Text style={styles.nomeTit}>ENDEREÇO: </Text>
        <Text style={styles.nomeEndereco}>{route.params.destinoPartida}</Text>
        {endereco && (
          <View style={styles.mapView}>
            <MapView
              initialRegion={route.params.endereco}
              style={styles.map}
              zoomControlEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              scrollEnabled={false}
            >
              <Marker coordinate={route.params.endereco} />
            </MapView>
          </View>
        )}

        <Text style={styles.nomeTit}>FORMA DE PAGAMENTO</Text>
        <View style={{ flexDirection: "row", alignSelf: "center" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 5,
              gap: 20,
            }}
          >
            <Text style={styles.nome}>PIX</Text>
            {pix ? (
              <AntDesign name="checkcircleo" size={24} color="#fff" />
            ) : (
              <AntDesign name="closecircleo" size={24} color="#fff" />
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 5,
              gap: 20,
            }}
          >
            <Text style={styles.nome}>ESPECIE</Text>
            {especie ? (
              <AntDesign name="checkcircleo" size={24} color="#fff" />
            ) : (
              <AntDesign name="closecircleo" size={24} color="#fff" />
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.botaoEdit} onPress={()=>setAbertoEdit(true)}>
          <Text style={styles.textBotao}>EDITAR CLIENTE</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botao} onPress={() => setAberto(true)}>
          <Text style={styles.textBotao}>APAGAR CLIENTE</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingTop: 25,
  },
  nome: {
    fontSize: 25,
    color: "#f9f9f9",
    textAlign: "justify",
  },
  nomeEndereco: {
    fontSize: 25,
    color: "#f9f9f9",
    alignSelf:'center',
    textAlign: "justify",
    width:270
  },
  nomeGrande: {
    fontSize: 25,
    color: "#f9f9f9",
  },
  nomeTit: {
    fontSize: 25,
    color: "#ffbc43",
    textAlign: "center",
  },
  nomeTitulo: {
    fontSize: 32,
    color: "#f9f9f9",
    textAlign: "center",
    marginBottom: 10,
    textDecorationLine: "underline",
  },
  map: {
    width: "93%",
    height: 385,
    alignSelf: "center",
    marginTop: 7,
    marginBottom: 5,
  },
  mapView: {
    width: "90%",
    height: 400,
    alignSelf: "center",
    borderRadius: 12,
    marginTop: 25,
    marginBottom: 25,
    elevation: 10,
    shadowColor: "#f9f9f9",
    backgroundColor: "#ffbc43",
  },
  botao: {
    width: "75%",
    backgroundColor: "red",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 10,
    shadowColor: "#ffbc43",
    alignSelf: "center",
    marginBottom: 80,
    marginTop:25
  },
  botaoEdit: {
    width: "75%",
    backgroundColor: "green",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 10,
    shadowColor: "#ffbc43",
    alignSelf: "center",
    marginBottom: 20,
    marginTop:25
  },
  botaoModal: {
    width: "75%",
    backgroundColor: "#ffcb74",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 10,
    shadowColor: "#2f2f2f",
    alignSelf: "center",
    marginBottom: 10,
  },
  botaoModalFechar: {
    width: "75%",
    backgroundColor: "#A30000",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    elevation: 10,
    alignSelf: "center",
    shadowColor: "#2f2f2f",
  },
  textBotao: {
    fontSize: 25,
    color:'#fff'
  },
  titleModal: {
    fontSize: 25,
    color: "#ffbc74",
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
