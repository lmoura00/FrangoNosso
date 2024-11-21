import React, {useEffect, useState, useCallback} from "react";
import {View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, RefreshControl, FlatList} from 'react-native'
import {
    getDatabase,
    ref,
    child,
    get,
    onValue,
    push,
    set,
  } from "firebase/database";
import { useNavigation } from "@react-navigation/native";

export function Clientes(){
    const userData = []
    const navigation = useNavigation();
    const [dados, setDados] = useState({})
    const [refreshing, setRefreshing] = useState(false)
    const wait = (timeout) => {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    };
    const dbRef = ref(getDatabase());


    async function readData(){
        console.log(userData.length)
        setDados({})
        userData.slice()
        get(child(dbRef,"Clientes/"))
        .then((snapshot) => {
            snapshot.forEach((childItem) => {
              let date = {
                key: childItem.key,
                name: childItem.val().name,
                apelido: childItem.val().apelido,
                pix: childItem.val().pix,
                especie:childItem.val().especie,
                destinoPartida: childItem.val().descriptionPartida,
                endereco: childItem.val().endereco,
                telefone: childItem.val().telefone
              };
    
              userData.push(date);
              setDados(userData);
              
              
              console.log(dados);
            });
          })
          .catch((error) => {
            console.error(error);
          });
    }
    async function readDataNew(){
        get(child(dbRef,"Clientes/"))
        .then((snapshot) => {
            snapshot.forEach((childItem) => {
              let date = {
                key: childItem.key,
                name: childItem.val().name,
                apelido: childItem.val().apelido,
                pix: childItem.val().pix,
                especie:childItem.val().especie,
                enderecoLocal: childItem.val().enderecoLocal,
                endereco: childItem.val().endereco,
                telefone: childItem.val().telefone
              };
              
              userData.push(... new Set(date));
              setDados(... new Set(userData));
              
              
              console.log(dados);
            });
          })
          .catch((error) => {
            console.error(error);
          });
    }

    useEffect(()=>{
        readData()
    },[])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true)
        readDataNew()
        wait(500).then(() => setRefreshing(false));
    }, []);

    return(
        <View style={styles.container}>
            <Text style={styles.text}>Clientes</Text>
        
            <RefreshControl
                style={{ flex: 1 }}
                onRefresh={onRefresh}
                refreshing={refreshing}
            >
                <FlatList
                    data={dados}
                    style={{marginBottom:125}}
                    refreshing
                    
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.botao}
                            onPress={() => navigation.navigate("Detalhes", item)}
                        >
                            <View style={{ flexDirection: "column" }}>
                              <View style={{flexDirection:'row'}}>
                                <Text style={styles.titulo}>NOME: </Text>
                                <Text style={styles.name}>{item.name}</Text>
                              </View>
                              <View style={{flexDirection:'row'}}>
                                <Text style={styles.titulo}>APELIDO: </Text>
                                {
                                  item.apelido !=""
                                  ?
                                  <Text style={styles.name}>{item.apelido}</Text>
                                  :
                                  <Text style={styles.name}>Sem apelido</Text>
                                }
                              </View>
                              <View style={{flexDirection:'row'}}>
                                <Text style={styles.titulo}>TELEFONE: </Text>
                                {
                                  item.telefone !=""
                                  ?
                                  <Text style={styles.name}>{item.telefone}</Text>
                                  :
                                  <Text style={styles.name}>Sem telefone</Text>
                                }
                              </View>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </RefreshControl>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#111111",
        alignItems:'center'
    },
    text:{
        fontSize:25,
        color:'#f6f6f6',
        fontFamily:'Inter_400Regular', 
        textDecorationLine:'underline',
    },
    botao: {
        flexDirection: "row",
        backgroundColor: "#fff",
        width: 350,
        height: 100,
    
        borderWidth: 2,
        marginBottom: 12,
        borderRadius: 8,
        elevation: 10,
    },
    name: {
        fontSize: 22,
        color: "#ffbc43",
        textTransform: "uppercase",
    },
    titulo:{
      fontSize:22,
      fontWeight:'bold',
      fontFamily:'Inter_400Regular', 
      textDecorationLine:'underline',
    },

})