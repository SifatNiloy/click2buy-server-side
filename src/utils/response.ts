import { Response } from "express";

type BaseResponse = {
  res: Response;
  message?: string;
  data?: any;
};

export const SendResponse = {
  ok({ res, message = "OK", data = {} }: BaseResponse) {
    return res.status(200).json({ message, data });
  },
  created({ res, message = "Created", data = {} }: BaseResponse) {
    return res.status(201).json({ message, data });
  },
  noContent({ res, message = "No Content" }: BaseResponse) {
    return res.status(204).json({ message });
  }
};

export const SendErrorResponse = {
  error({ res, message = "Error", data = {} }: BaseResponse) {
    return res.status(400).json({ message, data });
  },
  notFound({ res, message = "Not Found", data = {} }: BaseResponse) {
    return res.status(404).json({ message, data });
  },
  unauthorized({ res, message = "Unauthorized", data = {} }: BaseResponse) {
    return res.status(401).json({ message, data });
  },
  serverError({ res, message = "Server Error", data = {} }: BaseResponse) {
    return res.status(500).json({ message, data });
  }
};
