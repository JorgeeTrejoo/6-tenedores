import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//Importamos los iconos
import { Icon } from "react-native-elements";

//Importamos los stack (Para mostrar los titulos de arriba)
import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import TopRestaurantsStack from "./TopRestaurantsStack";
import SearchStack from "./SearchStack";
import AccountStack from "./AccountStack";

//Creamos el componente
const Tab = createBottomTabNavigator();

//Exportamos el componente
export default function Navigation(){
    return(
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName = "restaurants"
                tabBarOptions = {{
                    inactiveTintColor: "#646464",
                    activeTintColor: "#00A680"
                }}
                screenOptions = {({ route }) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color),
                })}
            >
                <Tab.Screen
                    name = "restaurants"
                    component = { RestaurantsStack }
                    options = {{
                        title: "Restaurantes"
                    }} 
                />
                <Tab.Screen
                    name = "favorites"
                    component = { FavoritesStack }
                    options = {{
                        title: "Favoritos"
                    }}  
                />
                <Tab.Screen
                    name = "top-restaurants"
                    component = { TopRestaurantsStack }
                    options = {{
                        title: "Top 5"
                    }}  
                />
                <Tab.Screen
                    name = "search"
                    component = { SearchStack }
                    options = {{
                        title: "Buscar"
                    }}  
                />
                <Tab.Screen
                    name = "account"
                    component = { AccountStack }
                    options = {{
                        title: "Cuenta"
                    }}  
                />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

//Iconos
function screenOptions(route, color){
    let iconName;

    switch (route.name) {
        case "restaurants":
            iconName = "compass-outline"
            break;
        case "favorites":
            iconName = "heart-outline"
            break;
        case "top-restaurants":
            iconName = "star-outline"
            break;
        case "search":
            iconName = "magnify"
            break;
        case "account":
            iconName = "account-outline"
            break;
    
        default:
            break;
    }
    return(
        <Icon type = "material-community" name = {iconName} size = { 22 }  color = { color } />
    )
}