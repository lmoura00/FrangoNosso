import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";
import { FloatingLabelInput } from "react-native-floating-label-input";
import {
  getDatabase,
  ref,
  set,
  push,
  child,
  get,
  onValue,
  remove,
  update,
} from "firebase/database";

export function Vendas() {
  const [diaAtivo, setDiaAtivo] = useState(null);
  const [vendas, setVendas] = useState([]);
  const [produto, setProduto] = useState("");
  const [valor, setValor] = useState("");

  const iniciarDia = () => {
    const db = getDatabase();
    const novoDia = ref(db, "dias/");
    const diaId = push(novoDia).key;
    set(ref(db, `dias/${diaId}`), { vendas: [] });
    setDiaAtivo(diaId);
    setVendas([]);
  };

  const adicionarVenda = () => {
    if (produto && valor) {
      const novaVenda = { produto, valor: parseFloat(valor) };
      setVendas([...vendas, novaVenda]);

      const db = getDatabase();
      const vendasRef = ref(db, `dias/${diaAtivo}/vendas`);
      push(vendasRef, novaVenda);

      setProduto("");
      setValor("");
    }
  };

  return (
    <View style={styles.container}>
      {!diaAtivo ? (
        <Button title="Iniciar Dia" onPress={iniciarDia} />
      ) : (
        <View>
          <Text>Dia Ativo: {diaAtivo}</Text>
          <TextInput
            placeholder="Produto"
            value={produto}
            onChangeText={setProduto}
            style={styles.input}
          />
          <TextInput
            placeholder="Valor"
            value={valor}
            onChangeText={setValor}
            keyboardType="numeric"
            style={styles.input}
          />
          <Button title="Adicionar Produto" onPress={adicionarVenda} />
          <FlatList
            data={vendas}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Text style={{color:'#fff'}}>
                {item.produto}: R$ {item.valor.toFixed(2)}
              </Text>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
    paddingTop: 35,
  },
  titulo: {
    fontSize: 35,
    textAlign: "center",
    textTransform: "uppercase",
    fontWeight: "bold",
    marginTop: 5,
    color: "#ffbc43",
    fontFamily: "Inter_400Regular",
    textDecorationLine: "underline",
  },
  inputFloat: {
    backgroundColor: "#2f2f2f",
    width: 60,
    height: 65,
    paddingHorizontal: 5,
    borderRadius: 8,
    borderColor: "#ffcb74",
    borderWidth: 1,
  },
  item: {
    fontSize: 25,
    color: "#ffbc43",
  },
  butaoSalvar: {
    width: 150,
    height: 60,
    elevation: 10,
    shadowColor: "#ffbc43",
    backgroundColor: "green",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 35,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#ffbc43",
  },
  textButton: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "500",
  },
  input: { borderBottomWidth: 1, marginBottom: 10, backgroundColor:'#fff' },
});
