import { Sequelize } from "sequelize-typescript";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/entity/product.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";
import { InvoiceModel } from "../../repository/invoice.model";
import InvoiceRepository from "../../repository/invoice.repository";
import GenerateInvoiceUseCase from "../generate-invoice/generate-invoice.usecase";
import { ProductModel } from "../../repository/product.model";


describe("Find Invoice Usecase unit test", () => {
  
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: "./src/database/teste.db",
      //logging: false,
      //sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
   // await sequelize.close();
  });
  
  it("should find a invoice", async () => {
    const repository = new InvoiceRepository();
    
    const item1 = new Product({id: new Id('1'), name: 'Product 1', price: 10});
    const item2 = new Product({id: new Id('2'), name: 'Product 2', price: 20});
    const products = [item1, item2];

    const input = {
      id: '1',
      name: 'Client 1',
      document: '10',
      street: 'Street 1',
      number: '1',
      complement: 'APTO 1',
      city: 'City 1',
      state: 'State 1',
      zipcode: '12345',
      items: products.map((product) => ({
        id: product.id.id,
        name: product.name,
        price: product.price
      })),
    }

    const usecaseList = new FindInvoiceUseCase(repository);

    const inputList = {
      id: "1",
    };

    const result = await usecaseList.execute(inputList);

    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(input.name);
    expect(result.document).toEqual(input.document);
    expect(result.address.street).toEqual(input.street);
    expect(result.address.city).toEqual(input.city);
    expect(result.address.state).toEqual(input.state);
    expect(result.address.complement).toEqual(input.complement);

    expect(result.items[0].id).toBe("1");
  });
});
