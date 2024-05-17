"use strict";
const workerFunction = () => {
    //we perform every operation we want in this function right here
    self.onmessage = (event) => {
        console.log(event.data);
        postMessage('Message has been gotten!');
    };
};
