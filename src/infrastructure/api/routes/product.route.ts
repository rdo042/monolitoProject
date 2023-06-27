import express, {Request, Response} from 'express';
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory';

export const productRoute = express.Router();

productRoute.post('/', async (req: Request, res: Response) => {
    

    const facade = await ProductAdmFacadeFactory.create();

    try {
        
        const productInput = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        }
        
        const output = await facade.addProduct(productInput);
        
        res.send(output);


    } catch(err) {
        res.status(500).send(err);
    }

});

productRoute.get('/checkStock', async (req: Request, res: Response) => {
    
    const facade = ProductAdmFacadeFactory.create();

    try {

        const productId = {
            productId: req.body.productId
        }

        const output = await facade.checkStock(productId);
        res.send(output);


    } catch(err) {
        res.status(500).send(err);
    }

});