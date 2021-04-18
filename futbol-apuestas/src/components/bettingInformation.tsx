import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";

export function PdfDocument(props: any) {
  return (
    <div style={{ marginBottom: 20 }}>
    <Document>
      <Page>
        <Text>Hola mundo</Text>
      </Page>
    </Document>
    </div>
  );
}