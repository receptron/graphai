export const home_functions = [
  {
    type: "function",
    function: {
      name: "fill_bath",
      description: "Fill the bath tub",
      parameters: {
        type: "object",
        properties: {
          temperature: {
            type: "number",
            description: "Water temperature in celsius. If omitted, 41 degree",
          },
          at: {
            type: "string",
            description: "Time to fill. If omitted immediately.",
          },
        },
        required: [],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "set_temperature",
      description: "Set the temperature",
      parameters: {
        type: "object",
        properties: {
          temperature: {
            type: "number",
            description: "Room temperature in celsius.",
          },
          location: {
            type: "string",
            enum: ["kitchen", "living room", "master bedroom", "bedroom 2", "bedroom 3", "all bedrooms"],
            description: "The room to set the temperature.",
          },
        },
        required: ["temperature", "location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "start_sprinkler",
      description: "Start the sprinkler system",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            enum: ["all", "lawn", "vegetable garden", "front yard"],
            description: "Specify the location to water.",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "take_picture",
      description: "Take a picture and send it",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            enum: ["entrance", "backyard", "kitchen", "living room"],
            description: "Specify the camera location to use.",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "play_music",
      description: "Play music",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            enum: ["living room", "master bedroom"],
            description: "Location to play a music.",
          },
          music: {
            type: "string",
            description: "Music to play, such as artist, title and playlist.",
          },
        },
        required: ["location"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "control_light",
      description: "Turn on/off various lights",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            enum: ["kitchen", "living room", "master bedroom", "bedroom 2", "bedroom 3", "front gate"],
            description: "Specify the location to control the light.",
          },
          switch: {
            type: "string",
            enum: ["on", "off"],
            description: "Specify the light switch.",
          },
          dim: {
            type: "number",
            description: "Specify the dim level between 0 and 1.0. The 'switch' parameter must be 'on'.",
          },
        },
        required: ["location", "switch"],
      },
    },
  },
];
