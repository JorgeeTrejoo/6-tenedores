import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native'
import { ListItem } from "react-native-elements";
import { map } from "lodash";
import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordForm from "./ChangePasswordForm";

export default function AccountOptions(props){

    const { userInfo, toastRef, setReloadUserInfo } = props;
    //console.log(props);
    const [ showModal, setShowModal ] = useState(false);

    const [ renderComponent, setRenderComponent ] = useState(null);

    const selectComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm 
                        displayName = { userInfo.displayName }
                        setShowModal = { setShowModal }
                        toastRef = { toastRef }
                        setReloadUserInfo = { setReloadUserInfo }
                    />
                )
                setShowModal(true);
                break;
            
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email = { userInfo.email }
                        setShowModal = { setShowModal }
                        toastRef = { toastRef }
                        setReloadUserInfo = { setReloadUserInfo }
                    />
                )
                setShowModal(true);
                break;
            
            case "password":
                setRenderComponent(
                    <ChangePasswordForm 
                        setShowModal = { setShowModal }
                        toastRef = { toastRef }
                    />
                )
                setShowModal(true);
                break;
        
            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }
    }

    const menuOptions = generateOptions(selectComponent);
    //console.log(menuOptions);

    return (
        <View>
            { map(menuOptions, (menu, index) => (
                <ListItem 
                    key = { index }
                    title = { menu.title }
                    leftIcon = {{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft
                    }}
                    rightIcon = {{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight
                    }}
                    containerStyle = { styles.menuItem }
                    onPress = { menu.onPress }
                />
            ))}
            { renderComponent && (
                <Modal isVisible = { showModal } setIsVisible = { setShowModal } >
                { renderComponent }
                </Modal>
            )}
        </View>
    )
}

function generateOptions(selectComponent){
    return[
        {
            title: "Cambiar Nombre",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#CCC",
            iconNameRight: "chevron-right",
            iconColorRight: "#CCC",
            onPress: () => selectComponent("displayName")
        },
        {
            title: "Cambiar email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#CCC",
            iconNameRight: "chevron-right",
            iconColorRight: "#CCC",
            onPress: () => selectComponent("email")
        },
        {
            title: "Cambiar password",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#CCC",
            iconNameRight: "chevron-right",
            iconColorRight: "#CCC",
            onPress: () => selectComponent("password")
        }
    ]
}

const styles = StyleSheet.create({
    /*menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#E3E3E3"
    }*/
});