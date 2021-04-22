import React, {useState}  from "react";
import axios from 'axios';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";
import type {Balance} from '../types/balanceInformation';

export function PdfDocument(Props: any) {
  let Data : Balance[] = [
    {
      user_name: "",
      last_name: "",
      ammount: 0,
      created: "",
      team_name: "",
      bet_type_name: "",
      side: "",
      winner: "",
      loser: "",
      draw: "",
    },
  ];

  const styles = StyleSheet.create({
    headers:{ 
      display: "flex", 
      justifyContent: "space-between", 
      fontWeight: 'bold', 
      backgroundColor: "#f6f6f6",
      paddingLeft: "2%",
      paddingRight: "2%"
    },
    content: {
      padding: 20,
      flexDirection: 'column',
    },
    table: {
      width: "100%",
    },
    row: {  
      backgroundColor: "#f7f7f7",
      padding: 5,
      paddingLeft: 10,
      paddingRight: 10
    },
    row1: {  
      padding: 5,
      paddingLeft: 10,
      paddingRight: 10
    },
  });

  const getData = async () => {
    let res = await axios.post('/bets/report', {
      headers: {authorization: Props.token},
    });
    Data = res.data;
  }
  getData();

  return (
    <Document>
      <Page>
          <div style={{ marginTop: 10, marginBottom: 15, textAlign: "center" }}>
            <Text>Banlance de Apuestas:</Text>
          </div>
          <View>
            <Text>Total ganancias: {}</Text>
          </View>
        </Page>
      {Data.map((user, index) => {
        return (
        <Page>
          <div style={{ marginTop: 10, marginBottom: 15, textAlign: "center" }}>
            <Text>Banlance #{index}</Text>
          </div>
          <View>
            <Text>Apostador: {user.user_name} {user.last_name}</Text>
            <Text>Fecha: {user.created}</Text>
            <Text>Equipo: {user.team_name}</Text>
            <Text>Tipo de apuesta: {user.bet_type_name}</Text>
            <Text>Es: {user.side}</Text>
            <Text>Gano: {user.winner}</Text>
            <Text>Perdio: {user.loser}</Text>
            <Text>Empato: {user.draw}</Text>
          </View>
        </Page>
      )})
    }
    </Document>
  );
}
      