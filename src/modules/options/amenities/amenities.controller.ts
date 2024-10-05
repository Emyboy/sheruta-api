import { NextFunction, Request, Response } from 'express';
import amenitiesModel from './amenities.model';

export default class AmenitiesController {
    private model = amenitiesModel;

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const createdModel = new this.model(req.body);
            const newModel = await createdModel.save();
            res.status(201).json({ data: newModel, message: 'created' });
        } catch (error) {
            next(error);
        }
    };

    public get = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const amenities = await this.model.find();
            res.status(200).json({ data: amenities, message: 'findAll' });
        } catch (error) {
            next(error);
        }
    };

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const updatedModel = await this.model.findByIdAndUpdate(req.params.id, req.body as any, {
                new: true,
            });
            res.status(200).json({ data: updatedModel, message: 'updated' });
        } catch (error) {
            next(error);
        }
    };

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const deletedModel = await this.model.findByIdAndDelete(req.params.id);
            res.status(200).json({ data: deletedModel, message: 'deleted' });
        } catch (error) {
            next(error);
        }
    };
}
