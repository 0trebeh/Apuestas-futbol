//import React, {useState}  from "react";
//import axios from 'axios';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
//import type {Balance} from '../types/balanceInformation';
//import {MenuOutlined} from '@ant-design/icons';

export default function PdfDocument() {
 /* const [loading, setLoading] = useState(false);

  const balance = [{
    user_name: "string",
    last_name: "string",
    ammount: 1,
    created: "string",
    team_name: "string",
    bet_type_name: "string",
    side: "string",
    winner: "string",
    loser: "string",
    draw: "string",
  }
];

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'user_name',
      key: 'user_name',
    },
    {
      title: 'Apellido',
      dataIndex: 'last_name',
      key: 'last_name',
    },
    {
      title: 'Monto',
      dataIndex: 'ammount',
      key: 'ammount',
    },
    {
      title: 'Fecha',
      dataIndex: 'created',
      key: 'created',
    },
    {
      title: 'Equipo',
      dataIndex: 'team_name',
      key: 'team_name',
    },
    {
      title: 'Tipo de apuesta',
      dataIndex: 'bet_type_name',
      key: 'bet_type_name',
    },
    {
      title: 'Gano',
      dataIndex: 'winner',
      key: 'winner',
    },
    {
      title: 'Perdio',
      dataIndex: 'loser',
      key: 'loser',
    },
    {
      title: 'Empato',
      dataIndex: 'draw',
      key: 'draw',
    },
  ];
*/
  return (
    <div style={{ marginBottom: 20 }}>
      <Document>
        <Page>
          <Text>Banlance de Apuestas:</Text>
        </Page>
      </Document>

    </div>
  );
}
/*      <Table
          dataSource={balance}
          columns={columns}
          size='small'
          loading={loading}
        />*/