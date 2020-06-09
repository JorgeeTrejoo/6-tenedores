import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function UserGuest() {

    const navigation = useNavigation();

    return ( 
        <ScrollView centerContent = { true } style = { styles.viewBody } >
            <Image 
                source = { require("../../../assets/img/feliz.jpg") } 
                resizeMode = "contain"
                style = { styles.image }
        />
        <Text style = { styles.title } >Consulta tu perfil de 6 Tenedores</Text>
        <Text style = { styles.description }>
            ¿Comó describirías tu mejor restaurante? Busca y visualiza los mejores restaurantes
            de una forma sencilla, vota por el que te ha gustado más y comenta como ha sido tu 
            experiencia.
        </Text>
        <View style = { styles.viewBtn } >
            <Button 
                title = "Ver tu perfil"
                buttonStyle = { styles.btnVerPerfil }
                containerStyle = { styles.btnContainer }
                onPress = { () => navigation.navigate("login") }
            />
        </View>
        </ScrollView>
     );
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 40
    },
    title: {
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center"
    },
    description: {
        textAlign: "center",
        marginBottom: 20
    },
    viewBtn: {
        flex: 1,
        alignItems: "center"
    },
    btnVerPerfil: {
        backgroundColor: "#00A680"
    },
    btnContainer: {
        width: "70%"
    }
});