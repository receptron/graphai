import express from "express";

export const hello = async (req: express.Request, res: express.Response) => {
  // const { params, query } = req;
  res.json({
    message: "hello",
  });
  res.end();
};

