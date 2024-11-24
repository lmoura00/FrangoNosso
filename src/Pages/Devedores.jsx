import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions,
  BackHandler,
} from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { TextInputMask } from "react-native-masked-text";
import { Picker } from "@react-native-picker/picker";
import { getDatabase, ref, set, get, child, push } from "firebase/database";

export function Devedores() {
  const [modalOpen, setModalOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [devedores, setDevedores] = useState([]);
  const [Clientes, SetCliente] = useState([]);
  const [ClientesDados, SetClienteDados] = useState([]);
  const [listKeyDevedores, setListKeyDevedores] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [DadosClientes, setDadosClientes] = useState("");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const pickerRef = useRef();
  const db = getDatabase();
  const dbRef = ref(db);

  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();

  async function getCliente() {
    setLoading(true);
    try {
      const snapshot = await get(child(dbRef, "Clientes/"));
      const userData = [];

      snapshot.forEach((childItem) => {
        let data = {
          key: childItem.key,
          name: childItem.val().name,
          telefone: childItem.val().telefone,
        };
        userData.push(data);
      });

      userData.sort((a, b) => a.name.localeCompare(b.name));
      const nomesClientes = userData.map((item) => item.name);
      SetCliente(nomesClientes);
      SetClienteDados(userData);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDevedores() {
    try {
      const snapshot = await get(child(dbRef, 'Devedores'));
      const devedoresData = [];
  
      snapshot.forEach((childSnapshot) => {
        const devedorKey = childSnapshot.key;
        const devedorInfo = childSnapshot.val();
  
        // Itera sobre os valores aninhados
        Object.keys(devedorInfo).forEach((key) => {
          if (typeof devedorInfo[key] === 'object') {
            const rawTimestamp = devedorInfo[key].timestamp;
            const formattedDate = rawTimestamp
              ? new Date(rawTimestamp).toLocaleDateString('pt-BR')
              : 'Data não disponível';
  
            devedoresData.push({
              key: `${devedorKey}_${key}`, // Chave única combinando o devedor e a entrada
              name: devedorInfo.name || 'Desconhecido',
              valor: devedorInfo[key].valor || 'Não informado',
              timestamp: formattedDate,
            });
          }
        });
      });
  
      setDevedores(devedoresData);
    } catch (error) {
      console.error('Erro ao buscar devedores:', error);
    }
  }
  

  async function sendData() {
    const timestamp = new Date().getTime();
    const key = push(child(ref(db), "Child")).key;

    try {
      const devedorExistente = listKeyDevedores.includes(DadosClientes.key);
      if (devedorExistente) {
        await set(ref(db, `Devedores/${DadosClientes.key}/${key}`), {
          valor,
          timestamp,
        });
      } else {
        await set(ref(db, `Devedores/${DadosClientes.key}`), {
          name: DadosClientes.name,
          dataInsercao: data || formattedDate,
          [key]: {
            valor,
            timestamp,
          },
        });
      }
      setModalOpen(false);
      Alert.alert("Sucesso", "Cadastro efetuado com sucesso!");
      fetchDevedores();
    } catch (error) {
      console.error("Erro ao salvar devedor:", error);
    }
  }

  async function deleteDevedor(devedorKey) {
    try {
      await set(ref(db, `Devedores/${devedorKey}`), null);
      Alert.alert("Sucesso", "Devedor removido!");
      fetchDevedores();
    } catch (error) {
      console.error("Erro ao excluir devedor:", error);
    }
  }

  const handleChangeCliente = (itemValue) => {
    setClienteSelecionado(itemValue);
    const cliente = ClientesDados.find((item) => item.name === itemValue);
    setDadosClientes(cliente);
  };

  const filterDevedores = () => {
    if (!search.trim()) return devedores;
    return devedores.filter((devedor) =>
      devedor.name.toLowerCase().includes(search.toLowerCase())
    );
  };

  const renderItem = ({ item }) => (
    <View
      style={{ padding: 10, borderBottomColor: "#fff", borderBottomWidth: 1 }}
    >
      <Text style={{ color: "#fff" }}>{`Nome: ${item.name}`}</Text>
      <Text style={{ color: "#fff" }}>{`Valor: R$${item.valor}`}</Text>
      <Text style={{ color: "#fff" }}>{`Data: ${item.timestamp}`}</Text>
      <TouchableOpacity onPress={() => deleteDevedor(item.key)}>
        <Text style={{ color: "red" }}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    getCliente();
    fetchDevedores();
  }, []);
  const back  = BackHandler.addEventListener('hardwareBackPress',()=> (console.log('voltou')&&setModalOpen(false)))
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#ffbc43" />
      ) : (
        <>
          <Modal visible={modalOpen} statusBarTranslucent transparent animationType="slide" key={modalOpen ? 'open' : 'closed'}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.keyboardAvoidingView}
            >
              <View style={styles.modal}>
                <Text style={styles.Title1}>ADICIONAR</Text>
                <Picker
                  ref={pickerRef}
                  style={styles.list}
                  selectedValue={clienteSelecionado}
                  onValueChange={handleChangeCliente}
                  selectionColor="#fff"
                >
                  {Clientes.map((cliente, index) => (
                    <Picker.Item key={index} label={cliente} value={cliente} />
                  ))}
                </Picker>
                <TextInputMask
                  type="money"
                  value={valor}
                  onChangeText={setValor}
                  customTextInput={FloatingLabelInput}
                  customTextInputProps={{
                    label: "VALOR",
                    hint: "R$00,00",
                    containerStyles: styles.inputFloat,
                    inputStyles: { color: "#ffbc43" }, // Cor do texto digitado
                    hintTextColor: "#ffbc43", // Cor do placeholder
                    customLabelStyles: {
                      colorFocused: "#ffbc43", // Cor do rótulo quando focado
                      colorBlurred: "#ffbc43", // Cor do rótulo quando desfocado
                    },
                  }}
                />
                <FloatingLabelInput
                  label="DATA"
                  labelStyles={{ color: "#ffbc43" }}
                  value={data}
                  onChangeText={setData}
                  hint={formattedDate}
                  inputStyles={{ color: "#ffbc43" }}
                  hintTextColor="#ffbc43"
                  containerStyles={styles.inputFloat}
                  customLabelStyles={{
                    colorBlurred: "#ffbc43",
                    colorFocused: "#ffbc43",
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <TouchableOpacity style={styles.btSalvar} onPress={sendData}>
                    <Text style={styles.textBtSalvar}>SALVAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btFechar}
                    onPress={() => setModalOpen(false)}
                  >
                    <Text style={styles.textBtFechar}>FECHAR</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </Modal>

          <FloatingLabelInput
            label="Buscar"
            value={search}
            onChangeText={setSearch}
            containerStyles={styles.inputFloat}
          />

          <FlatList
            data={filterDevedores()}
            renderItem={renderItem}
            keyExtractor={(item) => item.key}
            ListEmptyComponent={
              <Text style={{ color: "#fff" }}>Nenhum devedor encontrado</Text>
            }
          />

          <TouchableOpacity
            style={modalOpen ? styles.btAddOff : styles.btAdd}
            onPress={() => setModalOpen(true)}
          >
            <Text style={styles.textBtAdd}>+</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const widthScreen = Dimensions.get('window').width
const heightScreen = Dimensions.get('window').height
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingTop: 35,
  },
  Title: {
    color: "#ffbc43",
    fontSize: 35,
    fontWeight: "900",
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 15,
    textDecorationLine: "underline",
  },
  Title1: {
    color: "#ffbc43",
    fontSize: 25,
    textTransform: "uppercase",
    textAlign: "center",
    marginTop: 15,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  btAdd: {
    backgroundColor: "green",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    borderColor: "#ffbc43",
    borderWidth: 2,
    position: "absolute",
    right: 20,
    bottom: 30,
    elevation: 10,
  },
  btAddOff: {
    backgroundColor: "green",
    display: "none",
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 40,
    borderColor: "#ffbc43",
    borderWidth: 2,
    position: "absolute",
    right: 20,
    bottom: 30,
    elevation: 10,
  },
  textBtAdd: {
    fontSize: 40,
    fontWeight: "900",
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: "center",
  },
  modal: {
    width: widthScreen - 50,
    height: heightScreen - 200,
    backgroundColor: "#2f2f2f",
    borderRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: "#ffbc43",
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignSelf: "center",  // Garante que o modal fique centralizado horizontalmente
    justifyContent: "center",  // Centraliza o conteúdo verticalmente
    position: "absolute",  // Fixa a posição
    top: 100, // Ajuste o valor conforme necessário
    left:20
  },
  btSalvar: {
    backgroundColor: "green",
    width: 90,
    height: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  textBtSalvar: {
    color: "#ffbc43",
    fontSize: 18,
    fontWeight: "600",
  },
  btFechar: {
    backgroundColor: "red",
    width: 90,
    height: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
  },
  textBtFechar: {
    color: "#ffbc43",
    fontSize: 18,
    fontWeight: "600",
  },
  inputFloat: {
    borderWidth: 1,
    borderColor: "#ffbc43",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 50,
    color: "#ffbc43",
    tintColor: "#ffbc43",
    marginBottom: 25,
  },
  list: {
    color: "#ffbc43",
    borderColor: "#FFbc43",
    borderWidth: 1,
    tintColor: "#ffbc43",
    borderRadius: 8,
    marginBottom: 20,
    marginTop: 20,
    borderStyle: "solid",
  },
});
