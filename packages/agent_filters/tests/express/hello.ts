import express from "express";

export const hello = async (__req: express.Request, res: express.Response) => {
  res.json({
    message: "hello",
  });
  res.end();
};
