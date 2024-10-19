import { NextFunction, Request, Response } from "express";
import workIndustryModel from "./work-industry.model";

export default class WorkIndustriesController {
  private model = workIndustryModel;

  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const entryExists = await this.model.findOne({
        slug: String(req.body.slug).trim().toLowerCase(),
      });
      if (entryExists) {
        return res.status(400).json({
          message: `${req.body.slug} already exits`,
        });
      }
      const createdModel = new this.model(req.body);
      const newModel = await createdModel.save();
      res.status(201).json({ data: newModel, message: "created" });
    } catch (error) {
      next(error);
    }
  };

  public get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const amenities = await this.model.find();
      res.status(200).json({ data: amenities, message: "findAll" });
    } catch (error) {
      next(error);
    }
  };

  public update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedModel = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body as any,
        {
          new: true,
        },
      );
      res.status(200).json({ data: updatedModel, message: "updated" });
    } catch (error) {
      next(error);
    }
  };

  public delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      //todo: check if there are requests using this entry and return bad request
      const deletedModel = await this.model.findByIdAndDelete(req.params.id);
      res.status(200).json({ data: deletedModel, message: "deleted" });
    } catch (error) {
      next(error);
    }
  };
}
