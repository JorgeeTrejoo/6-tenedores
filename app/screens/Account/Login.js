import React, { useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import LoginFrom from "../../components/Account/LoginForm";
import Toast from "react-native-easy-toast";

export default function Login(){

    const toastRef = useRef();

    return(
        <ScrollView>
            <Image 
                source = { require("../../../assets/img/logo.png") } 
                resizeMode = "contain"
                style = { styles.logo }
            />
            <View style = { styles.viewContainer } >
                <LoginFrom toastRef = { toastRef } />
                <CreateAccount />
            </View>
            <Divider style = { styles.divider } />
            <Toast 
                ref = { toastRef }
                position = "center"
                opacity = {0.9}
            />
        </ScrollView>
    )
}

function CreateAccount(){

    const navigation = useNavigation();
    
    return(
        <Text style = { styles.textRegister } >
            ¿Aún no tienes una cuenta? {" "}
            <Text 
                style = { styles.btnRegistrate } 
                onPress = { () => navigation.navigate("register") }
            >
                Regístrate
            </Text>
        </Text>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 30
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40
    },
    textRegister: {
        marginTop: 15,
        marginLeft: 10,
        marginRight: 10,
        fontWeight: "bold"
    },
    btnRegistrate: {
        color: "#00A680",
        fontWeight: "bold"
    },
    divider: {
        backgroundColor: "#00A680",
        margin: 40
    }
});