import express, {Request, Response} from 'express';
import InvoiceFacadeFactory from '../../../modules/invoice/factory/invoice.facade.factory';
import Product from '../../../modules/invoice/domain/entity/product.entity';
import Id from '../../../modules/@shared/domain/value-object/id.value-object';

export const invoiceRoute = express.Router();

invoiceRoute.post('/', async (req: Request, res: Response) => {
    
    const facade = await InvoiceFacadeFactory.create();

    try {
        
        const items = req.body.items.map((item: { id: string; name: any; price: any; }) => {
            return new Product({
              id: new Id(item.id),
              name: item.name,
              price: Number(item.price),
            });
          });

        const invoiceInput = {
            id: req.body.id,
            name: req.body.name,
            document: req.body.document,
            street: req.body.street,
            number: req.body.number,
            complement: req.body.complement,
            city: req.body.city,
            state: req.body.state,
            zipCode: req.body.zipCode,
            items: items,
        }
        
        const output = await facade.generate(invoiceInput);
        
        res.send(output);


    } catch(err) {
        res.status(500).send(err);
    }

});

invoiceRoute.get('/', async (req: Request, res: Response) => {
    
    const facade = InvoiceFacadeFactory.create();

    try {

        const invoiceId = {
            id: req.body.invoiceId
        }

        const output = await facade.find(invoiceId);
        res.send(output);


    } catch(err) {
        res.status(500).send(err);
    }

});