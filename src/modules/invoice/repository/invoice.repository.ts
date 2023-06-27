import Invoice from "../domain/entity/invoice.entity";
import Product from "../domain/entity/product.entity";
import invoiceEntity from "../domain/entity/invoice.entity";
import InvoiceGateway from "../gateway/invoice.gateway";

import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "../domain/value-object/address";
import { InvoiceModel } from "./invoice.model";
import { ProductModel } from "./product.model";


export default class InvoiceRepository implements InvoiceGateway {
  
  async generate(invoice: invoiceEntity): Promise<void> {
    
    await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: invoice.items.map((item) => ({
          id: item.id.id,
          name: item.name,
          price: item.price
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    },
    {
        include: [
          {model: ProductModel},
        ],
    }
    );
  }

  async find(idItem: string): Promise<Invoice> {
   
    let invoiceModel;

    try {
      invoiceModel = await InvoiceModel.findOne({ 
        where: { id: idItem },
        include: ["items"],
      });
    } catch (error) {
        throw new Error("Invoice not found");
    }

    let items = invoiceModel.items.map((itemModel) => {
        let it = new Product({
          id: new Id(itemModel.id),
          name: itemModel.name,
          price: itemModel.price
        });
        
        return it;
    });

    const address = new Address(invoiceModel.street, invoiceModel.number, invoiceModel.complement, invoiceModel.city, 
      invoiceModel.state, invoiceModel.zipCode);

    const invoice = new Invoice({
      id: new Id(invoiceModel.id),
      name: invoiceModel.name,
      document: invoiceModel.document,
      address: address,
      items: items,
      createdAt: invoiceModel.createdAt,
      updatedAt: invoiceModel.updatedAt
    });

    return invoice;
  }
}
