import express, {Request, Response} from 'express';
import PaymentFacadeFactory from '../../../modules/payment/factory/payment.facade.factory';

export const checkoutRoute = express.Router();

checkoutRoute.post('/', async (req: Request, res: Response) => {
    
    const facade = await PaymentFacadeFactory.create();

    try {
        
        const paymentInput = {
            orderId: req.body.orderId,
            amount: req.body.amount
        }
        
        const output = await facade.process(paymentInput);
        
        res.send(output);

    } catch(err) {
        res.status(500).send(err);
    }

});