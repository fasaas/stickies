import React from 'react';
import { App } from "../src/App";
import { render } from "@testing-library/react-native";

describe("Given tests", () => {
    it("Then I can run them", () => {
        const { queryByTestId } = render(<App />)
        console.log("TCL: queryByTestId", queryByTestId)
        expect(true).toBeTruthy()
    })
})