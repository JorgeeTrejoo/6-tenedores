import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Search from "../screens/Search";

const Stack = createStackNavigator();

export default function SearchStack(){
    return(
        <Stack.Navigator
            screenOptions = {{
                headerTitleAlign: "center"
            }}
        >
            <Stack.Screen 
                name = "restaurants"
                component = { Search }
                options = {{
                    title: "Buscador"
                }}
            />
        </Stack.Navigator>
    )
}