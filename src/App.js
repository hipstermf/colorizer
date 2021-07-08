import "./App.css";
import React, { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./themes.js";
import { GlobalStyles } from "./global";
import Header from "./components/Header";
import Mainboard from "./components/Mainboard";
import unsplash from "./api/unsplash";
import "./Mainboard.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ImageUpload from "./components/ImageUpload";

function App() {

    const [theme, setTheme] = useState("dark");

    const themeToggler = () => {
        theme === "light" ? setTheme("dark") : setTheme("light");
    };

    const [pins, setNewPins] = useState([]);

    const getImages = (term) => {
        return unsplash.get("https://api.unsplash.com/search/photos", {
            params: {
                query: term,
            },
        });
    };

    const onSearchSubmit = (term) => {
        getImages(term).then((res) => {
            let results = res.data.results;

            let newPins = [...results, ...pins];

            newPins.sort(function (a, b) {
                return 0.5 - Math.random();
            });
            setNewPins(newPins);
        });
    };

    const getNewPins = () => {
        let promises = [];
        let pinData = [];

        let pins = ["ocean", "night", "mountain", "wildlife", "tree"];

        pins.forEach((pinTerm) => {
            promises.push(
                getImages(pinTerm).then((res) => {
                    let results = res.data.results;

                    pinData = pinData.concat(results);
                    pinData.sort(function (a, b) {
                        return 0.5 - Math.random();
                    });
                })
            );
        });
        Promise.all(promises).then(() => {
            setNewPins(pinData);
        });
    };

    useEffect(() => {
        getNewPins();
    }, []);

    return (
        <Router>
            <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
                <GlobalStyles />

                <Header onSubmit={onSearchSubmit} onToggle={themeToggler} />
                <Switch>
                    <Route path="/following">
                        {console.log("following page")}
                        <ImageUpload />
                    </Route>
                    <Route path="/">
                        {console.log("homepage")}
                        <Mainboard pins={pins} />
                    </Route>
                </Switch>
            </ThemeProvider>
        </Router>
    );
}

export default App;